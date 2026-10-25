// POST /api/remry/stripe: Stripe's webhook. On `invoice.paid` (the first payment and every
// renewal) it signs a Remry Pro key, emails it, stamps the subscription with the license, and
// marks the invoice so a redelivered event sends nothing twice. On a full refund
// (`charge.refunded`) or a lost dispute (`charge.dispute.closed`) it revokes the license
// (revoke.ts). Stripe is the only record; there's no database.
//
// Never log a key, the private key or a full email address.

import type Stripe from "stripe";
import { licenseEmail, type SendLicenseEmail } from "./email.js";
import {
  buyerOf,
  licensePayloadFor,
  maskEmail,
  subscriptionIdOf,
} from "./invoice.js";
import { signLicenseKey } from "./license.js";
import { EXPIRES, LICENSE_ID, REVOKED } from "./metadata.js";
import {
  paymentTakenBack,
  revokeLicenseFor,
  type DispatchRevocation,
} from "./revoke.js";
import type { RemryStripe } from "./stripe.js";

export interface WebhookDeps {
  readonly stripe: RemryStripe;
  readonly webhookSecret: string;
  readonly privateKeyPem: string;
  /** When set, only invoices for this Stripe product issue keys. */
  readonly productId?: string;
  readonly sendLicenseEmail: SendLicenseEmail;
  readonly dispatchRevocation: DispatchRevocation;
  readonly log: (message: string) => void;
}

const REVOKING_EVENTS: ReadonlySet<string> = new Set([
  "charge.refunded",
  "charge.dispute.closed",
]);

const json = (
  status: number,
  body: Readonly<Record<string, unknown>>,
): Response => Response.json(body, { status });

const errorMessage = (e: unknown): string =>
  e instanceof Error ? e.message : String(e);

export const handleStripeWebhook = async (
  request: Request,
  deps: WebhookDeps,
): Promise<Response> => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return json(400, { ok: false, error: "missing signature" });

  const rawBody = await request.text();
  let event;
  try {
    event = await deps.stripe.constructEvent(
      rawBody,
      signature,
      deps.webhookSecret,
    );
  } catch {
    return json(400, { ok: false, error: "bad signature" });
  }

  if (REVOKING_EVENTS.has(event.type)) return revoke(event, deps);
  if (event.type !== "invoice.paid")
    return json(200, { ok: true, ignored: event.type });

  const invoiceId = event.data.object.id;
  if (!invoiceId) return json(200, { ok: true, ignored: "invoice without id" });
  try {
    // Fetched again rather than trusting the event body: it's current, and in the SDK's API version.
    const invoice = await deps.stripe.retrieveInvoice(invoiceId);
    if (invoice.metadata?.[LICENSE_ID]) {
      return json(200, { ok: true, alreadyIssued: true });
    }

    const buyer = await buyerOf(invoice, deps.stripe.retrieveCustomer);
    if (!buyer) throw new Error(`invoice ${invoiceId} has no customer email`);
    const payload = licensePayloadFor(invoice, buyer, deps.productId);
    if (!payload) {
      return json(200, {
        ok: true,
        ignored: "not a Remry Pro subscription invoice",
      });
    }

    // licensePayloadFor only returns a payload for a subscription invoice.
    const subscriptionId = subscriptionIdOf(invoice) ?? "";
    const subscription = await deps.stripe.retrieveSubscription(subscriptionId);
    const stamped = subscription.metadata ?? {};
    if (stamped[REVOKED]) {
      deps.log(
        `remry: ${payload.id} is revoked; no key for invoice ${invoiceId}`,
      );
      return json(200, { ok: true, ignored: "license revoked" });
    }

    const key = await signLicenseKey(payload, deps.privateKeyPem);
    await deps.sendLicenseEmail(licenseEmail(payload, key));
    // The subscription carries the license and its latest expiry. Never moved earlier, in
    // case an older invoice's event arrives after a renewal's.
    const latest = stamped[EXPIRES];
    if (!latest || payload.expires > latest) {
      await deps.stripe.setSubscriptionMetadata(subscriptionId, {
        [LICENSE_ID]: payload.id,
        [EXPIRES]: payload.expires,
      });
    }
    // Last: once the invoice is marked, a retry sends nothing, so everything above must be done.
    await deps.stripe.setInvoiceMetadata(invoiceId, {
      [LICENSE_ID]: payload.id,
      [EXPIRES]: payload.expires,
    });
    deps.log(
      `remry: issued ${payload.id} through ${payload.expires} to ${maskEmail(payload.email)} (invoice ${invoiceId})`,
    );
    return json(200, { ok: true, issued: payload.id });
  } catch (e) {
    // A 500 makes Stripe retry.
    deps.log(`remry: invoice ${invoiceId} failed: ${errorMessage(e)}`);
    return json(500, { ok: false, error: "could not issue license" });
  }
};

const revoke = async (
  event: Stripe.Event,
  deps: WebhookDeps,
): Promise<Response> => {
  try {
    const taken = await paymentTakenBack(event, deps.stripe);
    if ("ignored" in taken)
      return json(200, { ok: true, ignored: taken.ignored });
    const outcome = await revokeLicenseFor(
      taken.paymentIntentId,
      taken.reason,
      event.created,
      deps,
    );
    return json(200, { ok: true, ...outcome });
  } catch (e) {
    // A 500 makes Stripe retry.
    deps.log(`remry: ${event.type} ${event.id} failed: ${errorMessage(e)}`);
    return json(500, { ok: false, error: "could not revoke license" });
  }
};

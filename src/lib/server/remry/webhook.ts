// POST /api/remry/stripe: Stripe's webhook. On `invoice.paid` (the first payment and every
// renewal) it signs a Remry Pro key, emails it, and marks the invoice so a redelivered event
// sends nothing twice. Stripe is the only record; there's no database.
//
// Never log a key, the private key or a full email address.

import { licenseEmail, type SendLicenseEmail } from "./email.js";
import { buyerOf, licensePayloadFor, maskEmail } from "./invoice.js";
import { signLicenseKey } from "./license.js";
import type { RemryStripe } from "./stripe.js";

export interface WebhookDeps {
  readonly stripe: RemryStripe;
  readonly webhookSecret: string;
  readonly privateKeyPem: string;
  /** When set, only invoices for this Stripe product issue keys. */
  readonly productId?: string;
  readonly sendLicenseEmail: SendLicenseEmail;
  readonly log: (message: string) => void;
}

/** Invoice metadata that says a key was issued for it. */
export const ISSUED_LICENSE_ID = "remry_license_id";
export const ISSUED_EXPIRES = "remry_expires";

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
    event = deps.stripe.constructEvent(rawBody, signature, deps.webhookSecret);
  } catch {
    return json(400, { ok: false, error: "bad signature" });
  }

  if (event.type !== "invoice.paid")
    return json(200, { ok: true, ignored: event.type });

  const invoiceId = event.data.object.id;
  if (!invoiceId) return json(200, { ok: true, ignored: "invoice without id" });
  try {
    // Fetched again rather than trusting the event body: it's current, and in the SDK's API version.
    const invoice = await deps.stripe.retrieveInvoice(invoiceId);
    if (invoice.metadata?.[ISSUED_LICENSE_ID]) {
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

    const key = signLicenseKey(payload, deps.privateKeyPem);
    await deps.sendLicenseEmail(licenseEmail(payload, key));
    await deps.stripe.setInvoiceMetadata(invoiceId, {
      [ISSUED_LICENSE_ID]: payload.id,
      [ISSUED_EXPIRES]: payload.expires,
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

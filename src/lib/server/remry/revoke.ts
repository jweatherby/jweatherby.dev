// Refunds and lost chargebacks: revoke the license the payment bought. The Remry repo does the
// revoking (a dispatch to its revoke.yml, see github.ts); this finds which license and through
// when, then stamps the subscription so a redelivered event dispatches nothing twice and its
// renewals issue no more keys.

import type Stripe from "stripe";
import { subscriptionIdOf } from "./invoice.js";
import { EXPIRES, LICENSE_ID, REVOKED } from "./metadata.js";
import type { RemryStripe } from "./stripe.js";

export type RevocationReason = "refund" | "chargeback";

export interface Revocation {
  readonly id: string;
  /** The latest expiry issued for the license, so the revocation covers every key. */
  readonly expires: string;
  readonly reason: RevocationReason;
}

export type DispatchRevocation = (revocation: Revocation) => Promise<void>;

export interface RevokeDeps {
  readonly stripe: RemryStripe;
  readonly dispatchRevocation: DispatchRevocation;
  readonly log: (message: string) => void;
}

export type RevokeOutcome =
  | { readonly revoked: string }
  | { readonly alreadyRevoked: string }
  | { readonly ignored: string };

const idOf = (value: string | { readonly id: string } | null): string | null =>
  value === null ? null : typeof value === "string" ? value : value.id;

/** The later of two `YYYY-MM-DD` days, either of which may be missing. */
const laterDay = (
  a: string | undefined,
  b: string | undefined,
): string | undefined => (!a ? b : !b ? a : a > b ? a : b);

/** The PaymentIntent a full refund or lost dispute took back, or why there's nothing to revoke. */
export const paymentTakenBack = async (
  event: Stripe.Event,
  stripe: RemryStripe,
): Promise<
  | { readonly paymentIntentId: string; readonly reason: RevocationReason }
  | { readonly ignored: string }
> => {
  const objectId = (event.data.object as { readonly id?: string }).id;
  if (!objectId) return { ignored: `${event.type} without id` };

  if (event.type === "charge.refunded") {
    const charge = await stripe.retrieveCharge(objectId);
    // `refunded` is only true once the whole charge is: a partial refund keeps the license.
    if (!charge.refunded) return { ignored: "partial refund" };
    const paymentIntentId = idOf(charge.payment_intent);
    if (!paymentIntentId) return { ignored: "charge without payment intent" };
    return { paymentIntentId, reason: "refund" };
  }

  if (event.type === "charge.dispute.closed") {
    const dispute = await stripe.retrieveDispute(objectId);
    if (dispute.status !== "lost")
      return { ignored: `dispute ${dispute.status}` };
    const chargeId = idOf(dispute.charge);
    const paymentIntentId =
      idOf(dispute.payment_intent) ??
      (chargeId
        ? idOf((await stripe.retrieveCharge(chargeId)).payment_intent)
        : null);
    if (!paymentIntentId) return { ignored: "dispute without payment intent" };
    return { paymentIntentId, reason: "chargeback" };
  }

  return { ignored: event.type };
};

/** Revokes the license `paymentIntentId` paid for, if a key was ever issued for it. */
export const revokeLicenseFor = async (
  paymentIntentId: string,
  reason: RevocationReason,
  /** Seconds since the epoch: the event's `created`, so the stamp's day doesn't depend on retries. */
  at: number,
  deps: RevokeDeps,
): Promise<RevokeOutcome> => {
  const invoiceId =
    await deps.stripe.invoiceIdForPaymentIntent(paymentIntentId);
  if (!invoiceId) return { ignored: "payment without invoice" };

  const invoice = await deps.stripe.retrieveInvoice(invoiceId);
  const licenseId = invoice.metadata?.[LICENSE_ID];
  const subscriptionId = subscriptionIdOf(invoice);
  // No key was issued for this invoice (or it isn't Remry Pro's): nothing to revoke.
  if (!licenseId || !subscriptionId) return { ignored: "no license issued" };

  const subscription = await deps.stripe.retrieveSubscription(subscriptionId);
  if (subscription.metadata?.[REVOKED]) return { alreadyRevoked: licenseId };

  const expires = laterDay(
    subscription.metadata?.[EXPIRES],
    invoice.metadata?.[EXPIRES],
  );
  if (!expires)
    throw new Error(`invoice ${invoiceId} has ${LICENSE_ID} but no ${EXPIRES}`);

  await deps.dispatchRevocation({ id: licenseId, expires, reason });
  // After the dispatch: if it fails, the 500 makes Stripe retry it. If this stamp fails, the
  // retry dispatches again, and the Remry workflow treats an id already revoked as done.
  const day = new Date(at * 1000).toISOString().slice(0, 10);
  await deps.stripe.setSubscriptionMetadata(subscriptionId, {
    [REVOKED]: `${day} ${reason}`,
  });
  deps.log(
    `remry: revoked ${licenseId} through ${expires} (${reason}, invoice ${invoiceId})`,
  );
  return { revoked: licenseId };
};

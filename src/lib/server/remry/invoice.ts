// From a paid Stripe invoice to a Remry Pro license payload. Pure, so the webhook and the
// thanks page build the same payload, and so the same key, from the same invoice.

import type Stripe from "stripe";
import type { LicensePayload } from "./license.js";

export interface Buyer {
  readonly name: string;
  readonly email: string;
}

const isoDay = (ms: number): string => new Date(ms).toISOString().slice(0, 10);

/**
 * A Stripe period ends at the instant the next one starts, so its end is exclusive. A key's
 * `expires` is inclusive (good through that UTC day), so it's the day of the last second paid
 * for: a period ending 2027-10-08T15:00Z gives 2027-10-08, one ending at midnight the day before.
 */
export const expiresFromPeriodEnd = (periodEnd: number): string =>
  isoDay(periodEnd * 1000 - 1);

export const licenseIdFor = (subscriptionId: string): string =>
  `stripe-${subscriptionId}`;

export const subscriptionIdOf = (invoice: Stripe.Invoice): string | null => {
  const subscription = invoice.parent?.subscription_details?.subscription;
  if (!subscription) return null;
  return typeof subscription === "string" ? subscription : subscription.id;
};

/** The invoice's subscription line (for `productId` only, when given) that runs latest. */
const subscriptionLine = (
  invoice: Stripe.Invoice,
  productId: string | undefined,
): Stripe.InvoiceLineItem | null =>
  invoice.lines.data
    .filter((line) => line.parent?.type === "subscription_item_details")
    .filter(
      (line) =>
        !productId || line.pricing?.price_details?.product === productId,
    )
    .reduce<Stripe.InvoiceLineItem | null>(
      (latest, line) =>
        !latest || line.period.end > latest.period.end ? line : latest,
      null,
    );

/**
 * The license a paid invoice buys, or null when it isn't a Remry Pro subscription invoice.
 * `issued` is the day it was paid, not today, so a key built again later is identical.
 */
export const licensePayloadFor = (
  invoice: Stripe.Invoice,
  buyer: Buyer,
  productId?: string,
): LicensePayload | null => {
  const subscriptionId = subscriptionIdOf(invoice);
  const line = subscriptionLine(invoice, productId);
  if (!subscriptionId || !line) return null;
  const paidAt = invoice.status_transitions.paid_at ?? invoice.created;
  return {
    v: 1,
    id: licenseIdFor(subscriptionId),
    name: buyer.name,
    email: buyer.email,
    plan: "pro",
    issued: isoDay(paidAt * 1000),
    expires: expiresFromPeriodEnd(line.period.end),
  };
};

/** Who paid: the invoice's own snapshot first, then the customer. Null without an email. */
export const buyerOf = async (
  invoice: Stripe.Invoice,
  retrieveCustomer: (
    id: string,
  ) => Promise<Stripe.Customer | Stripe.DeletedCustomer>,
): Promise<Buyer | null> => {
  let email = invoice.customer_email;
  let name = invoice.customer_name;
  if ((!email || !name) && invoice.customer) {
    const customer =
      typeof invoice.customer === "string"
        ? await retrieveCustomer(invoice.customer)
        : invoice.customer;
    if (!customer.deleted) {
      email = email ?? customer.email;
      name = name ?? customer.name ?? null;
    }
  }
  if (!email) return null;
  return { name: name ?? email, email };
};

/** `dana@example.com` → `d***@example.com`, for logs and the thanks page. */
export const maskEmail = (email: string): string => {
  const [local = "", domain = ""] = email.split("@");
  return `${local.slice(0, 1)}***@${domain}`;
};

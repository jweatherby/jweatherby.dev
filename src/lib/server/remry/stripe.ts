// The few Stripe calls Remry licensing makes, behind an interface so tests can stand in for
// Stripe without a network.

import Stripe from "stripe";

export interface RemryStripe {
  /** Verifies the `stripe-signature` header against the raw body; throws if it doesn't match. */
  readonly constructEvent: (
    rawBody: string,
    signature: string,
    secret: string,
  ) => Stripe.Event;
  readonly retrieveInvoice: (id: string) => Promise<Stripe.Invoice>;
  readonly retrieveCustomer: (
    id: string,
  ) => Promise<Stripe.Customer | Stripe.DeletedCustomer>;
  readonly setInvoiceMetadata: (
    id: string,
    metadata: Readonly<Record<string, string>>,
  ) => Promise<void>;
  /** A Checkout Session with its subscription and that subscription's latest invoice expanded. */
  readonly retrieveCheckoutSession: (
    id: string,
  ) => Promise<Stripe.Checkout.Session>;
}

export const remryStripe = (stripe: Stripe): RemryStripe => ({
  constructEvent: (rawBody, signature, secret) =>
    stripe.webhooks.constructEvent(rawBody, signature, secret),
  retrieveInvoice: (id) => stripe.invoices.retrieve(id),
  retrieveCustomer: (id) => stripe.customers.retrieve(id),
  setInvoiceMetadata: async (id, metadata) => {
    await stripe.invoices.update(id, { metadata: { ...metadata } });
  },
  retrieveCheckoutSession: (id) =>
    stripe.checkout.sessions.retrieve(id, {
      expand: ["subscription.latest_invoice"],
    }),
});

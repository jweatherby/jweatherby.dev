// The few Stripe calls Remry licensing makes, behind an interface so tests can stand in for
// Stripe without a network.

import Stripe from "stripe";

export interface RemryStripe {
  /** Verifies the `stripe-signature` header against the raw body; throws if it doesn't match. */
  readonly constructEvent: (
    rawBody: string,
    signature: string,
    secret: string,
  ) => Promise<Stripe.Event>;
  readonly retrieveInvoice: (id: string) => Promise<Stripe.Invoice>;
  readonly retrieveCustomer: (
    id: string,
  ) => Promise<Stripe.Customer | Stripe.DeletedCustomer>;
  readonly setInvoiceMetadata: (
    id: string,
    metadata: Readonly<Record<string, string>>,
  ) => Promise<void>;
  readonly retrieveSubscription: (id: string) => Promise<Stripe.Subscription>;
  readonly setSubscriptionMetadata: (
    id: string,
    metadata: Readonly<Record<string, string>>,
  ) => Promise<void>;
  readonly retrieveCharge: (id: string) => Promise<Stripe.Charge>;
  readonly retrieveDispute: (id: string) => Promise<Stripe.Dispute>;
  /** The invoice a PaymentIntent paid, or null when it didn't pay one. */
  readonly invoiceIdForPaymentIntent: (
    paymentIntentId: string,
  ) => Promise<string | null>;
  /** A Checkout Session with its subscription and that subscription's latest invoice expanded. */
  readonly retrieveCheckoutSession: (
    id: string,
  ) => Promise<Stripe.Checkout.Session>;
}

export const remryStripe = (stripe: Stripe): RemryStripe => ({
  constructEvent: (rawBody, signature, secret) =>
    stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      secret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    ),
  retrieveInvoice: (id) => stripe.invoices.retrieve(id),
  retrieveCustomer: (id) => stripe.customers.retrieve(id),
  setInvoiceMetadata: async (id, metadata) => {
    await stripe.invoices.update(id, { metadata: { ...metadata } });
  },
  retrieveSubscription: (id) => stripe.subscriptions.retrieve(id),
  setSubscriptionMetadata: async (id, metadata) => {
    await stripe.subscriptions.update(id, { metadata: { ...metadata } });
  },
  retrieveCharge: (id) => stripe.charges.retrieve(id),
  retrieveDispute: (id) => stripe.disputes.retrieve(id),
  invoiceIdForPaymentIntent: async (paymentIntentId) => {
    const payments = await stripe.invoicePayments.list({
      payment: { type: "payment_intent", payment_intent: paymentIntentId },
      limit: 1,
    });
    const invoice = payments.data[0]?.invoice;
    if (!invoice) return null;
    return typeof invoice === "string" ? invoice : invoice.id ?? null;
  },
  retrieveCheckoutSession: (id) =>
    stripe.checkout.sessions.retrieve(id, {
      expand: ["subscription.latest_invoice"],
    }),
});

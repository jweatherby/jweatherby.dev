// Stripe objects and a fake RemryStripe for tests: no network.

import Stripe from "stripe";
import { vi } from "vitest";
import type { RemryStripe } from "../stripe.js";

/** 2026-10-08T15:00:00Z and a year on. */
export const PERIOD_START = Date.UTC(2026, 9, 8, 15) / 1000;
export const PERIOD_END = Date.UTC(2027, 9, 8, 15) / 1000;

interface InvoiceOptions {
  readonly id?: string;
  readonly subscription?: string | null;
  readonly periodEnd?: number;
  readonly paidAt?: number;
  readonly product?: string;
  readonly metadata?: Record<string, string>;
  readonly customerEmail?: string | null;
  readonly customerName?: string | null;
}

export const invoice = (options: InvoiceOptions = {}): Stripe.Invoice => {
  const subscription =
    options.subscription === undefined ? "sub_123" : options.subscription;
  return {
    id: options.id ?? "in_123",
    object: "invoice",
    created: PERIOD_START,
    customer: "cus_123",
    customer_email:
      options.customerEmail === undefined
        ? "dana@example.com"
        : options.customerEmail,
    customer_name:
      options.customerName === undefined ? "Dana Park" : options.customerName,
    metadata: options.metadata ?? {},
    status: "paid",
    status_transitions: {
      finalized_at: PERIOD_START,
      marked_uncollectible_at: null,
      paid_at: options.paidAt ?? PERIOD_START + 60,
      voided_at: null,
    },
    parent: subscription
      ? {
          type: "subscription_details",
          quote_details: null,
          subscription_details: { metadata: {}, subscription },
        }
      : null,
    lines: {
      object: "list",
      has_more: false,
      url: "/v1/invoices/in_123/lines",
      data: [
        {
          id: "il_1",
          object: "line_item",
          parent: { type: "subscription_item_details" },
          period: {
            start: PERIOD_START,
            end: options.periodEnd ?? PERIOD_END,
          },
          pricing: {
            type: "price_details",
            price_details: {
              price: "price_pro_yearly",
              product: options.product ?? "prod_remry_pro",
            },
          },
        },
      ],
    },
  } as unknown as Stripe.Invoice;
};

export const subscription = (
  metadata: Record<string, string> = {},
): Stripe.Subscription =>
  ({
    id: "sub_123",
    object: "subscription",
    metadata,
  }) as unknown as Stripe.Subscription;

export const charge = (
  options: { readonly refunded?: boolean } = {},
): Stripe.Charge =>
  ({
    id: "ch_123",
    object: "charge",
    refunded: options.refunded ?? true,
    payment_intent: "pi_123",
  }) as unknown as Stripe.Charge;

export const dispute = (
  status: Stripe.Dispute.Status = "lost",
): Stripe.Dispute =>
  ({
    id: "dp_123",
    object: "dispute",
    status,
    charge: "ch_123",
    payment_intent: "pi_123",
  }) as unknown as Stripe.Dispute;

/** A fake Stripe; signature checks use stripe-node's real verifier, which is offline. */
export const fakeStripe = (
  overrides: Partial<RemryStripe> = {},
): RemryStripe => {
  const real = new Stripe("sk_test_offline");
  return {
    constructEvent: (rawBody, signature, secret) =>
      real.webhooks.constructEventAsync(rawBody, signature, secret),
    retrieveInvoice: vi.fn(async () => invoice()),
    retrieveCustomer: vi.fn(
      async () =>
        ({
          id: "cus_123",
          object: "customer",
          email: "dana@example.com",
          name: "Dana Park",
        }) as unknown as Stripe.Customer,
    ),
    retrieveSubscription: vi.fn(async () => subscription()),
    retrieveCharge: vi.fn(async () => charge()),
    retrieveDispute: vi.fn(async () => dispute()),
    invoiceIdForPaymentIntent: vi.fn(async () => "in_123"),
    retrieveCheckoutSession: vi.fn(async () => {
      throw new Error("not stubbed");
    }),
    ...overrides,
    setInvoiceMetadata: vi.fn(overrides.setInvoiceMetadata ?? (async () => {})),
    setSubscriptionMetadata: vi.fn(
      overrides.setSubscriptionMetadata ?? (async () => {}),
    ),
  };
};

export const WEBHOOK_SECRET = "whsec_test_secret";

/** A webhook request signed the way Stripe signs it. */
export const signedRequest = async (
  event: Readonly<Record<string, unknown>>,
  secret = WEBHOOK_SECRET,
): Promise<Request> => {
  const payload = JSON.stringify(event);
  const header = await new Stripe(
    "sk_test_offline",
  ).webhooks.generateTestHeaderStringAsync({
    payload,
    secret,
  });
  return new Request("https://jweatherby.dev/api/remry/stripe", {
    method: "POST",
    body: payload,
    headers: { "stripe-signature": header },
  });
};

export const invoicePaidEvent = (invoiceId = "in_123") => ({
  id: "evt_123",
  object: "event",
  type: "invoice.paid",
  data: { object: { id: invoiceId, object: "invoice" } },
});

/** 2026-11-02T09:00:00Z: when the refund events below happen. */
export const REFUNDED_AT = Date.UTC(2026, 10, 2, 9) / 1000;

export const chargeRefundedEvent = () => ({
  id: "evt_refund",
  object: "event",
  type: "charge.refunded",
  created: REFUNDED_AT,
  data: { object: { id: "ch_123", object: "charge" } },
});

export const disputeClosedEvent = () => ({
  id: "evt_dispute",
  object: "event",
  type: "charge.dispute.closed",
  created: REFUNDED_AT,
  data: { object: { id: "dp_123", object: "dispute" } },
});

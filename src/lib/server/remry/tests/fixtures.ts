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

/** A fake Stripe; signature checks use stripe-node's real verifier, which is offline. */
export const fakeStripe = (
  overrides: Partial<RemryStripe> = {},
): RemryStripe => {
  const real = new Stripe("sk_test_offline");
  return {
    constructEvent: (rawBody, signature, secret) =>
      real.webhooks.constructEvent(rawBody, signature, secret),
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
    retrieveCheckoutSession: vi.fn(async () => {
      throw new Error("not stubbed");
    }),
    ...overrides,
    setInvoiceMetadata: vi.fn(overrides.setInvoiceMetadata ?? (async () => {})),
  };
};

export const WEBHOOK_SECRET = "whsec_test_secret";

/** A webhook request signed the way Stripe signs it. */
export const signedRequest = (
  event: Readonly<Record<string, unknown>>,
  secret = WEBHOOK_SECRET,
): Request => {
  const payload = JSON.stringify(event);
  const header = new Stripe(
    "sk_test_offline",
  ).webhooks.generateTestHeaderString({
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

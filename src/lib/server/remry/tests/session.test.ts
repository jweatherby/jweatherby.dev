import type Stripe from "stripe";
import { describe, expect, it, vi } from "vitest";
import type { LicenseEmail } from "../email.js";
import { licenseForSession } from "../session.js";
import { handleStripeWebhook } from "../webhook.js";
import { TEST_LICENSE_PRIVATE_KEY } from "./app-license.js";
import {
  fakeStripe,
  invoice,
  invoicePaidEvent,
  signedRequest,
  WEBHOOK_SECRET,
} from "./fixtures.js";

const session = (
  overrides: Partial<Stripe.Checkout.Session> = {},
): Stripe.Checkout.Session =>
  ({
    id: "cs_test_abc123",
    object: "checkout.session",
    status: "complete",
    payment_status: "paid",
    subscription: {
      id: "sub_123",
      object: "subscription",
      latest_invoice: invoice(),
    },
    ...overrides,
  }) as unknown as Stripe.Checkout.Session;

const depsWith = (checkout: Stripe.Checkout.Session) => ({
  stripe: fakeStripe({ retrieveCheckoutSession: vi.fn(async () => checkout) }),
  privateKeyPem: TEST_LICENSE_PRIVATE_KEY,
});

describe("licenseForSession", () => {
  it("shows the same key the webhook emails", async () => {
    const deps = depsWith(session());
    const shown = await licenseForSession("cs_test_abc123", deps);

    const sent: LicenseEmail[] = [];
    await handleStripeWebhook(signedRequest(invoicePaidEvent()), {
      ...deps,
      webhookSecret: WEBHOOK_SECRET,
      sendLicenseEmail: async (email) => {
        sent.push(email);
      },
      log: () => {},
    });

    expect(shown).toMatchObject({
      ok: true,
      name: "Dana Park",
      maskedEmail: "d***@example.com",
      expires: "2027-10-08",
    });
    expect(shown.ok && sent[0]?.text.includes(shown.key)).toBe(true);
  });

  it("has nothing for an unpaid, unfinished or unknown session", async () => {
    expect(
      await licenseForSession(
        "cs_test_abc123",
        depsWith(session({ payment_status: "unpaid" })),
      ),
    ).toEqual({ ok: false });
    expect(
      await licenseForSession(
        "cs_test_abc123",
        depsWith(session({ status: "open" })),
      ),
    ).toEqual({ ok: false });
    expect(
      await licenseForSession(
        "cs_test_abc123",
        depsWith(session({ subscription: "sub_123" })),
      ),
    ).toEqual({ ok: false });

    const deps = depsWith(session());
    expect(await licenseForSession(null, deps)).toEqual({ ok: false });
    expect(await licenseForSession("not-a-session", deps)).toEqual({
      ok: false,
    });
    expect(deps.stripe.retrieveCheckoutSession).not.toHaveBeenCalled();
  });
});

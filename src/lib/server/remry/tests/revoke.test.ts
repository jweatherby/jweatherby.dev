import { describe, expect, it, vi } from "vitest";
import { githubDispatcher } from "../github.js";
import type { Revocation } from "../revoke.js";
import { handleStripeWebhook, type WebhookDeps } from "../webhook.js";
import { TEST_LICENSE_PRIVATE_KEY } from "./app-license.js";
import {
  charge,
  chargeRefundedEvent,
  dispute,
  disputeClosedEvent,
  fakeStripe,
  invoice,
  signedRequest,
  subscription,
  WEBHOOK_SECRET,
} from "./fixtures.js";

const ISSUED = {
  remry_license_id: "stripe-sub_123",
  remry_expires: "2027-10-08",
};

/** Stripe with a key already issued for in_123, so there's a license to revoke. */
const issuedStripe = (overrides: Parameters<typeof fakeStripe>[0] = {}) =>
  fakeStripe({
    retrieveInvoice: vi.fn(async () => invoice({ metadata: ISSUED })),
    retrieveSubscription: vi.fn(async () => subscription(ISSUED)),
    ...overrides,
  });

const setup = (stripe = issuedStripe()) => {
  const dispatched: Revocation[] = [];
  const logs: string[] = [];
  const deps: WebhookDeps = {
    stripe,
    webhookSecret: WEBHOOK_SECRET,
    privateKeyPem: TEST_LICENSE_PRIVATE_KEY,
    sendLicenseEmail: async () => {
      throw new Error("no email on a refund");
    },
    dispatchRevocation: async (revocation) => {
      dispatched.push(revocation);
    },
    log: (message) => logs.push(message),
  };
  return { stripe, deps, dispatched, logs };
};

describe("revoking on a refund or lost dispute", () => {
  it("revokes the license through its latest expiry and stamps the subscription", async () => {
    const stripe = issuedStripe({
      // A renewal since this invoice: the revocation must cover the newer key too.
      retrieveSubscription: vi.fn(async () =>
        subscription({ ...ISSUED, remry_expires: "2028-10-08" }),
      ),
    });
    const { deps, dispatched, logs } = setup(stripe);
    const response = await handleStripeWebhook(
      await signedRequest(chargeRefundedEvent()),
      deps,
    );
    expect(response.status).toBe(200);
    expect(stripe.invoiceIdForPaymentIntent).toHaveBeenCalledWith("pi_123");
    expect(dispatched).toEqual([
      { id: "stripe-sub_123", expires: "2028-10-08", reason: "refund" },
    ]);
    expect(stripe.setSubscriptionMetadata).toHaveBeenCalledWith("sub_123", {
      remry_revoked: "2026-11-02 refund",
    });
    expect(logs.join("\n")).not.toContain("dana@example.com");
  });

  it("revokes on a lost dispute, and not on one won", async () => {
    const lost = setup();
    await handleStripeWebhook(
      await signedRequest(disputeClosedEvent()),
      lost.deps,
    );
    expect(lost.dispatched).toEqual([
      { id: "stripe-sub_123", expires: "2027-10-08", reason: "chargeback" },
    ]);

    const won = setup(
      issuedStripe({ retrieveDispute: vi.fn(async () => dispute("won")) }),
    );
    const response = await handleStripeWebhook(
      await signedRequest(disputeClosedEvent()),
      won.deps,
    );
    expect(response.status).toBe(200);
    expect(won.dispatched).toHaveLength(0);
  });

  it("keeps the license on a partial refund", async () => {
    const { deps, dispatched } = setup(
      issuedStripe({
        retrieveCharge: vi.fn(async () => charge({ refunded: false })),
      }),
    );
    const response = await handleStripeWebhook(
      await signedRequest(chargeRefundedEvent()),
      deps,
    );
    expect(response.status).toBe(200);
    expect(dispatched).toHaveLength(0);
  });

  it("does nothing when no key was issued for the payment", async () => {
    const { deps, dispatched } = setup(
      issuedStripe({ retrieveInvoice: vi.fn(async () => invoice()) }),
    );
    await handleStripeWebhook(await signedRequest(chargeRefundedEvent()), deps);
    expect(dispatched).toHaveLength(0);

    const noInvoice = setup(
      issuedStripe({ invoiceIdForPaymentIntent: vi.fn(async () => null) }),
    );
    await handleStripeWebhook(
      await signedRequest(chargeRefundedEvent()),
      noInvoice.deps,
    );
    expect(noInvoice.dispatched).toHaveLength(0);
  });

  it("dispatches nothing twice for a redelivered event", async () => {
    const { deps, dispatched, stripe } = setup(
      issuedStripe({
        retrieveSubscription: vi.fn(async () =>
          subscription({ ...ISSUED, remry_revoked: "2026-11-02 refund" }),
        ),
      }),
    );
    const response = await handleStripeWebhook(
      await signedRequest(chargeRefundedEvent()),
      deps,
    );
    expect(await response.json()).toMatchObject({
      alreadyRevoked: "stripe-sub_123",
    });
    expect(dispatched).toHaveLength(0);
    expect(stripe.setSubscriptionMetadata).not.toHaveBeenCalled();
  });

  it("returns 500 so Stripe retries when GitHub can't be reached", async () => {
    const { deps, stripe } = setup();
    const failing: WebhookDeps = {
      ...deps,
      dispatchRevocation: async () => {
        throw new Error("GitHub dispatch failed: 502");
      },
    };
    const response = await handleStripeWebhook(
      await signedRequest(chargeRefundedEvent()),
      failing,
    );
    expect(response.status).toBe(500);
    expect(stripe.setSubscriptionMetadata).not.toHaveBeenCalled();
  });
});

describe("githubDispatcher", () => {
  const revocation: Revocation = {
    id: "stripe-sub_123",
    expires: "2027-10-08",
    reason: "refund",
  };

  it("sends only the id, expiry and reason to the Remry repo", async () => {
    const fetch = vi.fn(async () => new Response(null, { status: 204 }));
    await githubDispatcher({ token: "github_pat_x", fetch })(revocation);

    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.github.com/repos/remry-ai/remry/dispatches");
    expect(new Headers(init.headers).get("authorization")).toBe(
      "Bearer github_pat_x",
    );
    expect(JSON.parse(String(init.body))).toEqual({
      event_type: "remry-revoke",
      client_payload: revocation,
    });
  });

  it("fails without a token or on an error status", async () => {
    const fetch = vi.fn(async () => new Response(null, { status: 404 }));
    await expect(
      githubDispatcher({ token: undefined, fetch })(revocation),
    ).rejects.toThrow("GITHUB_DISPATCH_TOKEN");
    expect(fetch).not.toHaveBeenCalled();
    await expect(
      githubDispatcher({ token: "github_pat_x", fetch })(revocation),
    ).rejects.toThrow("404");
  });
});

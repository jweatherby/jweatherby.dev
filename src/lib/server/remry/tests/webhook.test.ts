import { describe, expect, it, vi } from "vitest";
import type { LicenseEmail } from "../email.js";
import { handleStripeWebhook, type WebhookDeps } from "../webhook.js";
import {
  readLicensePayload,
  TEST_LICENSE_PRIVATE_KEY,
  TEST_LICENSE_PUBLIC_KEY,
} from "./app-license.js";
import {
  fakeStripe,
  invoice,
  invoicePaidEvent,
  signedRequest,
  WEBHOOK_SECRET,
} from "./fixtures.js";

const setup = (stripe = fakeStripe()) => {
  const sent: LicenseEmail[] = [];
  const logs: string[] = [];
  const deps: WebhookDeps = {
    stripe,
    webhookSecret: WEBHOOK_SECRET,
    privateKeyPem: TEST_LICENSE_PRIVATE_KEY,
    sendLicenseEmail: async (email) => {
      sent.push(email);
    },
    log: (message) => logs.push(message),
  };
  return { stripe, deps, sent, logs };
};

describe("handleStripeWebhook", () => {
  it("rejects a request without a valid signature", async () => {
    const { deps, sent } = setup();
    const wrongSecret = signedRequest(invoicePaidEvent(), "whsec_someone_else");
    expect((await handleStripeWebhook(wrongSecret, deps)).status).toBe(400);

    const unsigned = new Request("https://jweatherby.dev/api/remry/stripe", {
      method: "POST",
      body: JSON.stringify(invoicePaidEvent()),
    });
    expect((await handleStripeWebhook(unsigned, deps)).status).toBe(400);

    const tampered = signedRequest(invoicePaidEvent());
    const forged = new Request(tampered.url, {
      method: "POST",
      body: JSON.stringify(invoicePaidEvent("in_other")),
      headers: tampered.headers,
    });
    expect((await handleStripeWebhook(forged, deps)).status).toBe(400);
    expect(sent).toHaveLength(0);
  });

  it("ignores other events", async () => {
    const { deps, sent, stripe } = setup();
    const response = await handleStripeWebhook(
      signedRequest({ ...invoicePaidEvent(), type: "customer.created" }),
      deps,
    );
    expect(response.status).toBe(200);
    expect(stripe.retrieveInvoice).not.toHaveBeenCalled();
    expect(sent).toHaveLength(0);
  });

  it("emails a key the app accepts and marks the invoice", async () => {
    const { deps, sent, stripe, logs } = setup();
    const response = await handleStripeWebhook(
      signedRequest(invoicePaidEvent()),
      deps,
    );
    expect(response.status).toBe(200);

    expect(sent).toHaveLength(1);
    expect(sent[0]?.to).toBe("dana@example.com");
    const key =
      sent[0]?.text.split("\n").find((line) => line.startsWith("WN1.")) ?? "";
    expect(readLicensePayload(key, TEST_LICENSE_PUBLIC_KEY)).toMatchObject({
      id: "stripe-sub_123",
      expires: "2027-10-08",
    });

    expect(stripe.setInvoiceMetadata).toHaveBeenCalledWith("in_123", {
      remry_license_id: "stripe-sub_123",
      remry_expires: "2027-10-08",
    });
    // Logs say what happened without the key or the full address.
    expect(logs.join("\n")).not.toContain(key);
    expect(logs.join("\n")).not.toContain("dana@example.com");
  });

  it("sends nothing for an invoice that already has a key", async () => {
    const stripe = fakeStripe({
      retrieveInvoice: vi.fn(async () =>
        invoice({
          metadata: {
            remry_license_id: "stripe-sub_123",
            remry_expires: "2027-10-08",
          },
        }),
      ),
    });
    const { deps, sent } = setup(stripe);
    const response = await handleStripeWebhook(
      signedRequest(invoicePaidEvent()),
      deps,
    );
    expect(response.status).toBe(200);
    expect(sent).toHaveLength(0);
    expect(stripe.setInvoiceMetadata).not.toHaveBeenCalled();
  });

  it("ignores a paid invoice that isn't for a subscription", async () => {
    const stripe = fakeStripe({
      retrieveInvoice: vi.fn(async () => invoice({ subscription: null })),
    });
    const { deps, sent } = setup(stripe);
    expect(
      (await handleStripeWebhook(signedRequest(invoicePaidEvent()), deps))
        .status,
    ).toBe(200);
    expect(sent).toHaveLength(0);
  });

  it("returns 500 so Stripe retries when sending fails", async () => {
    const { deps, stripe } = setup();
    const failing: WebhookDeps = {
      ...deps,
      sendLicenseEmail: async () => {
        throw new Error("smtp down");
      },
    };
    const response = await handleStripeWebhook(
      signedRequest(invoicePaidEvent()),
      failing,
    );
    expect(response.status).toBe(500);
    expect(stripe.setInvoiceMetadata).not.toHaveBeenCalled();
  });

  it("returns 500 when the invoice can't be marked", async () => {
    const stripe = fakeStripe({
      setInvoiceMetadata: async () => {
        throw new Error("metadata locked");
      },
    });
    const { deps } = setup(stripe);
    expect(
      (await handleStripeWebhook(signedRequest(invoicePaidEvent()), deps))
        .status,
    ).toBe(500);
  });
});

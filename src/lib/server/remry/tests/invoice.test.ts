import { describe, expect, it, vi } from "vitest";
import {
  buyerOf,
  expiresFromPeriodEnd,
  licensePayloadFor,
  maskEmail,
} from "../invoice.js";
import { invoice, PERIOD_END } from "./fixtures.js";

const dana = { name: "Dana Park", email: "dana@example.com" };

describe("expiresFromPeriodEnd", () => {
  it("is the last UTC day the period covers", () => {
    expect(expiresFromPeriodEnd(Date.UTC(2027, 9, 8, 15) / 1000)).toBe(
      "2027-10-08",
    );
    // A period ending exactly at midnight covers none of that day.
    expect(expiresFromPeriodEnd(Date.UTC(2027, 9, 8) / 1000)).toBe(
      "2027-10-07",
    );
  });
});

describe("licensePayloadFor", () => {
  it("maps a first payment", () => {
    expect(licensePayloadFor(invoice(), dana)).toEqual({
      v: 1,
      id: "stripe-sub_123",
      name: "Dana Park",
      email: "dana@example.com",
      plan: "pro",
      issued: "2026-10-08",
      expires: "2027-10-08",
    });
  });

  it("keeps the id on a renewal, with the new period's expiry", () => {
    const renewal = invoice({
      id: "in_456",
      paidAt: PERIOD_END + 3600,
      periodEnd: Date.UTC(2028, 9, 8, 15) / 1000,
    });
    expect(licensePayloadFor(renewal, dana)).toMatchObject({
      id: "stripe-sub_123",
      issued: "2027-10-08",
      expires: "2028-10-08",
    });
  });

  it("ignores invoices that aren't for a subscription", () => {
    expect(licensePayloadFor(invoice({ subscription: null }), dana)).toBeNull();
  });

  it("only issues for the configured product, when there is one", () => {
    expect(
      licensePayloadFor(
        invoice({ product: "prod_other" }),
        dana,
        "prod_remry_pro",
      ),
    ).toBeNull();
    expect(licensePayloadFor(invoice(), dana, "prod_remry_pro")).not.toBeNull();
  });
});

describe("buyerOf", () => {
  it("uses the invoice's customer snapshot", async () => {
    const retrieve = vi.fn();
    expect(await buyerOf(invoice(), retrieve)).toEqual(dana);
    expect(retrieve).not.toHaveBeenCalled();
  });

  it("falls back to the customer, and to the email for a name", async () => {
    const retrieve = vi.fn(
      async () =>
        ({ id: "cus_123", email: "sam@example.com", name: null }) as never,
    );
    expect(
      await buyerOf(
        invoice({ customerEmail: null, customerName: null }),
        retrieve,
      ),
    ).toEqual({
      name: "sam@example.com",
      email: "sam@example.com",
    });
  });
});

describe("maskEmail", () => {
  it("keeps the first letter and the domain", () => {
    expect(maskEmail("dana@example.com")).toBe("d***@example.com");
  });
});

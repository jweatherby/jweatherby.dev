import { describe, expect, it } from "vitest";
import {
  readPrivateKeyPem,
  signLicenseKey,
  type LicensePayload,
} from "../license.js";
import {
  readLicensePayload,
  TEST_LICENSE_PRIVATE_KEY,
  TEST_LICENSE_PUBLIC_KEY,
} from "./app-license.js";

const payload: LicensePayload = {
  v: 1,
  id: "stripe-sub_123",
  name: "Dana Park",
  email: "dana@example.com",
  plan: "pro",
  issued: "2026-10-08",
  expires: "2027-10-08",
};

describe("signLicenseKey", () => {
  it("makes keys the Remry app accepts", async () => {
    const key = await signLicenseKey(payload, TEST_LICENSE_PRIVATE_KEY);
    expect(key.startsWith("WN1.")).toBe(true);
    expect(readLicensePayload(key, TEST_LICENSE_PUBLIC_KEY)).toEqual(payload);
  });

  it("signs the base64url payload text, so a changed payload fails", async () => {
    const [prefix, , signature] = (
      await signLicenseKey(payload, TEST_LICENSE_PRIVATE_KEY)
    ).split(".");
    const forged = Buffer.from(
      JSON.stringify({ ...payload, expires: "2099-01-01" }),
    ).toString("base64url");
    expect(
      readLicensePayload(
        `${prefix}.${forged}.${signature}`,
        TEST_LICENSE_PUBLIC_KEY,
      ),
    ).toBeNull();
  });

  it("is deterministic, so the thanks page and the email agree", async () => {
    expect(await signLicenseKey(payload, TEST_LICENSE_PRIVATE_KEY)).toBe(
      await signLicenseKey({ ...payload }, TEST_LICENSE_PRIVATE_KEY),
    );
  });
});

describe("readPrivateKeyPem", () => {
  it("accepts a base64-encoded PEM", () => {
    const encoded = Buffer.from(TEST_LICENSE_PRIVATE_KEY).toString("base64");
    expect(readPrivateKeyPem(encoded)).toBe(TEST_LICENSE_PRIVATE_KEY);
  });

  it("accepts a PEM with escaped newlines", () => {
    const escaped = TEST_LICENSE_PRIVATE_KEY.replace(/\n/g, "\\n");
    expect(readPrivateKeyPem(escaped)).toBe(TEST_LICENSE_PRIVATE_KEY);
  });

  it("refuses a missing or wrong value", () => {
    expect(() => readPrivateKeyPem(undefined)).toThrow("not set");
    expect(() => readPrivateKeyPem("bm90IGEga2V5")).toThrow("not a PKCS8 PEM");
  });
});

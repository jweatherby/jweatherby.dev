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

  // Every form the secret might have been pasted in: each must give a key that signs keys the app accepts.
  const base64 = Buffer.from(TEST_LICENSE_PRIVATE_KEY).toString("base64");
  const derBody = TEST_LICENSE_PRIVATE_KEY.replace(/-----[A-Z ]+-----|\s/g, "");
  const forms: Readonly<Record<string, string>> = {
    "a base64-encoded PEM": base64,
    "base64 wrapped across lines": base64.match(/.{1,20}/g)!.join("\n"),
    "URL-safe base64 without padding": Buffer.from(TEST_LICENSE_PRIVATE_KEY).toString("base64url"),
    "a quoted base64 PEM": `"${base64}"`,
    "PEM text with real newlines": TEST_LICENSE_PRIVATE_KEY,
    "PEM text with escaped newlines": TEST_LICENSE_PRIVATE_KEY.replace(/\n/g, "\\n"),
    "PEM text with escaped CRLFs": TEST_LICENSE_PRIVATE_KEY.replace(/\n/g, "\\r\\n"),
    "a quoted PEM": `'${TEST_LICENSE_PRIVATE_KEY}'`,
    "just the PEM's base64 body": derBody,
  };
  for (const [form, value] of Object.entries(forms)) {
    it(`accepts ${form}`, async () => {
      const key = await signLicenseKey(payload, readPrivateKeyPem(value));
      expect(readLicensePayload(key, TEST_LICENSE_PUBLIC_KEY)).toEqual(payload);
    });
  }

  it("refuses a missing or wrong value, without echoing it", () => {
    expect(() => readPrivateKeyPem(undefined)).toThrow("not set");
    expect(() => readPrivateKeyPem("  ")).toThrow("not set");
    expect(() => readPrivateKeyPem("bm90IGEga2V5")).toThrow("neither a PEM nor base64");
    expect(() => readPrivateKeyPem("not base64 at all!")).toThrow("neither a PEM nor base64");
    expect(() => readPrivateKeyPem(TEST_LICENSE_PUBLIC_KEY)).toThrow(
      'is a PUBLIC KEY PEM, not a PKCS8 "PRIVATE KEY" one',
    );
    expect(() =>
      readPrivateKeyPem("-----BEGIN OPENSSH PRIVATE KEY-----\nabc\n-----END OPENSSH PRIVATE KEY-----"),
    ).toThrow("is a OPENSSH PRIVATE KEY PEM");
    try {
      readPrivateKeyPem("c2VjcmV0LXZhbHVl");
    } catch (e) {
      expect((e as Error).message).not.toContain("c2VjcmV0LXZhbHVl");
    }
  });
});

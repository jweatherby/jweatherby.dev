// Copies from the Remry app (remry-ai/remry), for tests only:
// - its test-only signing keypair: the public half is src/shared/license/test-key.ts (trusted
//   only under APP_ENV=test), the private half tests/license-test-key.ts. Never a real key.
// - readLicensePayload from src/shared/license/verify.server.ts, with its isPayload check.
// If those change in the app, copy them again.

import { createPublicKey, verify } from "node:crypto";
import type { LicensePayload } from "../license.js";

export const TEST_LICENSE_PUBLIC_KEY =
  "-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEAYICewI16B53qSjvRQyJAM81+OR1A0neFF61npKKoACU=\n-----END PUBLIC KEY-----\n";

export const TEST_LICENSE_PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\nMC4CAQAwBQYDK2VwBCIEIK6QaK+QhWdbHYWkSZDDn/N/tg9I9hpjv3BPfQ0R3iCx\n-----END PRIVATE KEY-----\n";

const PREFIX = "WN1";
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const isPayload = (value: unknown): value is LicensePayload => {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    p["v"] === 1 &&
    p["plan"] === "pro" &&
    typeof p["id"] === "string" &&
    typeof p["name"] === "string" &&
    typeof p["email"] === "string" &&
    typeof p["issued"] === "string" &&
    DATE.test(p["issued"]) &&
    typeof p["expires"] === "string" &&
    DATE.test(p["expires"])
  );
};

/** A key's payload, only if its signature checks out against the public key. */
export const readLicensePayload = (
  key: string,
  publicKeyPem: string,
): LicensePayload | null => {
  const parts = key.trim().split(".");
  if (parts.length !== 3 || parts[0] !== PREFIX) return null;
  const [, body, signature] = parts as [string, string, string];
  try {
    if (
      !verify(
        null,
        Buffer.from(body),
        createPublicKey(publicKeyPem),
        Buffer.from(signature, "base64url"),
      )
    )
      return null;
    const payload: unknown = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    );
    return isPayload(payload) ? payload : null;
  } catch {
    return null;
  }
};

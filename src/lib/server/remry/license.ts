// Remry Pro license keys, signed here for buyers and checked offline by the Remry app.
//
// signLicenseKey is a port of the app's: remry-ai/remry, src/shared/license/verify.server.ts.
// That file is the source of truth. Keep this byte-for-byte compatible with it, or the app
// rejects every key sold here; ./tests/license.test.ts checks keys from here with the app's logic.
//
// Key format: WN1.<base64url payload JSON>.<base64url Ed25519 signature of the payload part>

import { createPrivateKey, sign } from "node:crypto";

/** What a key carries, signed. Dates are YYYY-MM-DD (UTC); a license is good through `expires`. */
export interface LicensePayload {
  readonly v: 1;
  /** Stays the same across renewals: `stripe-<subscription id>`. */
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly plan: "pro";
  readonly issued: string;
  readonly expires: string;
}

const PREFIX = "WN1";

export const signLicenseKey = (
  payload: LicensePayload,
  privateKeyPem: string,
): string => {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(
    null,
    Buffer.from(body),
    createPrivateKey(privateKeyPem),
  ).toString("base64url");
  return `${PREFIX}.${body}.${signature}`;
};

/**
 * The signing key from REMRY_LICENSE_PRIVATE_KEY: a PKCS8 PEM, either base64-encoded whole
 * (`base64 -i ~/.remry-license/private.pem`, the recommended form) or as PEM text with its
 * newlines escaped as `\n`.
 */
export const readPrivateKeyPem = (value: string | undefined): string => {
  const raw = value?.trim();
  if (!raw) throw new Error("REMRY_LICENSE_PRIVATE_KEY is not set");
  const pem = raw.includes("-----BEGIN")
    ? raw.replace(/\\n/g, "\n")
    : Buffer.from(raw, "base64").toString("utf8");
  if (!pem.includes("-----BEGIN PRIVATE KEY-----")) {
    throw new Error("REMRY_LICENSE_PRIVATE_KEY is not a PKCS8 PEM");
  }
  return pem;
};

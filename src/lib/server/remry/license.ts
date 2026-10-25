// Remry Pro license keys, signed here for buyers and checked offline by the Remry app.
//
// signLicenseKey is a port of the app's: remry-ai/remry, scripts/license/sign.ts.
// That file is the source of truth. Keep this byte-for-byte compatible with it, or the app
// rejects every key sold here; ./tests/license.test.ts checks keys from here with the app's logic.
//
// Key format: WN1.<base64url payload JSON>.<base64url Ed25519 signature of the payload part>
//
// Signs with Web Crypto rather than node:crypto, so it runs the same on Cloudflare Workers and
// in tests. Ed25519 signatures are deterministic, so the key matches the app's signer exactly.

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
const PEM_HEADER = "-----BEGIN PRIVATE KEY-----";
const PEM_FOOTER = "-----END PRIVATE KEY-----";

const base64url = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const pemToDer = (pem: string): Uint8Array<ArrayBuffer> => {
  const base64 = pem
    .replace(PEM_HEADER, "")
    .replace(PEM_FOOTER, "")
    .replace(/\s+/g, "");
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};

export const signLicenseKey = async (
  payload: LicensePayload,
  privateKeyPem: string,
): Promise<string> => {
  const body = base64url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToDer(privateKeyPem),
    { name: "Ed25519" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    { name: "Ed25519" },
    key,
    new TextEncoder().encode(body),
  );
  return `${PREFIX}.${body}.${base64url(new Uint8Array(signature))}`;
};

/**
 * The signing key from REMRY_LICENSE_PRIVATE_KEY: a PKCS8 PEM, either base64-encoded whole
 * (`base64 -i ~/.remry-license/private.pem`, the recommended form) or as PEM text with its
 * newlines escaped as `\n`.
 */
export const readPrivateKeyPem = (value: string | undefined): string => {
  const raw = value?.trim();
  if (!raw) throw new Error("REMRY_LICENSE_PRIVATE_KEY is not set");
  let pem: string;
  if (raw.includes("-----BEGIN")) {
    pem = raw.replace(/\\n/g, "\n");
  } else {
    try {
      pem = atob(raw);
    } catch {
      pem = "";
    }
  }
  if (!pem.includes(PEM_HEADER)) {
    throw new Error("REMRY_LICENSE_PRIVATE_KEY is not a PKCS8 PEM");
  }
  return pem;
};

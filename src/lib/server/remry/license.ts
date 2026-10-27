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
 * Base64 decoded as forgivingly as Node's Buffer.from(value, "base64"), which the Vercel version
 * used: whitespace and line breaks ignored, URL-safe characters and missing padding accepted.
 * Null when it still isn't base64.
 */
const decodeBase64 = (value: string): string | null => {
  const standard = value.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = standard + "=".repeat((4 - (standard.length % 4)) % 4);
  try {
    return atob(padded);
  } catch {
    return null;
  }
};

const toPem = (base64Der: string): string => {
  const body = base64Der.replace(/\s+/g, "").match(/.{1,64}/g)?.join("\n") ?? "";
  return `${PEM_HEADER}\n${body}\n${PEM_FOOTER}\n`;
};

/** The label of the first PEM block in `text` ("PRIVATE KEY", "PUBLIC KEY", …), if any. */
const pemLabel = (text: string): string | null =>
  text.match(/-----BEGIN ([A-Z0-9 ]+)-----/)?.[1] ?? null;

/**
 * The signing key from REMRY_LICENSE_PRIVATE_KEY: a PKCS8 PEM, given as any of
 * - the PEM base64-encoded whole (`base64 -i ~/.remry-license/private.pem`, the recommended form),
 * - the PEM text, with real newlines or with them escaped as `\n`,
 * - just the base64 body between the PEM's BEGIN and END lines.
 * Surrounding quotes, as a dashboard paste sometimes leaves, are ignored.
 * Errors name what was found, never any of the key itself.
 */
export const readPrivateKeyPem = (value: string | undefined): string => {
  const raw = value?.trim().replace(/^(["'])([\s\S]*)\1$/, "$2").trim();
  if (!raw) throw new Error("REMRY_LICENSE_PRIVATE_KEY is not set");

  let pem: string | null;
  if (raw.includes("-----BEGIN")) {
    pem = raw.replace(/\\r\\n|\\n/g, "\n");
  } else {
    const decoded = decodeBase64(raw);
    // A DER key (ASN.1, so it starts with a SEQUENCE byte): the PEM's body without its lines.
    pem =
      decoded === null
        ? null
        : decoded.includes("-----BEGIN")
          ? decoded.replace(/\\r\\n|\\n/g, "\n")
          : decoded.charCodeAt(0) === 0x30
            ? toPem(raw)
            : null;
  }

  if (!pem) {
    throw new Error(
      "REMRY_LICENSE_PRIVATE_KEY is neither a PEM nor base64 of one: set it with `base64 -i ~/.remry-license/private.pem | wrangler secret put REMRY_LICENSE_PRIVATE_KEY`",
    );
  }
  if (!pem.includes(PEM_HEADER)) {
    throw new Error(
      `REMRY_LICENSE_PRIVATE_KEY is a ${pemLabel(pem) ?? "malformed"} PEM, not a PKCS8 "PRIVATE KEY" one`,
    );
  }
  return pem;
};

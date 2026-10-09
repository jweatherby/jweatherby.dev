// GET /api/remry/license?session_id=…: the key for a finished Payment Link checkout, for the
// thanks page. Built from the subscription's latest paid invoice exactly as the webhook builds
// it, so it's the same key as the one emailed.

import type Stripe from "stripe";
import { buyerOf, licensePayloadFor, maskEmail } from "./invoice.js";
import { signLicenseKey } from "./license.js";
import type { RemryStripe } from "./stripe.js";

export interface SessionDeps {
  readonly stripe: RemryStripe;
  readonly privateKeyPem: string;
  readonly productId?: string;
}

export type SessionLicense =
  | {
      readonly ok: true;
      readonly key: string;
      readonly name: string;
      readonly maskedEmail: string;
      readonly expires: string;
    }
  | { readonly ok: false };

const SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]+$/;
const NOT_READY: SessionLicense = { ok: false };

const expanded = <T extends { readonly id: string }>(
  value: string | T | null,
): T | null => (value && typeof value !== "string" ? value : null);

export const licenseForSession = async (
  sessionId: string | null,
  deps: SessionDeps,
): Promise<SessionLicense> => {
  if (!sessionId || !SESSION_ID.test(sessionId)) return NOT_READY;

  const session = await deps.stripe.retrieveCheckoutSession(sessionId);
  if (session.status !== "complete" || session.payment_status !== "paid") {
    return NOT_READY;
  }
  const subscription = expanded<Stripe.Subscription>(session.subscription);
  const invoice = expanded<Stripe.Invoice>(
    subscription?.latest_invoice ?? null,
  );
  if (!invoice || invoice.status !== "paid") return NOT_READY;

  const buyer = await buyerOf(invoice, deps.stripe.retrieveCustomer);
  const payload = buyer && licensePayloadFor(invoice, buyer, deps.productId);
  if (!payload) return NOT_READY;

  return {
    ok: true,
    key: signLicenseKey(payload, deps.privateKeyPem),
    name: payload.name,
    maskedEmail: maskEmail(payload.email),
    expires: payload.expires,
  };
};

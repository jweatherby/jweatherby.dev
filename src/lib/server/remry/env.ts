// Remry licensing's Vercel environment variables (see README: Remry Pro licensing). Read per
// request, server-side only, so a missing one fails that request with a 500, not the build.

import Stripe from "stripe";
import { readPrivateKeyPem } from "./license.js";
import { remryStripe, type RemryStripe } from "./stripe.js";

export interface RemryEnv {
  readonly stripe: RemryStripe;
  readonly privateKeyPem: string;
  readonly productId: string | undefined;
}

type Env = Readonly<Record<string, string | undefined>>;

export const required = (env: Env, name: string): string => {
  const value = env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
};

export const remryEnv = (env: Env = process.env): RemryEnv => ({
  stripe: remryStripe(new Stripe(required(env, "STRIPE_SECRET_KEY"))),
  privateKeyPem: readPrivateKeyPem(env.REMRY_LICENSE_PRIVATE_KEY),
  productId: env.REMRY_STRIPE_PRODUCT_ID || undefined,
});

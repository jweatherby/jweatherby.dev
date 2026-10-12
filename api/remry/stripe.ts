// Stripe's webhook for Remry Pro: issues and emails a license key on every paid invoice, and
// asks the Remry repo to revoke it on a full refund or a lost dispute.
// A Vercel Node function (not Edge): signing needs node:crypto's Ed25519.
// The logic and its tests are in src/lib/server/remry/.

import { fastmailSender } from "../../src/lib/server/remry/email.js";
import { remryEnv, required } from "../../src/lib/server/remry/env.js";
import { githubDispatcher } from "../../src/lib/server/remry/github.js";
import { handleStripeWebhook } from "../../src/lib/server/remry/webhook.js";

export const POST = async (request: Request): Promise<Response> => {
  try {
    return await handleStripeWebhook(request, {
      ...remryEnv(),
      webhookSecret: required(process.env, "STRIPE_WEBHOOK_SECRET"),
      sendLicenseEmail: fastmailSender(
        required(process.env, "FASTMAIL_PASSWORD"),
      ),
      dispatchRevocation: githubDispatcher({
        token: process.env.GITHUB_DISPATCH_TOKEN,
        fetch,
      }),
      log: console.log,
    });
  } catch (e) {
    console.error("remry: webhook failed:", e instanceof Error ? e.message : e);
    return Response.json(
      { ok: false, error: "webhook failed" },
      { status: 500 },
    );
  }
};

// Stripe's webhook for Remry Pro: issues and emails a license key on every paid invoice, and
// asks the Remry repo to revoke it on a full refund or a lost dispute.
// The logic and its tests are in src/lib/server/remry/.

import { jmapSender } from "$lib/server/email/jmap";
import { licenseSender } from "$lib/server/remry/email";
import { remryEnv, required } from "$lib/server/remry/env";
import { githubDispatcher } from "$lib/server/remry/github";
import { handleStripeWebhook } from "$lib/server/remry/webhook";
import { env } from "cloudflare:workers";
import type { RequestHandler } from "./$types";

export const prerender = false;

export const POST: RequestHandler = async ({ request }) => {
  try {
    return await handleStripeWebhook(request, {
      ...remryEnv(env),
      webhookSecret: required(env, "STRIPE_WEBHOOK_SECRET"),
      sendLicenseEmail: licenseSender(
        jmapSender({ token: required(env, "FASTMAIL_API_TOKEN"), fetch }),
      ),
      dispatchRevocation: githubDispatcher({
        token: env.GITHUB_DISPATCH_TOKEN,
        fetch,
      }),
      log: console.log,
    });
  } catch (e) {
    console.error("remry: webhook failed:", e instanceof Error ? e.message : e);
    return Response.json({ ok: false, error: "webhook failed" }, { status: 500 });
  }
};

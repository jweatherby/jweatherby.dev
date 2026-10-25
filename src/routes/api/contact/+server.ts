// The contact form's endpoint. The checks are in $lib/server/contact.ts.

import { contactEmail } from "$lib/server/contact";
import { jmapSender } from "$lib/server/email/jmap";
import { env } from "cloudflare:workers";
import type { RequestHandler } from "./$types";

export const prerender = false;

export const POST: RequestHandler = async ({ request }) => {
  const result = contactEmail(await request.json().catch(() => null));
  if (!result.ok) return Response.json(result, { status: 400 });

  const token = env.FASTMAIL_API_TOKEN;
  if (!token) {
    console.error("contact: FASTMAIL_API_TOKEN is not set");
    return Response.json(
      { ok: false, errors: [{ message: "Could not send message", code: "INTERNAL_ERROR" }] },
      { status: 500 },
    );
  }
  try {
    await jmapSender({ token, fetch })(result.email);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("contact: send failed:", e instanceof Error ? e.message : e);
    return Response.json(
      { ok: false, errors: [{ message: "Could not send message", code: "INTERNAL_ERROR" }] },
      { status: 500 },
    );
  }
};

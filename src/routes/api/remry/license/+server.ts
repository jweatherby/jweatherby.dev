// The Remry Pro key for a finished checkout, for /remry/thanks?session_id=….
// The logic and its tests are in src/lib/server/remry/.

import { remryEnv } from "$lib/server/remry/env";
import { licenseForSession } from "$lib/server/remry/session";
import { env } from "cloudflare:workers";
import type { RequestHandler } from "./$types";

export const prerender = false;

const NO_STORE = { "cache-control": "no-store" };

export const GET: RequestHandler = async ({ url }) => {
  try {
    const license = await licenseForSession(
      url.searchParams.get("session_id"),
      remryEnv(env),
    );
    return Response.json(license, { headers: NO_STORE });
  } catch (e) {
    console.error("remry: license lookup failed:", e instanceof Error ? e.message : e);
    return Response.json({ ok: false }, { status: 500, headers: NO_STORE });
  }
};

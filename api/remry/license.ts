// The Remry Pro key for a finished checkout, for /remry/thanks?session_id=….
// A Vercel Node function (not Edge): signing needs node:crypto's Ed25519.
// The logic and its tests are in src/lib/server/remry/.

import { remryEnv } from "../../src/lib/server/remry/env.js";
import { licenseForSession } from "../../src/lib/server/remry/session.js";

export const GET = async (request: Request): Promise<Response> => {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  try {
    const license = await licenseForSession(sessionId, remryEnv());
    return Response.json(license, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    console.error(
      "remry: license lookup failed:",
      e instanceof Error ? e.message : e,
    );
    return Response.json(
      { ok: false },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
};

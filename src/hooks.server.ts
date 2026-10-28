// Old links to posts that moved to Substack get a real 301 from the Worker (see $lib/substack.ts).
// Moved posts aren't prerendered, so these requests reach the Worker instead of a static page.

import type { Handle } from "@sveltejs/kit/hooks";
import { redirectFor } from "$lib/substack";

export const handle: Handle = async ({ event, resolve }) => {
  const location = redirectFor(event.url.pathname);
  if (location) {
    return new Response(null, { status: 301, headers: { location } });
  }
  return resolve(event);
};

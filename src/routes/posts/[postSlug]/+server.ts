// Old post links go to the post on Substack (see $lib/substack.ts).

import { redirect } from "@sveltejs/kit";
import { substackUrlFor } from "$lib/substack";
import type { RequestHandler } from "./$types";

export const prerender = false;

export const GET: RequestHandler = ({ params }) =>
  redirect(301, substackUrlFor(params.postSlug), { external: true });

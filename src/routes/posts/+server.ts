// The blog moved to Substack.

import { redirect } from "@sveltejs/kit";
import { SUBSTACK_URL } from "$lib/substack";
import type { RequestHandler } from "./$types";

export const prerender = false;

export const GET: RequestHandler = () => redirect(301, SUBSTACK_URL, { external: true });

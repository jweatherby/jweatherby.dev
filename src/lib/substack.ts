// The blog is moving to Substack one post at a time. A post listed here has moved:
// - /posts/<slug> answers 301 to its Substack page (src/hooks.server.ts),
// - the home page links straight to Substack,
// - it isn't linked here, so it isn't prerendered and its old URL reaches the Worker
//   (src/routes/posts/[postSlug]/+page.ts also redirects, for anything that gets past that).
// A post not listed is still served here as before.
//
// To move a post, add its old slug and its Substack path.

export const SUBSTACK_URL = "https://blog.jweatherby.dev";

export const MOVED_POSTS: Readonly<Record<string, string>> = {
  "7-docs-that-scale": "/p/docs-that-scale",
  "9-engineering-goals": "/p/the-big-3-of-engineering-goals",
};

/** A post written on Substack, with no copy here. The home page lists it with the others. */
export interface SubstackPost {
  readonly title: string;
  readonly path: string;
  readonly dateCreated: Date;
}

// New posts, written on Substack. Add a line for each one to list it on the home page.
export const SUBSTACK_POSTS: readonly SubstackPost[] = [
  { title: "Why I built Remry", path: "/p/why-i-built-remry", dateCreated: new Date("2026-10-27T13:00:00Z") },
];

/** The Substack URL of a moved post, or null when it's still served here. */
export const substackUrlFor = (slug: string): string | null => {
  const path = Object.hasOwn(MOVED_POSTS, slug) ? MOVED_POSTS[slug] : undefined;
  return path ? new URL(path, SUBSTACK_URL).href : null;
};

/** Where a request path should be redirected: an old /posts/<slug> URL of a moved post. */
export const redirectFor = (pathname: string): string | null => {
  const slug = pathname.match(/^\/posts\/([^/]+)\/?$/)?.[1];
  return slug ? substackUrlFor(decodeURIComponent(slug)) : null;
};

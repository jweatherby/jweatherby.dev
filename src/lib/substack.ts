// The blog moved to Substack. Old /posts/<slug> links redirect to each post's new home.
//
// Fill in a post's Substack path (e.g. "/p/structuring-your-code") once it's published there.
// A post without one, or a slug not listed, goes to the Substack front page.

export const SUBSTACK_URL = "https://blog.jweatherby.dev";

export const POST_REDIRECTS: Readonly<Record<string, string | null>> = {
  "1-being-full-stack": null,
  "2-my-frontend-stack": null,
  "3-structuring-your-code": null,
  "4-quill-tips": null,
  "5-services-offered": null,
  "6-showboard-the-rewrite-nobody-asked-for": null,
  "7-docs-that-scale": null,
  "8-roles-and-expectations": null,
  "9-engineering-goals": null,
  "10-engineering-goals-with-ai": null,
};

export const substackUrlFor = (slug: string | undefined): string => {
  const path = slug ? POST_REDIRECTS[slug] : null;
  return path ? new URL(path, SUBSTACK_URL).href : SUBSTACK_URL;
};

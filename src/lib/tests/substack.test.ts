import { describe, expect, it } from "vitest";
import { POST_REDIRECTS, SUBSTACK_URL, substackUrlFor } from "../substack.js";

describe("substackUrlFor", () => {
  it("sends unknown or unmapped posts to the Substack front page", () => {
    expect(substackUrlFor(undefined)).toBe(SUBSTACK_URL);
    expect(substackUrlFor("no-such-post")).toBe(SUBSTACK_URL);
  });

  it("sends a mapped post to its Substack page", () => {
    const mapped = Object.entries(POST_REDIRECTS).find(([, path]) => path);
    if (!mapped) return;
    const [slug, path] = mapped;
    expect(substackUrlFor(slug)).toBe(new URL(path!, SUBSTACK_URL).href);
  });
});

import { describe, expect, it } from "vitest";
import { MOVED_POSTS, SUBSTACK_POSTS, redirectFor, substackUrlFor } from "../substack.js";

describe("substackUrlFor", () => {
  it("gives a moved post's Substack page", () => {
    expect(substackUrlFor("9-engineering-goals")).toBe(
      "https://blog.jweatherby.dev/p/the-big-3-of-engineering-goals",
    );
    expect(substackUrlFor("7-docs-that-scale")).toBe(
      "https://blog.jweatherby.dev/p/docs-that-scale",
    );
  });

  it("is null for a post still served here, or an unknown one", () => {
    expect(substackUrlFor("10-engineering-goals-with-ai")).toBeNull();
    expect(substackUrlFor("no-such-post")).toBeNull();
    expect(substackUrlFor("toString")).toBeNull();
  });

  it("maps every moved post to a /p/ path", () => {
    for (const path of Object.values(MOVED_POSTS)) expect(path).toMatch(/^\/p\/[a-z0-9-]+$/);
  });
});

describe("SUBSTACK_POSTS", () => {
  it("gives every new post a title, a /p/ path and a date", () => {
    for (const post of SUBSTACK_POSTS) {
      expect(post.title).not.toBe("");
      expect(post.path).toMatch(/^\/p\/[a-z0-9-]+$/);
      expect(Number.isNaN(post.dateCreated.getTime())).toBe(false);
    }
  });
});

describe("redirectFor", () => {
  it("redirects a moved post's old URL, with or without a trailing slash", () => {
    const target = "https://blog.jweatherby.dev/p/docs-that-scale";
    expect(redirectFor("/posts/7-docs-that-scale")).toBe(target);
    expect(redirectFor("/posts/7-docs-that-scale/")).toBe(target);
  });

  it("leaves everything else alone", () => {
    expect(redirectFor("/posts/10-engineering-goals-with-ai")).toBeNull();
    expect(redirectFor("/posts")).toBeNull();
    expect(redirectFor("/posts/7-docs-that-scale/__data.json")).toBeNull();
    expect(redirectFor("/")).toBeNull();
    expect(redirectFor("/api/contact")).toBeNull();
  });
});

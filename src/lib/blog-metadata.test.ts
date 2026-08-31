import { describe, expect, it } from "vitest";

import { resolveArticleImageUrl } from "./blog-metadata";

describe("resolveArticleImageUrl", () => {
  it("preserves an absolute Unsplash image URL", () => {
    const image = "https://images.unsplash.com/photo-123?w=800&h=192&fit=crop";

    expect(resolveArticleImageUrl(image, "https://example.com")).toBe(image);
  });

  it("resolves a site-relative image path against the site origin", () => {
    expect(
      resolveArticleImageUrl("/images/post.png", "https://example.com")
    ).toBe("https://example.com/images/post.png");
  });

  it("returns undefined when no image is provided", () => {
    expect(resolveArticleImageUrl(undefined, "https://example.com")).toBeUndefined();
  });
});

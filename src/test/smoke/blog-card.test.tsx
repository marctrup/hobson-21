import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../utils";
import { BlogPostCard } from "@/components/blog/BlogPostCard";

const post = {
  id: "1",
  slug: "my-post",
  title: "My Test Post",
  excerpt: "An excerpt",
  featured_image_url: null,
  published_at: new Date("2025-01-15").toISOString(),
  categories: [{ name: "News", slug: "news" }],
} as any;

describe("BlogPostCard — Read More", () => {
  it("renders a 'Read More' link pointing to /blog/<slug>", () => {
    renderWithProviders(<BlogPostCard post={post} />);
    const link = screen.getByRole("link", { name: /Read More/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/blog/my-post");
  });

  it("title also links to the post detail page", () => {
    renderWithProviders(<BlogPostCard post={post} />);
    const titleLink = screen.getByRole("link", { name: /My Test Post/i });
    expect(titleLink).toHaveAttribute("href", "/blog/my-post");
  });

  it("encodes special characters in the slug", () => {
    renderWithProviders(<BlogPostCard post={{ ...post, slug: "hello world" }} />);
    const link = screen.getByRole("link", { name: /Read More/i });
    expect(link.getAttribute("href")).toBe("/blog/hello%20world");
  });
});

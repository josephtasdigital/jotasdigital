import matter from "gray-matter";

export interface MarkdownContent {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

// Import all markdown files from content directories at build time
const portfolioFiles = import.meta.glob("/content/portfolio/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const blogFiles = import.meta.glob("/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const playgroundFiles = import.meta.glob("/content/hidden-lab/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFiles(files: Record<string, string>): MarkdownContent[] {
  return Object.entries(files).map(([path, raw]) => {
    const slug = path.split("/").pop()?.replace(".md", "") ?? "";
    const { data, content } = matter(raw);
    return { slug, frontmatter: data, content };
  });
}

export function getPortfolioItems(): MarkdownContent[] {
  return parseFiles(portfolioFiles);
}

export function getBlogPosts(): MarkdownContent[] {
  return parseFiles(blogFiles).sort((a, b) => {
    const da = new Date(a.frontmatter.date ?? 0).getTime();
    const db = new Date(b.frontmatter.date ?? 0).getTime();
    return db - da;
  });
}

export function getPlaygroundItems(): MarkdownContent[] {
  return parseFiles(playgroundFiles);
}

export function getPortfolioItem(slug: string): MarkdownContent | undefined {
  return getPortfolioItems().find((i) => i.slug === slug);
}

export function getBlogPost(slug: string): MarkdownContent | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}

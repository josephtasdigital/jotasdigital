export interface MarkdownContent {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

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

const serviceFiles = import.meta.glob("/content/services/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const playgroundFiles = import.meta.glob("/content/hidden-lab/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const jsShowcaseFiles = import.meta.glob("/content/js-showcase/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const siteSettingsFiles = import.meta.glob("/content/site-settings/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw.trim() };

  const yamlBlock = match[1];
  const content = match[2].trim();
  const data: Record<string, any> = {};

  const lines = yamlBlock.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const idx = line.indexOf(":");
    if (idx === -1) { i++; continue; }
    const key = line.slice(0, idx).trim();
    let val: any = line.slice(idx + 1).trim();

    // Handle YAML block scalar (| or >)
    if (val === "|" || val === ">" || val === "|+" || val === "|-") {
      const blockLines: string[] = [];
      i++;
      while (i < lines.length) {
        const nextLine = lines[i];
        // Block ends when we hit a non-indented line
        if (nextLine.length > 0 && !nextLine.startsWith("  ") && !nextLine.startsWith("\t")) break;
        blockLines.push(nextLine.replace(/^  /, ""));
        i++;
      }
      data[key] = blockLines.join("\n").trim();
      continue;
    }

    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (val.startsWith("[") && val.endsWith("]")) {
      val = val.slice(1, -1).split(",").map((s: string) => s.trim().replace(/^["']|["']$/g, ""));
    }
    data[key] = val;
    i++;
  }

  return { data, content };
}

function parseFiles(files: Record<string, string>): MarkdownContent[] {
  return Object.entries(files).map(([path, raw]) => {
    const slug = path.split("/").pop()?.replace(".md", "") ?? "";
    const { data, content } = parseFrontmatter(raw);
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

export function getServiceItems(): MarkdownContent[] {
  return parseFiles(serviceFiles).sort((a, b) => {
    const sa = Number(a.frontmatter.sort_order ?? 99);
    const sb = Number(b.frontmatter.sort_order ?? 99);
    return sa - sb;
  });
}

export function getPlaygroundItems(): MarkdownContent[] {
  return parseFiles(playgroundFiles);
}

export function getJsShowcaseItems(): MarkdownContent[] {
  return parseFiles(jsShowcaseFiles);
}

export function getSiteSettings(): Record<string, any> {
  const items = parseFiles(siteSettingsFiles);
  const profile = items.find((i) => i.slug === "profile");
  return profile?.frontmatter ?? {};
}

export function getPortfolioItem(slug: string): MarkdownContent | undefined {
  return getPortfolioItems().find((i) => i.slug === slug);
}

export function getBlogPost(slug: string): MarkdownContent | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}

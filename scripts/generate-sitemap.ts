// Runs before `vite dev` and `vite build` (predev/prebuild); writes public/sitemap.xml.
import { readdirSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://jotasdigital.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

function slugsIn(dir: string): string[] {
  const full = resolve(dir);
  if (!existsSync(full)) return [];
  return readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  ...slugsIn("content/blog").map<SitemapEntry>((slug) => ({
    path: `/blog/${encodeURIComponent(slug)}`,
    changefreq: "monthly",
    priority: "0.7",
  })),
  ...slugsIn("content/portfolio").map<SitemapEntry>((slug) => ({
    path: `/portfolio/${encodeURIComponent(slug)}`,
    changefreq: "monthly",
    priority: "0.7",
  })),
];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);

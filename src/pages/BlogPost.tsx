import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getBlogPost } from "@/lib/markdown";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";

/** Very simple markdown-to-JSX: handles images, headings, bold, italic, links, paragraphs */
function renderMarkdown(raw: string) {
  const lines = raw.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<br key={key++} />);
      continue;
    }

    // Images: ![alt](src)
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      elements.push(
        <img
          key={key++}
          src={imgMatch[2]}
          alt={imgMatch[1]}
          className="w-full max-w-2xl mx-auto rounded-sm border border-border my-6"
          loading="lazy"
        />
      );
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
      elements.push(
        <Tag key={String(key++)} className="font-display text-foreground font-bold mt-8 mb-3">
          {text}
        </Tag>
      );
      continue;
    }

    // Inline formatting within a paragraph
    elements.push(<p key={key++}>{renderInline(trimmed)}</p>);
  }

  return elements;
}

function renderInline(text: string): React.ReactNode[] {
  // Split on inline images, bold, italic, links
  const parts: React.ReactNode[] = [];
  const regex = /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      // inline image
      parts.push(
        <img key={k++} src={match[2]} alt={match[1]} className="inline-block max-h-64 rounded-sm border border-border my-2" loading="lazy" />
      );
    } else if (match[3] !== undefined) {
      // link
      parts.push(<a key={k++} href={match[4]} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{match[3]}</a>);
    } else if (match[5] !== undefined) {
      parts.push(<strong key={k++} className="text-foreground font-semibold">{match[5]}</strong>);
    } else if (match[6] !== undefined) {
      parts.push(<em key={k++}>{match[6]}</em>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <SiteNav />
        <div className="section-container pt-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
          <Link to="/#blog" className="text-primary font-display text-sm uppercase tracking-wider hover:underline">
            ← Back to Blog
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const { frontmatter, content } = post;
  const excerpt: string =
    (frontmatter.excerpt as string) ||
    content.replace(/[#*_>`!\[\]()]/g, "").trim().slice(0, 155);
  const canonical = `https://jotasdigital.lovable.app/blog/${slug}`;

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>{`${frontmatter.title} — Joseph Tas`}</title>
        <meta name="description" content={excerpt} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={frontmatter.title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: frontmatter.title,
          datePublished: frontmatter.date,
          author: { "@type": "Person", name: frontmatter.author || "Joseph Tas" },
          mainEntityOfPage: canonical,
        })}</script>
      </Helmet>
      <SiteNav />
      <article className="section-container pt-32 max-w-3xl mx-auto">
        <Link
          to="/#blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-display text-xs uppercase tracking-wider mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <header className="mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
            {frontmatter.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm font-display">
            {frontmatter.date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {new Date(frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {frontmatter.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {frontmatter.readTime}
              </span>
            )}
          </div>
          {frontmatter.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {(frontmatter.tags as string[]).map((tag: string) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-0.5 text-xs font-display uppercase tracking-wider text-secondary-foreground border border-border rounded-sm"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-invert prose-sm max-w-none font-body text-muted-foreground leading-relaxed space-y-2 [&_img]:max-w-full [&_img]:h-auto [&_img]:object-cover">
          {renderMarkdown(content)}
        </div>
      </article>
      <Footer />
    </main>
  );
};

export default BlogPost;

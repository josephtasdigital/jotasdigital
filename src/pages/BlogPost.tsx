import { useParams, Link } from "react-router-dom";
import { getBlogPost } from "@/lib/markdown";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";

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

  return (
    <main className="min-h-screen bg-background">
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

        <div className="prose prose-invert prose-sm max-w-none font-body text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </article>
      <Footer />
    </main>
  );
};

export default BlogPost;

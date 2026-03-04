import { useParams, Link } from "react-router-dom";
import { getPortfolioItem } from "@/lib/markdown";
import { ArrowLeft, FileImage, FileText, Presentation } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";

const typeIconMap: Record<string, React.ReactNode> = {
  "Image Set": <FileImage className="w-5 h-5 text-primary" />,
  "PDF Document": <FileText className="w-5 h-5 text-primary" />,
  "PowerPoint Embed": <Presentation className="w-5 h-5 text-warning" />,
};

const PortfolioItem = () => {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? getPortfolioItem(slug) : undefined;

  if (!item) {
    return (
      <main className="min-h-screen bg-background">
        <SiteNav />
        <div className="section-container pt-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Project Not Found</h1>
          <Link to="/#work" className="text-primary font-display text-sm uppercase tracking-wider hover:underline">
            ← Back to Work
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const { frontmatter, content } = item;

  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <div className="section-container pt-32 max-w-4xl mx-auto">
        <Link
          to="/#work"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-display text-xs uppercase tracking-wider mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Work
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            {typeIconMap[frontmatter.type] ?? <FileImage className="w-5 h-5 text-primary" />}
            <span className="font-display text-xs uppercase tracking-wider text-primary">
              {frontmatter.type}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            {frontmatter.title}
          </h1>
        </header>

        {frontmatter.featured_image && (
          <div className="aspect-video bg-card border border-border rounded-sm overflow-hidden mb-8 border-glow">
            <img
              src={frontmatter.featured_image}
              alt={frontmatter.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {frontmatter.gallery && frontmatter.gallery.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {(frontmatter.gallery as string[]).map((img: string, i: number) => (
              <div key={i} className="aspect-video bg-card border border-border rounded-sm overflow-hidden">
                <img src={img} alt={`${frontmatter.title} gallery ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-invert prose-sm max-w-none font-body text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default PortfolioItem;

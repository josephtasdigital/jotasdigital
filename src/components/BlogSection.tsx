import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Tag } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}

const posts: BlogPost[] = [
  {
    id: 1,
    title: "Building Idempotent Data Pipelines",
    excerpt: "How to design ETL systems that gracefully handle retries, duplicates, and partial failures without data corruption.",
    date: "2026-02-15",
    readTime: "8 min",
    tags: ["Engineering", "ETL"],
  },
  {
    id: 2,
    title: "GA4 Event Taxonomy: A Factory Approach",
    excerpt: "Applying manufacturing logic to event naming conventions and measurement plan architecture.",
    date: "2026-01-28",
    readTime: "6 min",
    tags: ["Analytics", "GA4"],
  },
  {
    id: 3,
    title: "dbt Models as Documentation",
    excerpt: "Using your transformation layer as the single source of truth for business logic documentation.",
    date: "2026-01-10",
    readTime: "5 min",
    tags: ["dbt", "Documentation"],
  },
];

const BlogSection = () => {
  return (
    <section id="blog" className="border-t border-border" data-gtm="blog-section">
      <div className="section-container">
        <span className="section-label">// Blog</span>
        <h2 className="section-title">Technical Writing</h2>

        <div className="space-y-1">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group border border-border rounded-sm p-6 hover:border-primary/40 hover:bg-card/50 transition-all duration-300 cursor-pointer"
              data-gtm={`blog-post-${post.id}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 flex items-center gap-2">
                    {post.title}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-display">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 text-xs font-display uppercase tracking-wider text-secondary-foreground border border-border rounded-sm">
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

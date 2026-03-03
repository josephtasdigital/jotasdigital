import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, FileImage, FileText, Presentation } from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  type: "image" | "pdf" | "pptx";
  src: string;
  tags: string[];
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Data Pipeline Architecture",
    description: "End-to-end ETL pipeline processing 2M+ records daily across 12 data sources.",
    type: "image",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tags: ["Airflow", "BigQuery", "Python"],
  },
  {
    id: 2,
    title: "Real-Time Analytics Dashboard",
    description: "Live KPI monitoring system with sub-second latency for e-commerce operations.",
    type: "image",
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    tags: ["Looker", "dbt", "Streaming"],
  },
  {
    id: 3,
    title: "GA4 Measurement Plan",
    description: "Comprehensive measurement framework documentation for enterprise GTM setup.",
    type: "pdf",
    src: "",
    tags: ["GA4", "GTM", "Documentation"],
  },
  {
    id: 4,
    title: "Data Strategy Presentation",
    description: "Executive deck outlining 3-year data infrastructure modernization roadmap.",
    type: "pptx",
    src: "",
    tags: ["Strategy", "Cloud", "Migration"],
  },
];

const FileTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "pdf": return <FileText className="w-5 h-5" />;
    case "pptx": return <Presentation className="w-5 h-5" />;
    default: return <FileImage className="w-5 h-5" />;
  }
};

const PortfolioSection = () => {
  const [current, setCurrent] = useState(0);
  const item = portfolioItems[current];

  const next = () => setCurrent((c) => (c + 1) % portfolioItems.length);
  const prev = () => setCurrent((c) => (c - 1 + portfolioItems.length) % portfolioItems.length);

  return (
    <section id="work" className="border-t border-border" data-gtm="portfolio-section">
      <div className="section-container">
        <span className="section-label">// Portfolio</span>
        <h2 className="section-title">Selected Work</h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Viewer */}
          <div className="relative aspect-video bg-card border border-border rounded-sm overflow-hidden border-glow">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {item.type === "image" && (
                  <img src={item.src} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                )}
                {item.type === "pdf" && (
                  <div className="text-center p-8">
                    <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="font-display text-sm text-muted-foreground">
                      PDF Viewer — Upload your .pdf file to render here
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-2 font-display">
                      Supports react-pdf integration
                    </p>
                  </div>
                )}
                {item.type === "pptx" && (
                  <div className="text-center p-8">
                    <Presentation className="w-16 h-16 text-warning mx-auto mb-4" />
                    <p className="font-display text-sm text-muted-foreground">
                      PowerPoint Placeholder
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-2 font-display">
                      Embed via iframe: Google Slides / Office Online viewer
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav arrows */}
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-background/70 border border-border rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors" data-gtm="portfolio-prev">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-background/70 border border-border rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors" data-gtm="portfolio-next">
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 right-3 font-display text-xs text-muted-foreground bg-background/70 px-2 py-1 rounded-sm">
              {current + 1} / {portfolioItems.length}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileTypeIcon type={item.type} />
                  <span className="font-display text-xs uppercase tracking-wider text-primary">
                    .{item.type}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-6">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-xs font-display uppercase tracking-wider border border-border text-secondary-foreground rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex gap-2 mt-8">
              {portfolioItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground"
                  }`}
                  data-gtm={`portfolio-dot-${i}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;

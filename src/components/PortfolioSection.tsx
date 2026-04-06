import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, FileImage, FileText, Presentation } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getPortfolioItems } from "@/lib/markdown";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

const fallbackItems = [
  {
    slug: "_demo-1",
    frontmatter: {
      title: "Data Pipeline Architecture",
      type: "Image Set",
      featured_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    },
    content: "End-to-end ETL pipeline processing 2M+ records daily across 12 data sources.",
  },
  {
    slug: "_demo-2",
    frontmatter: {
      title: "Real-Time Analytics Dashboard",
      type: "Image Set",
      featured_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    },
    content: "Live KPI monitoring system with sub-second latency for e-commerce operations.",
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  "Image Set": <FileImage className="w-4 h-4" />,
  "PDF Document": <FileText className="w-4 h-4" />,
  "PowerPoint Embed": <Presentation className="w-4 h-4" />,
};

const PortfolioSection = () => {
  const { t } = useTranslation();
  const mdItems = getPortfolioItems();
  const items = mdItems.length > 0 ? mdItems : fallbackItems;
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api, onSelect]);

  const activeTitle = items[activeIndex]?.frontmatter.title ?? t("portfolio.heading");

  return (
    <section id="work" className="border-t border-border" data-gtm="portfolio-section">
      <div className="section-container">
        <span className="section-label">{t("portfolio.label")}</span>
        <h2 className="section-title transition-all duration-300">{activeTitle}</h2>

        <div className="relative px-12">
          <Carousel opts={{ align: "start", loop: true }} setApi={setApi} className="w-full">
            <CarouselContent className="-ml-4">
              {items.map((item, i) => {
                const fm = item.frontmatter;
                const isDemo = item.slug.startsWith("_demo");

                const card = (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="group border border-border rounded-sm overflow-hidden hover:border-primary/40 transition-all duration-300 cursor-pointer bg-card/30 h-full"
                    data-gtm={`portfolio-${item.slug}`}
                  >
                    <div className="aspect-video bg-card overflow-hidden relative">
                      {fm.thumbnail_image_url ? (
                        <img src={fm.thumbnail_image_url} alt={fm.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : fm.featured_image && !fm.featured_image.endsWith(".pptx") && !fm.featured_image.endsWith(".pdf") ? (
                        <img src={fm.featured_image} alt={fm.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-card">
                          {fm.type === "PowerPoint Embed" ? (
                            <Presentation className="w-12 h-12 text-warning/40" />
                          ) : fm.type === "PDF Document" ? (
                            <FileText className="w-12 h-12 text-primary/40" />
                          ) : (
                            <FileImage className="w-12 h-12 text-muted-foreground/30" />
                          )}
                          <span className="font-display text-[10px] uppercase tracking-wider text-muted-foreground/50">{fm.type}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-primary">{typeIcons[fm.type] ?? <FileImage className="w-3.5 h-3.5" />}</span>
                        <span className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">{fm.type}</span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        {fm.title}
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </h3>
                      <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2">{item.content.slice(0, 140)}</p>
                    </div>
                  </motion.div>
                );

                return (
                  <CarouselItem key={item.slug} className="pl-4 md:basis-1/2">
                    {isDemo ? <div className="h-full">{card}</div> : <Link to={`/portfolio/${item.slug}`} className="block h-full">{card}</Link>}
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="border-border bg-card hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="border-border bg-card hover:bg-primary hover:text-primary-foreground" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;

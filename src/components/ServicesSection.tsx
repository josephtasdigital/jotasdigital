import { motion } from "framer-motion";
import { getServiceItems } from "@/lib/markdown";

interface GroupedTier {
  tier: string;
  label: string;
  description: string;
  items: ReturnType<typeof getServiceItems>;
}

const tierOrder = ["major", "minor", "nano"];

const fallbackItems = [
  { slug: "_demo-1", frontmatter: { title: "Data Pipeline Architecture", tier: "major", tier_label: "Major Services", tier_description: "End-to-end solutions for complex data challenges", sort_order: 1, service_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80" }, content: "" },
  { slug: "_demo-2", frontmatter: { title: "Analytics Implementation", tier: "major", tier_label: "Major Services", tier_description: "End-to-end solutions for complex data challenges", sort_order: 2, service_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80" }, content: "" },
  { slug: "_demo-3", frontmatter: { title: "Dashboard Development", tier: "minor", tier_label: "Minor Services", tier_description: "Focused deliverables for specific needs", sort_order: 3, service_image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&q=80" }, content: "" },
];

const ServicesSection = () => {
  const mdItems = getServiceItems();
  const items = mdItems.length > 0 ? mdItems : fallbackItems;

  // Group by tier
  const grouped = new Map<string, GroupedTier>();
  for (const item of items) {
    const t = item.frontmatter.tier ?? "nano";
    if (!grouped.has(t)) {
      grouped.set(t, {
        tier: t,
        label: item.frontmatter.tier_label ?? t,
        description: item.frontmatter.tier_description ?? "",
        items: [],
      });
    }
    grouped.get(t)!.items.push(item);
  }

  const tiers = tierOrder.filter((t) => grouped.has(t)).map((t) => grouped.get(t)!);

  return (
    <section id="services" className="border-t border-border" data-gtm="services-section">
      <div className="section-container">
        <span className="section-label">// Services</span>
        <h2 className="section-title">What I Deliver</h2>

        <div className="space-y-12">
          {tiers.map((tier, ti) => (
            <div key={tier.tier}>
              <div className="mb-4">
                <h3 className="font-display text-sm uppercase tracking-widest text-primary mb-1">
                  {tier.label}
                </h3>
                <p className="font-body text-xs text-muted-foreground">{tier.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tier.items.map((item, si) => (
                  <motion.div
                    key={item.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: ti * 0.1 + si * 0.06, duration: 0.45 }}
                    className="border border-transparent rounded-sm overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-card/50 bg-card/30"
                    data-gtm={`service-${tier.tier}-${si}`}
                  >
                    {item.frontmatter.service_image && (
                      <img
                        src={item.frontmatter.service_image}
                        alt={item.frontmatter.title}
                        className="w-full h-40 object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="p-5">
                      <h4 className="font-display text-sm font-semibold text-foreground leading-snug">
                        {item.frontmatter.title}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

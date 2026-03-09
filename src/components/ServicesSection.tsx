import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceRow {
  id: string;
  title: string;
  tier: string;
  tier_label: string;
  tier_description: string;
  service_image_url: string | null;
  sort_order: number;
}

interface GroupedTier {
  tier: string;
  label: string;
  description: string;
  services: ServiceRow[];
}

const tierOrder = ["major", "minor", "nano"];
const defaultImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80";

const ServicesSection = () => {
  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async (): Promise<GroupedTier[]> => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;

      const rows = data as ServiceRow[];
      const grouped = new Map<string, GroupedTier>();

      for (const row of rows) {
        if (!grouped.has(row.tier)) {
          grouped.set(row.tier, {
            tier: row.tier,
            label: row.tier_label,
            description: row.tier_description,
            services: [],
          });
        }
        grouped.get(row.tier)!.services.push(row);
      }

      return tierOrder
        .filter((t) => grouped.has(t))
        .map((t) => grouped.get(t)!);
    },
  });

  return (
    <section id="services" className="border-t border-border" data-gtm="services-section">
      <div className="section-container">
        <span className="section-label">// Services</span>
        <h2 className="section-title">What I Deliver</h2>

        {isLoading ? (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-56 rounded-sm" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                  {tier.services.map((service, si) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: ti * 0.1 + si * 0.06, duration: 0.45 }}
                      className="border border-transparent rounded-sm overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-card/50 bg-card/30"
                      data-gtm={`service-${tier.tier}-${si}`}
                    >
                      <img
                        src={service.service_image_url || defaultImage}
                        alt={service.title}
                        className="w-full h-40 object-cover"
                        loading="lazy"
                      />
                      <div className="p-5">
                        <h4 className="font-display text-sm font-semibold text-foreground leading-snug">
                          {service.title}
                        </h4>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;

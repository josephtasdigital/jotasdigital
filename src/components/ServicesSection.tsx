import { motion } from "framer-motion";
import { Layers, Server, BarChart3, Settings2, LineChart, Link2, FileSearch, Zap } from "lucide-react";

interface ServiceItem {
  title: string;
  icon: React.ReactNode;
}

interface ServiceTier {
  tier: string;
  label: string;
  description: string;
  services: ServiceItem[];
}

const serviceTiers: ServiceTier[] = [
  {
    tier: "major",
    label: "Major Services",
    description: "Full-scope enterprise implementations",
    services: [
      {
        title: "Total Remarketing Setup — Enhanced Conversions + Server-Side Tracking",
        icon: <Layers className="w-6 h-6" />,
      },
    ],
  },
  {
    tier: "minor",
    label: "Minor Services",
    description: "Focused specialist setups",
    services: [
      {
        title: "Server-Side Tracking System Complete (Google Cloud)",
        icon: <Server className="w-6 h-6" />,
      },
      {
        title: "Server-Side Tracking System Complete (Stape)",
        icon: <Server className="w-6 h-6" />,
      },
      {
        title: "Enhanced Conversions Setup",
        icon: <Zap className="w-6 h-6" />,
      },
    ],
  },
  {
    tier: "nano",
    label: "Nano Services",
    description: "Quick wins & foundational tasks",
    services: [
      {
        title: "GTM / GA4 / Ads Integration",
        icon: <Settings2 className="w-6 h-6" />,
      },
      {
        title: "Basic Conversion Tracking Setup",
        icon: <BarChart3 className="w-6 h-6" />,
      },
      {
        title: "Google Analytics Linking",
        icon: <Link2 className="w-6 h-6" />,
      },
      {
        title: "90-Days Analysis Report",
        icon: <FileSearch className="w-6 h-6" />,
      },
    ],
  },
];

const tierColors: Record<string, string> = {
  major: "border-primary/60 bg-primary/5",
  minor: "border-accent/40 bg-accent/5",
  nano: "border-border bg-card/30",
};

const ServicesSection = () => {
  return (
    <section id="services" className="border-t border-border" data-gtm="services-section">
      <div className="section-container">
        <span className="section-label">// Services</span>
        <h2 className="section-title">What I Deliver</h2>

        <div className="space-y-12">
          {serviceTiers.map((tier, ti) => (
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
                    key={service.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: (ti * 0.1) + (si * 0.06), duration: 0.45 }}
                    className={`border rounded-sm p-5 transition-all duration-300 hover:border-primary/50 ${tierColors[tier.tier]}`}
                    data-gtm={`service-${tier.tier}-${si}`}
                  >
                    <div className="text-primary mb-3">{service.icon}</div>
                    <h4 className="font-display text-sm font-semibold text-foreground leading-snug">
                      {service.title}
                    </h4>
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

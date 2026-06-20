import { motion } from "framer-motion";
import { Terminal, Cpu, Globe, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const highlights = [
  { icon: Terminal, key: "whoami.highlight1" },
  { icon: Cpu, key: "whoami.highlight2" },
  { icon: Globe, key: "whoami.highlight3" },
  { icon: Zap, key: "whoami.highlight4" },
];

const WhoAmISection = () => {
  const { t } = useTranslation();

  return (
    <section id="whoami" className="border-t border-border" data-gtm="whoami-section">
      <div className="section-container">
        <span className="section-label">{t("whoami.label")}</span>
        <h2 className="section-title">{t("whoami.heading")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Bio text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-body text-foreground leading-relaxed mb-6">
              {t("whoami.bio1")}
            </p>
            <p className="font-body text-foreground leading-relaxed">
              {t("whoami.bio2")}
            </p>
          </motion.div>

          {/* Highlight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map(({ icon: Icon, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="border border-border/60 rounded-sm p-5 bg-card/30 hover:border-primary/50 hover:bg-card/50 transition-all duration-300"
              >
                <Icon className="w-5 h-5 text-primary mb-3" />
                <h4 className="font-display text-sm font-semibold text-foreground mb-1">
                  {t(`${key}.title`)}
                </h4>
                <p className="font-body text-xs text-foreground leading-relaxed">
                  {t(`${key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoAmISection;

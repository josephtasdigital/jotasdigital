import { motion } from "framer-motion";
import { ArrowDown, Database, Workflow, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroBg from "@/assets/hero-bg.jpg";
import { getSiteSettings } from "@/lib/markdown";
import placeholderPortrait from "@/assets/placeholder-portrait.png";

const HeroSection = () => {
  const { t } = useTranslation();
  const settings = getSiteSettings();
  const heroPhoto = settings.hero_photo || placeholderPortrait;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-gtm="hero-section"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-20" />

      <div className="relative z-10 section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="section-label">{t("hero.subtitle")}</span>

          <div className="flex items-center justify-center gap-8 md:gap-12 mb-8">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95]">
              <span className="text-foreground">{t("hero.title1")}</span>
              <br />
              <span className="text-primary text-glow">{t("hero.title2")}</span>
            </h1>

            {/* Portrait photo */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="hidden md:block shrink-0"
            >
              <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden border-2 border-primary/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                <img
                  src={heroPhoto}
                  alt="Joseph Tas"
                  className="w-full h-full object-cover object-top"
                  width={512}
                  height={640}
                />
              </div>
            </motion.div>
          </div>

          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            {t("hero.description")}
          </p>

          {/* Capability pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {[
              { icon: Database, label: t("hero.pill1") },
              { icon: Workflow, label: t("hero.pill2") },
              { icon: BarChart3, label: t("hero.pill3") },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-sm bg-card/50 backdrop-blur-sm"
              >
                <Icon className="w-4 h-4 text-primary" />
                <span className="font-display text-xs uppercase tracking-wider text-secondary-foreground">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.a
          href="#work"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-display text-xs uppercase tracking-widest"
          data-gtm="hero-scroll-cta"
        >
          {t("hero.cta")}
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;

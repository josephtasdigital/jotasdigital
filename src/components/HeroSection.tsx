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

  const handleScrollToWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("work");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-gtm="hero-section"
    >
      {/* Animated background layer (transparent so 3D shape shows through) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-10"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/30 to-background/60" />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-10" />

      {/* Floating glassmorphism accent shapes */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main content */}
      <div className="relative z-10 section-container w-full flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center max-w-5xl mx-auto">
          {/* Photo — shown first on mobile, second on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center md:order-2"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-primary/10 blur-xl" />
              <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden border border-border/50 shadow-lg shadow-primary/5">
                <img
                  src={heroPhoto}
                  alt="Joseph Tas"
                  className="w-full h-full object-cover object-top"
                  width={512}
                  height={640}
                />
              </div>
            </div>
          </motion.div>

          {/* Text block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="flex flex-col items-center md:items-start text-center md:text-left md:order-1"
          >
            {/* Name */}
            <span className="font-display text-lg md:text-xl font-semibold text-foreground/90 tracking-wide mb-2">
              Joseph Tas
            </span>

            {/* Subtitle — scaled up 50% */}
            <span className="font-display text-sm md:text-base uppercase tracking-[0.3em] text-primary mb-4 block">
              {t("hero.subtitle")}
            </span>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6 text-balance">
              <span className="text-foreground">{t("hero.title1")}</span>
              <br />
              <span className="text-primary text-glow">{t("hero.title2")}</span>
            </h1>

            <p
              className="font-body text-base md:text-lg max-w-2xl mb-8 leading-relaxed text-balance"
              style={{ color: "#E2E8F0", textShadow: "0px 2px 4px rgba(0,0,0,0.6)" }}
            >
              {t("hero.description")}
            </p>

            {/* Capability pills */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2.5 mb-10">
              {[
                { icon: Database, label: t("hero.pill1") },
                { icon: Workflow, label: t("hero.pill2") },
                { icon: BarChart3, label: t("hero.pill3") },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 border border-border/60 rounded-sm bg-card/40 backdrop-blur-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  <span className="font-display text-[10px] uppercase tracking-wider text-secondary-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA — centered, enlarged 50%, fixed scroll */}
            <motion.a
              href="#work"
              onClick={handleScrollToWork}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors font-display text-sm md:text-base uppercase tracking-widest w-full md:w-auto"
              data-gtm="hero-scroll-cta"
            >
              {t("hero.cta")}
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

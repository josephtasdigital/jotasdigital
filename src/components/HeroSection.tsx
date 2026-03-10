import { motion } from "framer-motion";
import { ArrowDown, Database, Workflow, BarChart3 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
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
          <span className="section-label">Data Engineer & Analytics Specialist</span>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8">
            <span className="text-foreground">Building</span>
            <br />
            <span className="text-primary text-glow">Data Factories</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            I build indestructible tracking systems. I help businesses bypass adblockers,
            fix broken GA4 data, and implement Server-Side tagging so your marketing actually works.
          </p>

          {/* Capability pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {[
              { icon: Database, label: "SERVER-SIDE TRACKING" },
              { icon: Workflow, label: "GA4 ARCHITECTURE" },
              { icon: BarChart3, label: "CONVERSION API (CAPI)" },
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
          Explore Work
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;

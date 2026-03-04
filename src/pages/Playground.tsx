import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MousePointerClick, Eye, FileText, Mail, ArrowLeft } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";

const buttons = [
  { label: "Click Test", icon: MousePointerClick, to: "/sandbox-internal/click" },
  { label: "Pageview Test", icon: Eye, to: "/sandbox-internal/pageview" },
  { label: "Form Submit Page Test", icon: FileText, to: "/sandbox-internal/form" },
  { label: "Newsletter Popup Form Test", icon: Mail, to: "/sandbox-internal/newsletter" },
];

const Playground = () => (
  <main className="min-h-screen bg-background">
    <SiteNav />
    <div className="section-container pt-32 flex flex-col items-center justify-center min-h-[80vh]">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-display text-xs uppercase tracking-wider mb-12"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Site
      </Link>

      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
        Playground
      </h1>
      <p className="font-body text-sm text-muted-foreground mb-12 text-center">
        GTM & analytics sandbox tests
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        {buttons.map((btn, i) => (
          <motion.div
            key={btn.to}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <Link
              to={btn.to}
              className="flex items-center gap-3 px-6 py-5 border border-border rounded-sm bg-card/30 hover:border-primary/40 hover:bg-card/60 transition-all duration-300 group"
            >
              <btn.icon className="w-5 h-5 text-primary shrink-0" />
              <span className="font-display text-sm uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                {btn.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
    <Footer />
  </main>
);

export default Playground;

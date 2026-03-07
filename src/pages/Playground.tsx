import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MousePointerClick, Eye, FileText, Mail, ArrowLeft } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const buttons = [
  { label: "Click Test", icon: MousePointerClick, to: "/sandbox-internal/click" },
  { label: "Pageview Test", icon: Eye, to: "/sandbox-internal/pageview" },
  { label: "Form Submit Page Test", icon: FileText, to: "/sandbox-internal/form" },
  { label: "Newsletter Popup Form Test", icon: Mail, action: "newsletter" },
];

const Playground = () => {
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [nlStatus, setNlStatus] = useState<"idle" | "loading">("idle");
  const navigate = useNavigate();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNlStatus("loading");
    setTimeout(() => {
      setNlStatus("idle");
      setNewsletterOpen(false);
      navigate("/sandbox-internal/newsletter");
    }, 1000);
  };

  return (
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
              key={btn.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              {btn.action === "newsletter" ? (
                <button
                  onClick={() => setNewsletterOpen(true)}
                  className="flex items-center gap-3 px-6 py-5 border border-border rounded-sm bg-card/30 hover:border-primary/40 hover:bg-card/60 transition-all duration-300 group w-full text-left"
                >
                  <btn.icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-display text-sm uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                    {btn.label}
                  </span>
                </button>
              ) : (
                <Link
                  to={btn.to!}
                  className="flex items-center gap-3 px-6 py-5 border border-border rounded-sm bg-card/30 hover:border-primary/40 hover:bg-card/60 transition-all duration-300 group"
                >
                  <btn.icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-display text-sm uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                    {btn.label}
                  </span>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter Popup Modal */}
      <Dialog open={newsletterOpen} onOpenChange={setNewsletterOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-foreground">Newsletter Signup Test</DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              GTM sandbox — test form submission tracking.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewsletterSubmit} className="space-y-4 mt-2">
            <Input name="name" placeholder="Name" required className="bg-background border-border font-body" />
            <Input name="email" type="email" placeholder="Email" required className="bg-background border-border font-body" />
            <Input name="country" placeholder="Country" required className="bg-background border-border font-body" />
            <Button
              type="submit"
              disabled={nlStatus === "loading"}
              className="w-full font-display text-xs uppercase tracking-wider"
            >
              {nlStatus === "loading" ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
};

export default Playground;

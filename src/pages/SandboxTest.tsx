import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const titles: Record<string, string> = {
  click: "Click test successful",
  pageview: "Pageview test successful",
  form: "Form submit successful",
  newsletter: "Newsletter submit successful",
};

const SandboxTest = () => {
  const { type } = useParams<{ type: string }>();
  const title = titles[type ?? ""] ?? "Test Page";
  const navigate = useNavigate();
  const isForm = type === "form";
  const [showOverlay, setShowOverlay] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOverlay(true);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground text-center">
          {title}
        </h1>

        {isForm && (
          <form onSubmit={handleFormSubmit} className="mt-8 w-full max-w-sm space-y-3">
            <input
              name="testformsubmit"
              placeholder="Type anything..."
              required
              className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors"
            >
              Submit Form
            </button>
          </form>
        )}

        <Link
          to="/playground"
          className="mt-8 inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-display text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Playground
        </Link>

        {/* Success overlay for form page */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card border border-primary/30 rounded-sm px-10 py-8 text-center border-glow"
              >
                <div className="text-primary text-3xl mb-3">✓</div>
                <p className="font-display text-sm text-foreground uppercase tracking-wider mb-1">
                  Sent successfully!
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  Redirecting to the main page...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
};

export default SandboxTest;

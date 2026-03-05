import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoTransparent from "@/assets/logo-transparent.png";
import { useDevMode } from "@/contexts/DevModeContext";

const baseNavItems = [
  { label: "Work", href: "#work" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const SiteNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [devMode] = useDevMode();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleAnchor = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHome) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/" + href;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl" data-gtm="site-header">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2" data-gtm="logo">
          <img src={logoTransparent} alt="JosephTasDigital" className="h-12 w-auto" />
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {baseNavItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={handleAnchor(item.href)}
                className="font-display text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300"
                data-gtm={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </a>
            </li>
          ))}
          {devMode && (
            <li>
              <Link
                to="/playground"
                className="font-display text-sm uppercase tracking-widest text-primary/70 hover:text-primary transition-colors duration-300"
                data-gtm="nav-playground"
              >
                Playground
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          data-gtm="mobile-menu-toggle"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <ul className="px-6 py-4 space-y-4">
              {baseNavItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-display text-sm uppercase tracking-widest text-muted-foreground hover:text-primary block py-2"
                    onClick={(e) => {
                      handleAnchor(item.href)(e);
                      setIsOpen(false);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              {devMode && (
                <li>
                  <Link
                    to="/playground"
                    className="font-display text-sm uppercase tracking-widest text-primary/70 hover:text-primary block py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Playground
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SiteNav;

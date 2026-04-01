import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoTransparent from "@/assets/logo-transparent.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getLocaleFromPath, localePath } from "@/i18n";

const SiteNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);

  const navItems = [
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.work"), href: "#work" },
    { label: t("nav.blog"), href: "#blog" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  const homePath = localePath("/", locale);
  const isHome = location.pathname === "/" || location.pathname === `/${locale}` || location.pathname === `/${locale}/`;

  const handleAnchor = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (isHome) {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) {
          const headerOffset = 64;
          const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    } else {
      window.location.href = homePath + href;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl" data-gtm="site-header">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" aria-label="Main navigation">
        <Link to={homePath} className="flex items-center gap-2" data-gtm="logo">
          <img src={logoTransparent} alt="JosephTasDigital" className="h-16 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={handleAnchor(item.href)}
                  className="font-display text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300"
                  data-gtm={`nav-${item.href.replace("#", "")}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <button
            className="text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            data-gtm="mobile-menu-toggle"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
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
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-display text-sm uppercase tracking-widest text-muted-foreground hover:text-primary block py-2"
                    onClick={handleAnchor(item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SiteNav;

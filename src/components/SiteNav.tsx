import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoTransparent from "@/assets/logo-transparent.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuditModal from "@/components/AuditModal";
import { getLocaleFromPath, localePath } from "@/i18n";
import { getSiteSettings } from "@/lib/markdown";

const SiteNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const settings = getSiteSettings();

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
          const headerOffset = window.innerWidth >= 1024 ? 128 : window.innerWidth >= 768 ? 112 : 80;
          const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    } else {
      window.location.href = homePath + href;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md" data-gtm="site-header">
      <nav className="max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between" aria-label="Main navigation">
        <Link to={homePath} className="flex items-center gap-2" data-gtm="logo">
          <div className="h-8 md:h-10 w-auto flex-shrink-0">
            <img src="https://placehold.co/2200x850/png" alt="Logo Placeholder" className="h-full w-auto object-contain" />
          </div>
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
          <button
            type="button"
            onClick={() => setAuditOpen(true)}
            data-gtm="header-audit-cta"
            className="group relative inline-flex items-center gap-2 h-9 px-4 rounded-sm font-display text-xs uppercase tracking-widest text-primary-foreground bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_100%] transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-[0_0_24px_rgba(0,229,255,0.55)] overflow-hidden"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="relative z-10">{t("nav.auditCta")}</span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
          </button>
          <LanguageSwitcher />
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setAuditOpen(true)}
            data-gtm="header-audit-cta-mobile"
            className="inline-flex items-center gap-1 h-8 px-3 rounded-sm font-display text-[10px] uppercase tracking-widest text-primary-foreground bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_100%] transition-all duration-500 hover:bg-[position:100%_0]"
          >
            <Sparkles className="w-3 h-3" />
            {t("nav.auditCtaShort")}
          </button>
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

      <AuditModal open={auditOpen} onOpenChange={setAuditOpen} />

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

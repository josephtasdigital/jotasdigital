import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supportedLocales, getLocaleFromPath, stripLocalePrefix, localePath } from "@/i18n";

const LanguageSwitcher = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const current = getLocaleFromPath(location.pathname);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchTo = (code: string) => {
    i18n.changeLanguage(code);
    const stripped = stripLocalePrefix(location.pathname);
    navigate(localePath(stripped, code as any) + location.search + location.hash);
    setOpen(false);
  };

  const currentLocale = supportedLocales.find((l) => l.code === current);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 text-muted-foreground hover:text-primary transition-colors font-display text-xs uppercase tracking-widest"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLocale?.flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 border border-border bg-card/95 backdrop-blur-xl rounded-sm shadow-lg z-50 overflow-hidden">
          {supportedLocales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => switchTo(locale.code)}
              className={`w-full text-left px-3 py-2 text-sm font-body flex items-center gap-2 transition-colors ${
                locale.code === current
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <span>{locale.flag}</span>
              <span>{locale.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;

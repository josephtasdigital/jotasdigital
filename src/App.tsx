import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DevModeProvider } from "./contexts/DevModeContext";
import { getLocaleFromPath, supportedLocales } from "./i18n";
import Index from "./pages/Index";
import BlogPost from "./pages/BlogPost";
import PortfolioItem from "./pages/PortfolioItem";
import Playground from "./pages/Playground";
import SandboxTest from "./pages/SandboxTest";
import SandboxInternal from "./pages/SandboxInternal";
import JsSandbox from "./pages/JsSandbox";
import NotFound from "./pages/NotFound";
import CookieConsent from "./components/CookieConsent";

import "./i18n";

const queryClient = new QueryClient();

const LocaleSync = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    const locale = lang && supportedLocales.some((l) => l.code === lang) ? lang : "en";
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [lang, i18n]);

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Default English routes */}
    <Route path="/" element={<LocaleSync><Index /></LocaleSync>} />
    <Route path="/blog/:slug" element={<LocaleSync><BlogPost /></LocaleSync>} />
    <Route path="/portfolio/:slug" element={<LocaleSync><PortfolioItem /></LocaleSync>} />
    <Route path="/playground" element={<LocaleSync><Playground /></LocaleSync>} />
    <Route path="/sandbox-internal/:type" element={<LocaleSync><SandboxTest /></LocaleSync>} />
    <Route path="/sandbox-internal" element={<LocaleSync><SandboxInternal /></LocaleSync>} />
    <Route path="/js-sandbox" element={<LocaleSync><JsSandbox /></LocaleSync>} />

    {/* Localized routes */}
    <Route path="/:lang" element={<LocaleSync><Index /></LocaleSync>} />
    <Route path="/:lang/blog/:slug" element={<LocaleSync><BlogPost /></LocaleSync>} />
    <Route path="/:lang/portfolio/:slug" element={<LocaleSync><PortfolioItem /></LocaleSync>} />
    <Route path="/:lang/playground" element={<LocaleSync><Playground /></LocaleSync>} />
    <Route path="/:lang/js-sandbox" element={<LocaleSync><JsSandbox /></LocaleSync>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <DevModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
            <CookieConsent />
          </BrowserRouter>
        </TooltipProvider>
      </DevModeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

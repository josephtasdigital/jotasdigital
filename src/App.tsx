import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { DevModeProvider } from "./contexts/DevModeContext";
import Index from "./pages/Index";
import BlogPost from "./pages/BlogPost";
import PortfolioItem from "./pages/PortfolioItem";
import Playground from "./pages/Playground";
import SandboxTest from "./pages/SandboxTest";
import SandboxInternal from "./pages/SandboxInternal";
import JsSandbox from "./pages/JsSandbox";
import NotFound from "./pages/NotFound";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <DevModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/portfolio/:slug" element={<PortfolioItem />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/sandbox-internal/:type" element={<SandboxTest />} />
              <Route path="/sandbox-internal" element={<SandboxInternal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsent />
          </BrowserRouter>
        </TooltipProvider>
      </DevModeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

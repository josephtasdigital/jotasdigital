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
import NotFound from "./pages/NotFound";
import CookieConsent from "./components/CookieConsent";

// 1. IMPORT YOUR NEW SENSOR HOOK HERE
import { useStealthTracker } from "./hooks/useStealthTracker"; 

const queryClient = new QueryClient();

// 2. CREATE THE INVISIBLE SENSOR COMPONENT
const StealthSensor = () => {
  useStealthTracker();
  return null; // It renders nothing to the UI, just runs the logic
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <DevModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* 3. INJECT THE SENSOR INSIDE THE BROWSER ROUTER */}
            <StealthSensor />
            
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

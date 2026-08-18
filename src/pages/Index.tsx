import { Helmet } from "react-helmet-async";
import { Suspense, lazy } from "react";
import SiteNav from "@/components/SiteNav";
// three.js + r3f are heavy; load them after the page is interactive.
const Scene3DBackground = lazy(() => import("@/components/Scene3DBackground"));
import ScrollProgress from "@/components/ScrollProgress";
import CursorSpotlight from "@/components/CursorSpotlight";
import Reveal from "@/components/Reveal";
import HeroSection from "@/components/HeroSection";
import WhoAmISection from "@/components/WhoAmISection";
import WorkflowToolStack from "@/components/WorkflowToolStack";
import ServicesSection from "@/components/ServicesSection";
import PartnerOffers from "@/components/PartnerOffers";
import PortfolioSection from "@/components/PortfolioSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background/80" data-gtm="main-page">
      <Helmet>
        <title>Joseph Tas — Data Engineer & Analytics Specialist</title>
        <meta
          name="description"
          content="Data engineer building ETL pipelines and analytics infrastructure that turn raw data into actionable intelligence."
        />
        <link rel="canonical" href="https://jotasdigital.lovable.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Joseph Tas — Data Engineer & Analytics Specialist" />
        <meta
          property="og:description"
          content="Data engineer building ETL pipelines and analytics infrastructure that turn raw data into actionable intelligence."
        />
        <meta property="og:url" content="https://jotasdigital.lovable.app/" />
      </Helmet>
      <Suspense fallback={null}>
        <Scene3DBackground />
      </Suspense>
      <CursorSpotlight />
      <ScrollProgress />
      <SiteNav />
      <HeroSection />
      <Reveal><WhoAmISection /></Reveal>
      <Reveal><WorkflowToolStack /></Reveal>
      <Reveal><ServicesSection /></Reveal>
      <Reveal><PartnerOffers /></Reveal>
      <Reveal><PortfolioSection /></Reveal>
      <Reveal><BlogSection /></Reveal>
      <Reveal><ContactSection /></Reveal>
      <Footer />
    </main>
  );
};

export default Index;

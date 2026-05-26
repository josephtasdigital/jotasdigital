import { Helmet } from "react-helmet-async";
import SiteNav from "@/components/SiteNav";
import Scene3DBackground from "@/components/Scene3DBackground";
import HeroSection from "@/components/HeroSection";
import WhoAmISection from "@/components/WhoAmISection";
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
      <Scene3DBackground />
      <SiteNav />
      <HeroSection />
      <WhoAmISection />
      <ServicesSection />
      <PartnerOffers />
      <PortfolioSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;

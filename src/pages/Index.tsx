import SiteNav from "@/components/SiteNav";
import Scene3DBackground from "@/components/Scene3DBackground";
import HeroSection from "@/components/HeroSection";
import WhoAmISection from "@/components/WhoAmISection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background/80" data-gtm="main-page">
      <Scene3DBackground />
      <SiteNav />
      <HeroSection />
      <WhoAmISection />
      <ServicesSection />
      <PortfolioSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;

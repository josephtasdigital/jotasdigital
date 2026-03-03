import SiteNav from "@/components/SiteNav";
import HeroSection from "@/components/HeroSection";
import PortfolioSection from "@/components/PortfolioSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background" data-gtm="main-page">
      <SiteNav />
      <HeroSection />
      <PortfolioSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;

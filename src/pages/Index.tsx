import SiteNav from "@/components/SiteNav";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const sectionWrap = (zIndex: number, children: React.ReactNode) => (
  <div
    className="sticky top-0 bg-background will-change-transform"
    style={{ zIndex }}
  >
    {children}
  </div>
);

const Index = () => {
  return (
    <main className="min-h-screen bg-background" data-gtm="main-page">
      <SiteNav />
      {sectionWrap(10, <HeroSection />)}
      {sectionWrap(20, <ServicesSection />)}
      {sectionWrap(30, <PortfolioSection />)}
      {sectionWrap(40, <BlogSection />)}
      {sectionWrap(50, <ContactSection />)}
      <div style={{ zIndex: 60 }} className="relative">
        <Footer />
      </div>
    </main>
  );
};

export default Index;

import logoBlue from "@/assets/logo-blue.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8" data-gtm="site-footer">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logoBlue} alt="JosephTasDigital" className="h-8 w-auto" />
          <span className="font-display text-xs text-muted-foreground">© 2026 JosephTasDigital</span>
        </div>
        <p className="font-display text-xs text-muted-foreground/50">
          Built with precision. Measured with purpose.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

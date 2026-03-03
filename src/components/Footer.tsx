import { Terminal } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-8" data-gtm="site-footer">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Terminal className="w-4 h-4 text-primary" />
        <span className="font-display text-xs">© 2026 data.eng</span>
      </div>
      <p className="font-display text-xs text-muted-foreground/50">
        Built with precision. Measured with purpose.
      </p>
    </div>
  </footer>
);

export default Footer;

import logoBlue from "@/assets/logo-blue.png";
import { Switch } from "@/components/ui/switch";
import { useDevMode } from "@/hooks/use-dev-mode";

const Footer = () => {
  const [devMode, setDevMode] = useDevMode();

  return (
    <footer className="border-t border-border py-8" data-gtm="site-footer">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logoBlue} alt="JosephTasDigital" className="h-8 w-auto" />
          <span className="font-display text-xs text-muted-foreground">© 2026 JosephTasDigital</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="font-display text-[10px] uppercase tracking-wider text-muted-foreground/60">
              Dev Mode
            </span>
            <Switch checked={devMode} onCheckedChange={setDevMode} className="scale-75" />
          </label>
          <p className="font-display text-xs text-muted-foreground/50">
            Built with precision. Measured with purpose.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

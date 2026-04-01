import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";

interface SandboxCard {
  id: string;
  title: string;
  description: string;
  code: string;
}

const sandboxCards: SandboxCard[] = [
  {
    id: "countdown",
    title: "Countdown Timer",
    description: "A live countdown timer with millisecond precision.",
    code: `<html><body style="background:#0c0e13;color:#00e5ff;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
<div id="t" style="font-size:3rem"></div>
<script>
const end = Date.now() + 60000;
setInterval(() => {
  const d = Math.max(0, end - Date.now());
  const s = Math.floor(d/1000), ms = d%1000;
  document.getElementById('t').textContent = s + '.' + String(ms).padStart(3,'0');
}, 50);
</script></body></html>`,
  },
  {
    id: "particles",
    title: "Particle Field",
    description: "Canvas-based particle animation with mouse interaction.",
    code: `<html><body style="margin:0;overflow:hidden;background:#0c0e13">
<canvas id="c"></canvas>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
c.width=innerWidth;c.height=innerHeight;
const p=Array.from({length:80},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2}));
(function d(){x.fillStyle='rgba(12,14,19,0.15)';x.fillRect(0,0,c.width,c.height);
p.forEach(pt=>{pt.x+=pt.vx;pt.y+=pt.vy;
if(pt.x<0||pt.x>c.width)pt.vx*=-1;
if(pt.y<0||pt.y>c.height)pt.vy*=-1;
x.beginPath();x.arc(pt.x,pt.y,2,0,Math.PI*2);x.fillStyle='#00e5ff';x.fill()});
requestAnimationFrame(d)})();
</script></body></html>`,
  },
  {
    id: "matrix",
    title: "Matrix Rain",
    description: "Classic matrix-style falling characters effect.",
    code: `<html><body style="margin:0;overflow:hidden;background:#0c0e13">
<canvas id="c"></canvas>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
c.width=innerWidth;c.height=innerHeight;
const cols=Math.floor(c.width/14),drops=Array(cols).fill(1);
setInterval(()=>{x.fillStyle='rgba(12,14,19,0.05)';x.fillRect(0,0,c.width,c.height);
x.fillStyle='#00e5ff';x.font='14px monospace';
drops.forEach((y,i)=>{const t=String.fromCharCode(0x30A0+Math.random()*96);
x.fillText(t,i*14,y*14);drops[i]=y*14>c.height&&Math.random()>.975?0:y+1})},33);
</script></body></html>`,
  },
];

const SandboxCardComponent = ({ card }: { card: SandboxCard }) => {
  const [revealed, setRevealed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const handleHide = useCallback(() => {
    setRevealed(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative border border-border rounded-sm overflow-hidden aspect-video bg-card/30"
    >
      {/* Iframe always rendered when revealed */}
      {revealed && (
        <iframe
          ref={iframeRef}
          srcDoc={card.code}
          sandbox="allow-scripts"
          className="absolute inset-0 w-full h-full border-0"
          title={card.title}
        />
      )}

      {/* Blur overlay */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-card/80 backdrop-blur-xl z-10"
          >
            <h3 className="font-display text-lg font-semibold text-foreground">{card.title}</h3>
            <p className="font-body text-sm text-muted-foreground text-center px-6">{card.description}</p>
            <button
              onClick={handleReveal}
              className="flex items-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-display text-xs uppercase tracking-widest rounded-sm"
            >
              <Play className="w-4 h-4" />
              Reveal — {card.title}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close button when revealed */}
      {revealed && (
        <button
          onClick={handleHide}
          className="absolute top-3 right-3 z-20 p-1 bg-card/80 border border-border rounded-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

const JsSandbox = () => {
  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <div className="pt-24 pb-16">
        <div className="section-container">
          <span className="section-label">// Lab</span>
          <h2 className="section-title">JavaScript Sandbox</h2>
          <p className="font-body text-muted-foreground max-w-2xl mb-12">
            Live-execution experiments. Each card runs in an isolated iframe — click to reveal and activate.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sandboxCards.map((card) => (
              <SandboxCardComponent key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default JsSandbox;

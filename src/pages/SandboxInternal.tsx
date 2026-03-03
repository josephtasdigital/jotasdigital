import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FlaskConical, MousePointerClick, FormInput, Video, 
  Download, ShoppingCart, Search, UserPlus, LogIn, Share2 
} from "lucide-react";

const SandboxInternal = () => {
  const [ajaxResult, setAjaxResult] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const fireEvent = (eventName: string, params?: Record<string, string>) => {
    // Push to dataLayer for GTM
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: eventName, ...params });
    }
    setAjaxResult(`✓ Event fired: ${eventName} — ${JSON.stringify(params || {})}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fireEvent("sandbox_form_submit", formData);
  };

  const simulateAjax = async (endpoint: string) => {
    setAjaxResult(`⏳ Fetching ${endpoint}...`);
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com${endpoint}`);
      const data = await res.json();
      fireEvent("sandbox_ajax_success", { endpoint, status: "200" });
      setAjaxResult(`✓ AJAX ${endpoint} — ${JSON.stringify(data).slice(0, 200)}`);
    } catch {
      fireEvent("sandbox_ajax_error", { endpoint });
      setAjaxResult(`✗ AJAX ${endpoint} — Failed`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12" data-gtm="sandbox-page">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <FlaskConical className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground">Black Box Playground</h1>
        </div>
        <p className="font-display text-sm text-muted-foreground mb-10 border-b border-border pb-6">
          Internal testing laboratory for GA4 / GTM data stream validation. Not indexed.
        </p>

        {/* Event Buttons */}
        <section className="mb-12" data-gtm="sandbox-events">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">// Event Triggers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Button Click", icon: MousePointerClick, event: "sandbox_button_click" },
              { label: "Add to Cart", icon: ShoppingCart, event: "add_to_cart", params: { item: "test_product", value: "49.99" } },
              { label: "Sign Up", icon: UserPlus, event: "sign_up", params: { method: "email" } },
              { label: "Login", icon: LogIn, event: "login", params: { method: "google" } },
              { label: "Search", icon: Search, event: "search", params: { search_term: "data pipeline" } },
              { label: "Share", icon: Share2, event: "share", params: { method: "twitter", content_type: "article" } },
              { label: "Download", icon: Download, event: "file_download", params: { file_name: "report.pdf" } },
              { label: "Page View", icon: FormInput, event: "page_view", params: { page_title: "sandbox" } },
            ].map(({ label, icon: Icon, event, params }) => (
              <Button
                key={event}
                variant="outline"
                className="justify-start gap-2 h-auto py-3 font-display text-xs uppercase tracking-wider border-border hover:border-primary hover:text-primary"
                onClick={() => fireEvent(event, params)}
                data-gtm={`sandbox-btn-${event}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </section>

        {/* AJAX Form */}
        <section className="mb-12" data-gtm="sandbox-form">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">// Form + AJAX Testing</h2>
          <form onSubmit={handleFormSubmit} className="space-y-3 p-6 border border-border rounded-sm bg-card">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background border-border font-body"
              data-gtm="sandbox-input-name"
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-background border-border font-body"
              data-gtm="sandbox-input-email"
            />
            <Textarea
              placeholder="Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-background border-border font-body resize-none"
              rows={3}
              data-gtm="sandbox-input-message"
            />
            <div className="flex gap-3">
              <Button type="submit" className="font-display text-xs uppercase tracking-wider" data-gtm="sandbox-form-submit">
                Submit Form
              </Button>
              <Button type="button" variant="outline" className="font-display text-xs uppercase tracking-wider border-border" onClick={() => simulateAjax("/posts/1")} data-gtm="sandbox-ajax-get">
                AJAX GET
              </Button>
              <Button type="button" variant="outline" className="font-display text-xs uppercase tracking-wider border-border" onClick={() => simulateAjax("/posts")} data-gtm="sandbox-ajax-list">
                AJAX LIST
              </Button>
            </div>
          </form>
        </section>

        {/* Console output */}
        {ajaxResult && (
          <section className="mb-12" data-gtm="sandbox-console">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">// Console Output</h2>
            <pre className="p-4 bg-card border border-border rounded-sm font-display text-xs text-terminal overflow-x-auto whitespace-pre-wrap">
              {ajaxResult}
            </pre>
          </section>
        )}

        {/* Video Embeds */}
        <section className="mb-12" data-gtm="sandbox-video">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">// Video Embed Testing</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="aspect-video bg-card border border-border rounded-sm overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Test Video 1"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-gtm="sandbox-video-1"
              />
            </div>
            <div className="aspect-video bg-card border border-border rounded-sm flex items-center justify-center">
              <div className="text-center p-4">
                <Video className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="font-display text-xs text-muted-foreground">
                  Add Vimeo/Wistia embed URL here
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-border pt-6">
          <p className="font-display text-xs text-muted-foreground/40">
            🔒 This page is not linked in site navigation. For internal testing only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SandboxInternal;

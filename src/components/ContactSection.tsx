import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);
    
    try {
      const res = await fetch("https://formspree.io/f/xnjgavkv", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        
        // 1. Extract the visitor's submitted data
        const submittedEmail = data.get("email");
        const submittedName = data.get("name");

        // 2. The GTM Sensor: Push the first-party data to the DataLayer
        const w = window as any; // Prevents TypeScript errors in Vite
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({
          'event': 'form_submit_success',
          'user_data': {
            'email_address': submittedEmail,
            'address': {
              'first_name': submittedName
            }
          }
        });

        // 3. Clear the form and reset the button state
        form.reset();
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      // This catches total network failures
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section id="contact" className="border-t border-border" data-gtm="contact-section">
      <div className="section-container">
        <span className="section-label">// Contact</span>
        <h2 className="section-title">Get In Touch</h2>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Looking for a data engineer to architect your analytics infrastructure? 
              Let's discuss your pipeline needs.
            </p>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "josephtasdigital@outlook.com", href: "mailto:josephtasdigital@outlook.com" },
                { icon: Github, label: "github.com/josephtasdigital/", href: "https://www.github.com/josephtasdigital/" },
                { icon: Linkedin, label: "linkedin.com/in/joseph-tas-d152/", href: "https://www.linkedin.com/in/joseph-tas-d152/" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                  data-gtm={`contact-${label.split(".")[0]}`}
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="font-display text-sm">{label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
            data-gtm="contact-form"
          >
            <Input
              name="name"
              placeholder="Name"
              className="bg-card border-border font-body focus:border-primary"
              required
              disabled={status === "loading"}
              data-gtm="contact-name"
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              className="bg-card border-border font-body focus:border-primary"
              required
              disabled={status === "loading"}
              data-gtm="contact-email"
            />
            <Textarea
              name="message"
              placeholder="Tell me about your data challenge..."
              rows={5}
              className="bg-card border-border font-body focus:border-primary resize-none"
              required
              disabled={status === "loading"}
              data-gtm="contact-message"
            />
            {status === "success" ? (
              <div className="w-full py-3 px-4 rounded-md bg-primary/10 border border-primary/30 text-center">
                <span className="font-display text-sm text-primary tracking-wider uppercase">
                  ✓ Message Sent Successfully!
                </span>
              </div>
            ) : (
              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display uppercase tracking-wider text-sm"
                data-gtm="contact-submit"
              >
                {status === "loading" ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : status === "error" ? (
                  "Failed — Try Again"
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

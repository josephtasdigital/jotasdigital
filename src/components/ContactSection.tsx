import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
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
                { icon: Mail, label: "hello@dataeng.dev", href: "mailto:hello@dataeng.dev" },
                { icon: Github, label: "github.com/dataeng", href: "#" },
                { icon: Linkedin, label: "linkedin.com/in/dataeng", href: "#" },
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
              placeholder="Name"
              className="bg-card border-border font-body focus:border-primary"
              required
              data-gtm="contact-name"
            />
            <Input
              type="email"
              placeholder="Email"
              className="bg-card border-border font-body focus:border-primary"
              required
              data-gtm="contact-email"
            />
            <Textarea
              placeholder="Tell me about your data challenge..."
              rows={5}
              className="bg-card border-border font-body focus:border-primary resize-none"
              required
              data-gtm="contact-message"
            />
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display uppercase tracking-wider text-sm"
              data-gtm="contact-submit"
            >
              {sent ? "Message Sent ✓" : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

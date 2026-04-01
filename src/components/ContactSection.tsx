import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.min.css";

const glassDarkTheme = {
  themeName: "glass-dark",
  colorPalette: "dark" as const,
  cssVariables: {
    "--sjs-general-backcolor": "transparent",
    "--sjs-general-backcolor-dim": "rgba(12, 14, 19, 0.5)",
    "--sjs-general-backcolor-dim-light": "rgba(12, 14, 19, 0.3)",
    "--sjs-primary-backcolor": "#ffffff",
    "--sjs-primary-forecolor": "#0c0e13",
    "--sjs-primary-backcolor-light": "rgba(255, 255, 255, 0.1)",
    "--sjs-base-unit": "6px",
    "--sjs-corner-radius": "4px",
    "--sjs-font-editorfont-color": "rgba(255, 255, 255, 0.9)",
    "--sjs-font-questiontitle-color": "rgba(255, 255, 255, 0.7)",
    "--sjs-border-default": "rgba(255, 255, 255, 0.1)",
    "--sjs-border-inside": "rgba(255, 255, 255, 0.1)",
  },
};

const surveyJson = {
  elements: [
    { name: "name", type: "text", title: "Name", isRequired: true },
    { name: "email", type: "text", inputType: "email", title: "Email", isRequired: true },
    { name: "message", type: "comment", title: "Tell me about your data challenge...", isRequired: true },
  ],
  completeText: "Send Message",
  showQuestionNumbers: "off",
  completedHtml: `
    <div style="text-align: center; padding: 2rem 0;">
      <h3 style="color: white; font-size: 1.5rem; font-weight: 500; margin-bottom: 1.5rem; font-family: inherit;">I'll reach you very soon</h3>
      <div style="display: inline-flex; align-items: center; gap: 0.5rem; border: 1px solid hsl(var(--border)); padding: 0.75rem 1rem; border-radius: 6px; color: hsl(var(--muted-foreground)); font-size: 0.875rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: hsl(var(--primary));"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        Check your spam folder if you haven't received a confirmation
      </div>
    </div>
  `,
};

const ContactSection = () => {
  const survey = new Model(surveyJson);
  survey.applyTheme(glassDarkTheme);

  survey.onComplete.add((sender) => {
    const submittedData = sender.data;

    // @ts-ignore - Bypassing strict TS checks for our custom global tracker
    if (window.BreadTracker) {
      // @ts-ignore
      window.BreadTracker.send("generate_lead", {
        user_data: {
          email_address: submittedData.email,
          address: {
            first_name: submittedData.name,
          },
        },
      });
    }

    // Send to Formspree
    fetch("https://formspree.io/f/xnjgavkv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submittedData),
    }).catch(() => {});
  });

  return (
    <section id="contact" className="border-t border-border" data-gtm="contact-section">
      <div className="section-container">
        <span className="section-label">// Contact</span>
        <h2 className="section-title">Get In Touch</h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Most companies are losing 30% of their analytics to adblockers.
              I build first-party, server-side tracking pipelines that capture every click and bypass the noise.
              Let's fix your broken data.
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
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="font-display text-sm">{label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            <style>{`
  .sd-root-modern, .sd-body, .sd-page, .sd-question {
    background: transparent !important;
    font-family: inherit !important;
    padding: 0 !important;
  }
  .sd-question__title {
    font-family: inherit !important;
    color: hsl(var(--foreground)) !important;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
    padding-bottom: 0.5rem !important;
  }
  .sd-input {
    background: transparent !important;
    border: 1px solid hsl(var(--border)) !important;
    border-radius: 2px !important;
    color: hsl(var(--foreground)) !important;
    font-family: inherit !important;
    padding: 0.75rem !important;
    transition: border-color 0.2s ease !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  .sd-input:hover, .sd-input:focus {
    border-color: hsl(var(--primary)) !important;
    outline: none !important;
    box-shadow: none !important;
  }
  .sd-question__required-text {
    display: none !important;
    color: #ef4444 !important;
    margin-left: 4px !important;
  }
  .sd-question:focus-within .sd-question__required-text {
    display: inline !important;
  }
  .sd-container-modern {
    padding: 0 !important;
  }
            `}</style>
            <div className="border border-border rounded-lg p-6 w-full h-full bg-transparent">
              <Survey model={survey} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

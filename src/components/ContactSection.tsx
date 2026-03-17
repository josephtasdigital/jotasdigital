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
  });

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
            className="survey-container bg-card border border-border backdrop-blur-md rounded-lg p-2"
          >
            <Survey model={survey} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { useTranslation } from "react-i18next";
import "survey-core/survey-core.min.css";
import { getSiteSettings } from "@/lib/markdown";
import placeholderPortrait from "@/assets/placeholder-portrait.png";

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

const ContactSection = () => {
  const { t } = useTranslation();
  const settings = getSiteSettings();
  const contactPhoto = settings.contact_photo || placeholderPortrait;

  const surveyJson = {
    elements: [
      { name: "name", type: "text", title: t("contact.formName"), isRequired: true },
      { name: "email", type: "text", inputType: "email", title: t("contact.formEmail"), isRequired: true },
      { name: "message", type: "comment", title: t("contact.formMessage"), isRequired: true },
    ],
    completeText: t("contact.formSubmit"),
    showQuestionNumbers: "off",
    completedHtml: `
      <div style="text-align: center; padding: 2rem 0;">
        <h3 style="color: white; font-size: 1.5rem; font-weight: 500; margin-bottom: 1.5rem; font-family: inherit;">${t("contact.successTitle")}</h3>
        <div style="display: inline-flex; align-items: center; gap: 0.5rem; border: 1px solid hsl(var(--border)); padding: 0.75rem 1rem; border-radius: 6px; color: hsl(var(--muted-foreground)); font-size: 0.875rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: hsl(var(--primary));"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          ${t("contact.successNote")}
        </div>
      </div>
    `,
  };

  const survey = new Model(surveyJson);
  survey.applyTheme(glassDarkTheme);

  survey.onComplete.add(async (sender) => {
    const payload = {
      name: sender.data.name,
      email: sender.data.email,
      message: sender.data.message,
    };

    console.log("Submitting payload:", payload);

    const token = import.meta.env.VITE_SURVEYJS_TOKEN || "d18ed65b-304a-4631-8a32-d8d11e57b18e";
    const formspreeUrl = import.meta.env.VITE_FORMSPREE_URL || "https://formspree.io/f/xnjgavkv";

    const surveyPromise = fetch(`https://api.surveyjs.io/private/Surveys/postResult/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const formspreePromise = fetch(formspreeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    const results = await Promise.allSettled([surveyPromise, formspreePromise]);

    if (results[0].status === "fulfilled" && results[0].value.ok) {
      console.log("SurveyJS submission successful");
    } else {
      console.error("SurveyJS submission failed:", results[0]);
    }

    if (results[1].status === "rejected" || (results[1].status === "fulfilled" && !results[1].value.ok)) {
      console.warn("Formspree submission failed (ignored):", results[1]);
    } else {
      console.log("Formspree submission successful");
    }

    // @ts-ignore
    if (window.BreadTracker) {
      // @ts-ignore
      window.BreadTracker.send("generate_lead", {
        user_data: {
          email_address: payload.email,
          address: { first_name: payload.name },
        },
      });
    }
  });

  return (
    <section id="contact" className="border-t border-border" data-gtm="contact-section">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-2">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-full overflow-hidden border border-primary/30 shadow-[0_0_20px_rgba(0,229,255,0.1)] shrink-0"
              >
                <img src={contactPhoto} alt="Joseph Tas" className="w-full h-full object-cover object-top" loading="lazy" width={512} height={640} />
              </motion.div>
              <div>
                <span className="section-label">{t("contact.label")}</span>
                <h2 className="section-title !mb-0">{t("contact.title")}</h2>
              </div>
            </div>

            <p
              className="font-body leading-relaxed mb-8"
              style={{ color: "#E2E8F0", textShadow: "0px 2px 4px rgba(0,0,0,0.6)" }}
            >
              {t("contact.description")}
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
    padding: 0.75rem 1rem !important;
    height: 3rem !important;
    transition: border-color 0.2s ease !important;
    width: 100% !important;
    box-sizing: border-box !important;
    font-size: 0.875rem !important;
  }
  .sd-input:hover, .sd-input:focus {
    border-color: hsl(var(--primary)) !important;
    outline: none !important;
    box-shadow: none !important;
  }
  .sd-comment-area .sd-input,
  textarea.sd-input {
    height: auto !important;
    min-height: 120px !important;
    resize: vertical !important;
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

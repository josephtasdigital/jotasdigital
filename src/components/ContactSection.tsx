import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getSiteSettings } from "@/lib/markdown";
import placeholderPortrait from "@/assets/logo-transparent.png";

const ContactSection = () => {
  const { t } = useTranslation();
  const settings = getSiteSettings();
  const contactPhoto = settings.contact_photo || placeholderPortrait;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    // Keep this securely fetched from the .env file!
    const formspreeUrl = import.meta.env.VITE_FORMSPREE_URL;

    try {
      const response = await fetch(formspreeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Execute the custom GTM lead event
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
      } else {
        console.error("Formspree submission failed.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="border-t border-border" data-gtm="contact-section">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column: Contact Info */}
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
                <img src={contactPhoto} alt="Joseph Tas" className="w-full h-full object-cover object-top" loading="lazy" />
              </motion.div>
              <div>
                <span className="section-label">{t("contact.label")}</span>
                <h2 className="section-title !mb-0">{t("contact.title")}</h2>
              </div>
            </div>

            <p className="font-body leading-relaxed mb-8" style={{ color: "#E2E8F0", textShadow: "0px 2px 4px rgba(0,0,0,0.6)" }}>
              {t("contact.description")}
            </p>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "josephtasdigital@outlook.com", href: "mailto:josephtasdigital@outlook.com" },
                { icon: Github, label: "github.com/josephtasdigital/", href: "https://www.github.com/josephtasdigital/" },
                { icon: Linkedin, label: "linkedin.com/in/joseph-tas-d152/", href: "https://www.linkedin.com/in/joseph-tas-d152/" },
              ].map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="font-display text-sm">{label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column: The Form UI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            <div className="border border-border rounded-lg p-6 w-full h-full bg-transparent">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                  <h3 className="text-xl font-medium text-white">{t("contact.successTitle")}</h3>
                  <p className="text-muted-foreground text-sm border border-border px-4 py-2 rounded-md">
                    {t("contact.successNote")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">{t("contact.formName")}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full bg-transparent border border-border rounded-sm px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">{t("contact.formEmail")}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full bg-transparent border border-border rounded-sm px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">{t("contact.formMessage")}</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="w-full bg-transparent border border-border rounded-sm px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors resize-y"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground font-medium py-3 px-4 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : t("contact.formSubmit")}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

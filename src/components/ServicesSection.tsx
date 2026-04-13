import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.min.css";
import { getServiceItems } from "@/lib/markdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GroupedTier {
  tier: string;
  label: string;
  description: string;
  items: ReturnType<typeof getServiceItems>;
}

const tierOrder = ["major", "minor", "nano"];

const fallbackItems = [
  { slug: "_demo-1", frontmatter: { title: "Data Pipeline Architecture", tier: "major", tier_label: "Major Services", tier_description: "End-to-end solutions for complex data challenges", sort_order: 1, service_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80" }, content: "" },
  { slug: "_demo-2", frontmatter: { title: "Analytics Implementation", tier: "major", tier_label: "Major Services", tier_description: "End-to-end solutions for complex data challenges", sort_order: 2, service_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80" }, content: "" },
  { slug: "_demo-3", frontmatter: { title: "Dashboard Development", tier: "minor", tier_label: "Minor Services", tier_description: "Focused deliverables for specific needs", sort_order: 3, service_image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&q=80" }, content: "" },
];

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

const ServicesSection = () => {
  const { t } = useTranslation();
  const mdItems = getServiceItems();
  const items = mdItems.length > 0 ? mdItems : fallbackItems;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleCardClick = useCallback((title: string) => {
    setSelectedService(title);
    setModalOpen(true);
  }, []);

  const createSurveyModel = useCallback(() => {
    const surveyJson = {
      elements: [
        { name: "name", type: "text", title: t("services.formName"), isRequired: true },
        { name: "email", type: "text", inputType: "email", title: t("services.formEmail"), isRequired: true },
      ],
      completeText: t("services.formSubmit"),
      showQuestionNumbers: "off",
      completedHtml: `
        <div style="text-align: center; padding: 1.5rem 0;">
          <p style="color: rgba(255,255,255,0.9); font-size: 0.95rem; line-height: 1.6; font-family: inherit;">
            ${t("services.modalSuccess")}
          </p>
        </div>
      `,
    };

    const survey = new Model(surveyJson);
    survey.applyTheme(glassDarkTheme);

    survey.onComplete.add(async (sender) => {
      const payload = {
        name: sender.data.name,
        email: sender.data.email,
        service: selectedService,
      };

      console.log("Submitting service payload:", payload);

      const token = import.meta.env.VITE_SURVEYJS_TOKEN || "d18ed65b-304a-4631-8a32-d8d11e57b18e";
      const formspreeUrl = import.meta.env.VITE_FORMSPREE_URL || "https://formspree.io/f/YOUR_FORM_ID";

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
        console.log("SurveyJS service submission successful");
      } else {
        console.error("SurveyJS service submission failed:", results[0]);
      }

      if (results[1].status === "rejected" || (results[1].status === "fulfilled" && !results[1].value.ok)) {
        console.warn("Formspree service submission failed (ignored):", results[1]);
      } else {
        console.log("Formspree service submission successful");
      }

      // @ts-ignore
      if (window.BreadTracker) {
        // @ts-ignore
        window.BreadTracker.send("generate_lead", {
          user_data: {
            email_address: payload.email,
            address: { first_name: payload.name },
          },
          service_interest: selectedService,
        });
      }

      setTimeout(() => setModalOpen(false), 3000);
    });

    return survey;
  }, [t, selectedService]);

  // Group by tier
  const grouped = new Map<string, GroupedTier>();
  for (const item of items) {
    const tier = item.frontmatter.tier ?? "nano";
    if (!grouped.has(tier)) {
      grouped.set(tier, {
        tier,
        label: item.frontmatter.tier_label ?? tier,
        description: item.frontmatter.tier_description ?? "",
        items: [],
      });
    }
    grouped.get(tier)!.items.push(item);
  }

  const tiers = tierOrder.filter((t) => grouped.has(t)).map((t) => grouped.get(t)!);

  return (
    <>
      <section id="services" className="border-t border-border" data-gtm="services-section">
        <div className="section-container">
          <span className="section-label">{t("services.label")}</span>
          <h2 className="section-title">{t("services.heading")}</h2>

          <div className="space-y-12">
            {tiers.map((tier, ti) => (
              <div key={tier.tier}>
                <div className="mb-4">
                  <h3 className="font-display text-sm uppercase tracking-widest text-primary mb-1">
                    {tier.label}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground">{tier.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tier.items.map((item, si) => (
                    <motion.div
                      key={item.slug}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: ti * 0.1 + si * 0.06, duration: 0.45 }}
                      className="border border-transparent rounded-sm overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-card/50 bg-card/30 cursor-pointer"
                      data-gtm={`service-${tier.tier}-${si}`}
                      onClick={() => handleCardClick(item.frontmatter.title)}
                    >
                      {item.frontmatter.service_image && (
                        <img
                          src={item.frontmatter.service_image}
                          alt={item.frontmatter.title}
                          className="w-full h-40 object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="p-5">
                        <h4 className="font-display text-sm font-semibold text-foreground leading-snug">
                          {item.frontmatter.title}
                        </h4>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-border max-w-md">
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
            .sd-question__required-text { display: none !important; }
            .sd-question:focus-within .sd-question__required-text { display: inline !important; }
            .sd-container-modern { padding: 0 !important; }
          `}</style>
          <DialogHeader>
            <DialogTitle className="font-display text-foreground text-lg">
              {t("services.modalTitle", { service: selectedService })}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {t("services.modalDescription")}
            </DialogDescription>
          </DialogHeader>
          {modalOpen && <Survey model={createSurveyModel()} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServicesSection;

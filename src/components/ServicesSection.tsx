import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { getServiceItems } from "@/lib/markdown";
import AnimatedAsset from "@/components/AnimatedAsset";
import { useTrackedFormSubmission } from "@/hooks/use-tracked-form";
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

const defaultServiceOverlayText = "Learn more";

const fallbackItems = [
  { slug: "_demo-1", frontmatter: { title: "Data Pipeline Architecture", tier: "major", tier_label: "Major Services", tier_description: "End-to-end solutions for complex data challenges", sort_order: 1, service_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80" }, content: "" },
  { slug: "_demo-2", frontmatter: { title: "Analytics Implementation", tier: "major", tier_label: "Major Services", tier_description: "End-to-end solutions for complex data challenges", sort_order: 2, service_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80" }, content: "" },
  { slug: "_demo-3", frontmatter: { title: "Dashboard Development", tier: "minor", tier_label: "Minor Services", tier_description: "Focused deliverables for specific needs", sort_order: 3, service_image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&q=80" }, content: "" },
];

const ServicesSection = () => {
  const { t } = useTranslation();
  const mdItems = getServiceItems();
  const items = mdItems.length > 0 ? mdItems : fallbackItems;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const formConfig = useMemo(
    () => ({
      form_name: "service_inquiry",
      form_id: `service-modal-${selectedService || "none"}`,
      form_type: "service" as const,
      form_location: "services_modal",
      lead_type: "service-inquiry",
      service_name: selectedService,
      popup_name: "services_modal",
    }),
    [selectedService],
  );

  const { submitForm, isSubmitting, isSuccess: isSubmitted, reset } =
    useTrackedFormSubmission(formConfig);

  const handleCardClick = useCallback(
    (title: string, image?: string) => {
      setSelectedService(title);
      setSelectedImage(image || "");
      setName("");
      setEmail("");
      reset();
      setModalOpen(true);
    },
    [reset],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !email.trim()) return;
      const result = await submitForm({
        payload: {
          name: name.trim(),
          email: email.trim(),
          service: selectedService,
          _subject: `Service inquiry — ${selectedService}`,
        },
        user: { email: email.trim(), first_name: name.trim() },
        formData: { selected_service: selectedService },
      });
      if (result.ok) {
        setTimeout(() => setModalOpen(false), 3000);
      }
    },
    [name, email, selectedService, submitForm],
  );

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tier.items.map((item, si) => {
                    const overlayText =
                      (item.frontmatter.hover_text as string | undefined)?.trim() ||
                      defaultServiceOverlayText;
                    return (
                      <motion.div
                        key={item.slug}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ delay: ti * 0.1 + si * 0.06, duration: 0.45 }}
                        className="group relative border border-transparent rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-card/50 bg-card/30 cursor-pointer"
                        data-gtm={`service-${tier.tier}-${si}`}
                        onClick={() => handleCardClick(item.frontmatter.title, item.frontmatter.service_image)}
                      >
                        {item.frontmatter.service_image && (
                          <div className="relative overflow-hidden rounded-2xl">
                            <img
                              src={item.frontmatter.service_image}
                              alt={item.frontmatter.title}
                              className="w-full h-52 sm:h-56 object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:blur-md group-hover:brightness-[0.55]"
                              style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                              loading="lazy"
                              decoding="async"
                            />
                            {item.frontmatter.animated_asset && (
                              <AnimatedAsset
                                src={item.frontmatter.animated_asset as string}
                                alt=""
                                width={56}
                                height={56}
                                aria-hidden="true"
                                containerClassName="absolute top-3 right-3 pointer-events-none drop-shadow-[0_0_12px_rgba(0,229,255,0.35)] transition-transform duration-500 group-hover:scale-110"
                              />
                            )}

                            <div
                              aria-hidden="true"
                              className="absolute inset-0 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            >
                              <span
                                className="font-display text-center text-base sm:text-lg text-white"
                                style={{
                                  textShadow:
                                    "0 2px 12px rgba(0,0,0,0.85), 0 0 18px rgba(0, 229, 255, 0.35)",
                                }}
                              >
                                {overlayText}
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card/80 backdrop-blur-xl border-border max-w-md overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
            style={{ zIndex: 0 }}
          >
            {selectedImage ? (
              <div
                className="absolute inset-0 bg-center bg-cover service-modal-bg"
                style={{
                  backgroundImage: `url(${selectedImage})`,
                  filter: "blur(14px)",
                  opacity: 0.35,
                  transform: "scale(1.15)",
                }}
              />
            ) : (
              <div
                className="absolute inset-0 service-modal-bg"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.25), transparent 60%), radial-gradient(circle at 70% 70%, hsl(var(--primary) / 0.18), transparent 65%)",
                  filter: "blur(14px)",
                  opacity: 0.5,
                  transform: "scale(1.15)",
                }}
              />
            )}
            <div className="absolute inset-0 bg-card/40" />
          </div>

          <style>{`
            @keyframes serviceModalPan {
              0%   { transform: scale(1.15) translate3d(0, 0, 0); }
              50%  { transform: scale(1.22) translate3d(-2%, 1%, 0); }
              100% { transform: scale(1.15) translate3d(0, 0, 0); }
            }
            .service-modal-bg {
              animation: serviceModalPan 18s ease-in-out infinite;
            }
          `}</style>
          <div className="relative" style={{ zIndex: 1 }}>
            <DialogHeader>
              <DialogTitle className="font-display text-foreground text-lg">
                {t("services.modalTitle", { service: selectedService })}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {t("services.modalDescription")}
              </DialogDescription>
            </DialogHeader>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center py-8 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-primary" />
                <p className="text-foreground text-sm leading-relaxed">
                  {t("services.modalSuccess")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label htmlFor="service-name" className="block text-sm font-medium text-foreground mb-1">
                    {t("services.formName")}
                  </label>
                  <input
                    id="service-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border border-border rounded-sm px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="service-email" className="block text-sm font-medium text-foreground mb-1">
                    {t("services.formEmail")}
                  </label>
                  <input
                    id="service-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border border-border rounded-sm px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-medium py-3 px-4 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : t("services.formSubmit")}
                </button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServicesSection;

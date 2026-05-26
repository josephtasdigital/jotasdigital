import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Linkedin, Loader2 } from "lucide-react";
import { getPartnerOffers } from "@/lib/markdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * PartnerOffers
 * -------------
 * CMS-driven offers grid mirroring the Services data-fetching pattern
 * (Sveltia CMS → markdown frontmatter via getPartnerOffers()).
 * Clicking a card opens a Formspree-backed modal (AJAX, no redirect).
 *
 * Architecture constraint: does NOT touch GTM, cookie consent, or the
 * Services Grid layout/logic.
 */

export interface PartnerOffer {
  slug?: string;
  title: string;
  description: string;
  image?: string;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80";

const LINKEDIN_URL = "https://www.linkedin.com/in/joseph-tas-d152/";

const fallbackOffers: PartnerOffer[] = [
  {
    slug: "_demo-1",
    title: "Partner Offer One",
    description: "Placeholder description — populate via Sveltia CMS.",
    image: PLACEHOLDER_IMAGE,
  },
  {
    slug: "_demo-2",
    title: "Partner Offer Two",
    description: "Placeholder description — populate via Sveltia CMS.",
    image: PLACEHOLDER_IMAGE,
  },
  {
    slug: "_demo-3",
    title: "Partner Offer Three",
    description: "Placeholder description — populate via Sveltia CMS.",
    image: PLACEHOLDER_IMAGE,
  },
];

interface PartnerOffersProps {
  offers?: PartnerOffer[];
}

const PartnerOffers = ({ offers }: PartnerOffersProps) => {
  // Mirror Services pattern: CMS items via markdown loader, fall back to demo.
  const cmsItems = getPartnerOffers().map<PartnerOffer>((i) => ({
    slug: i.slug,
    title: (i.frontmatter.title as string) ?? "",
    description: (i.frontmatter.description as string) ?? "",
    image: (i.frontmatter.image as string) || PLACEHOLDER_IMAGE,
  }));

  const items: PartnerOffer[] =
    offers && offers.length > 0
      ? offers
      : cmsItems.length > 0
        ? cmsItems
        : fallbackOffers;

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<PartnerOffer | null>(null);
  const [form, setForm] = useState({ website: "", name: "", email: "", details: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setForm({ website: "", name: "", email: "", details: "" });
    setSubmitting(false);
    setSubmitted(false);
    setError(null);
  };

  const openModal = useCallback((offer: PartnerOffer) => {
    setSelected(offer);
    setModalOpen(true);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setModalOpen(next);
    if (!next) setTimeout(resetForm, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formspreeUrl =
      import.meta.env.VITE_FORMSPREE_URL || "https://formspree.io/f/xnjgavkv";

    try {
      const res = await fetch(formspreeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Partner offer interest — ${selected?.title ?? ""}`,
          source: "partner-offers",
          offer: selected?.title,
          ...form,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch (err) {
      console.error("Partner offer submission failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section
        id="partner-offers"
        className="border-t border-border"
        data-gtm="partner-offers-section"
      >
        <div className="section-container">
          <span className="section-label">// Partners</span>
          <h2 className="section-title">Partner Offers</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((offer, i) => (
              <motion.button
                key={offer.slug ?? i}
                type="button"
                onClick={() => openModal(offer)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="group relative text-left border border-transparent rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-card/50 bg-card/30 cursor-pointer"
                data-gtm={`partner-offer-${i}`}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={offer.image || PLACEHOLDER_IMAGE}
                    alt={offer.title}
                    className="w-full h-52 sm:h-56 object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-[0.6]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-base text-foreground mb-1">
                      {offer.title}
                    </h3>
                    <p className="font-body text-xs text-muted-foreground line-clamp-2">
                      {offer.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          data-gtm="partner-offer-modal"
          className="bg-card/80 backdrop-blur-xl border-border max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-foreground text-lg">
              {selected?.title ?? "Partner Offer"}
            </DialogTitle>
          </DialogHeader>

          {!submitted ? (
            <>
              <p className="font-body text-sm text-foreground/90 leading-relaxed">
                Is that right fit for your business? To find out, type your official
                website below, add any details you would want and I will reach back
                to you as fast as possible with my personalized advice.
              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-3 mt-2"
                data-gtm="partner-offer-form"
              >
                <input
                  type="url"
                  required
                  placeholder="Website URL"
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  className="w-full h-12 px-4 bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/70 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full h-12 px-4 bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/70 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="email"
                  required
                  placeholder="Email address (personal / professional)"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full h-12 px-4 bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/70 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="Details"
                  value={form.details}
                  onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
                  className="w-full px-4 py-3 bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/70 font-body text-sm focus:outline-none focus:border-primary transition-colors resize-y min-h-[120px]"
                />

                {error && <p className="text-sm text-destructive">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  data-gtm="partner-offer-submit"
                  className="w-full h-12 relative overflow-hidden rounded-sm font-display text-sm uppercase tracking-widest text-primary-foreground bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_100%] transition-all duration-300 hover:bg-[position:100%_0] hover:shadow-[0_0_28px_rgba(0,229,255,0.55)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          ) : (
            <div className="mt-2 space-y-6">
              <div className="flex items-center gap-3">
                <p className="font-body text-base text-foreground/90">
                  Done, have we connected yet?
                </p>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect on LinkedIn"
                  data-gtm="partner-offer-linkedin"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-sm text-primary-foreground bg-gradient-to-r from-[#0a66c2] to-[#0e80ee] hover:shadow-[0_0_22px_rgba(14,128,238,0.55)] transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>

              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                data-gtm="partner-offer-close"
                className="w-full h-12 font-display text-sm uppercase tracking-widest border-primary/40 hover:bg-primary/10 hover:border-primary"
              >
                Return to Main Page
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PartnerOffers;

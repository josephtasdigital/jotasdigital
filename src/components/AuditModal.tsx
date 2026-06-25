import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Linkedin, Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTrackedFormSubmission } from "@/hooks/use-tracked-form";

interface AuditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LINKEDIN_URL = "https://www.linkedin.com/in/joseph-tas-d152/";

const AuditModal = ({ open, onOpenChange }: AuditModalProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", website: "", details: "" });

  const { submitForm, isSubmitting: submitting, isSuccess: submitted, error, reset } =
    useTrackedFormSubmission({
      form_name: "audit_request",
      form_id: "audit-modal-form",
      form_type: "audit",
      form_location: "audit_modal",
      lead_type: "free-audit",
      popup_name: "audit_modal",
    });

  const resetAll = () => {
    setForm({ name: "", email: "", website: "", details: "" });
    reset();
  };

  const handleClose = (next: boolean) => {
    if (!next) setTimeout(resetAll, 250);
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm({
      payload: {
        _subject: "Free audit request",
        source: "audit-modal",
        name: form.name,
        email: form.email,
        website: form.website,
        details: form.details,
      },
      user: { email: form.email, first_name: form.name },
      formData: { message: form.details, company: form.website },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        id="audit-modal"
        data-gtm="audit-modal"
        className="bg-card/95 backdrop-blur-xl border-border max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground text-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            {submitted ? t("audit.successHeading") : t("audit.title")}
          </DialogTitle>
          {!submitted && (
            <DialogDescription className="text-muted-foreground text-sm">
              {t("audit.description")}
            </DialogDescription>
          )}
        </DialogHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3 mt-2" data-gtm="audit-form">
            <input
              type="text"
              required
              placeholder={t("audit.fieldName")}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full h-12 px-4 bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/70 font-body text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="email"
              required
              placeholder={t("audit.fieldEmail")}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full h-12 px-4 bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/70 font-body text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="url"
              required
              placeholder={t("audit.fieldWebsite")}
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              className="w-full h-12 px-4 bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/70 font-body text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <textarea
              required
              placeholder={t("audit.fieldDetails")}
              rows={4}
              value={form.details}
              onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
              className="w-full px-4 py-3 bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/70 font-body text-sm focus:outline-none focus:border-primary transition-colors resize-y min-h-[120px]"
            />

            {error && <p className="text-sm text-destructive">{t("audit.errorMessage")}</p>}

            <button
              type="submit"
              disabled={submitting}
              data-gtm="audit-submit"
              className="w-full h-12 relative overflow-hidden rounded-sm font-display text-sm uppercase tracking-widest text-primary-foreground bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_100%] transition-all duration-300 hover:bg-[position:100%_0] hover:shadow-[0_0_28px_rgba(0,229,255,0.55)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? t("audit.submitting") : t("audit.submit")}
            </button>
          </form>
        ) : (
          <div className="mt-2 space-y-6">
            <p className="font-body text-sm leading-relaxed text-foreground/90">
              {t("audit.successMessage")}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-sm border border-primary/30 bg-primary/5">
              <p className="font-body text-sm text-foreground/90 flex-1 text-center sm:text-left">
                {t("audit.linkedinPrompt")}
              </p>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-gtm="audit-linkedin"
                className="inline-flex items-center gap-2 px-5 h-11 rounded-sm font-display text-sm uppercase tracking-widest text-primary-foreground bg-gradient-to-r from-[#0a66c2] to-[#0e80ee] hover:shadow-[0_0_22px_rgba(14,128,238,0.55)] transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
                {t("audit.linkedinButton")}
              </a>
            </div>

            <Button
              variant="outline"
              onClick={() => handleClose(false)}
              data-gtm="audit-close"
              className="w-full h-14 font-display text-sm uppercase tracking-widest border-primary/40 hover:bg-primary/10 hover:border-primary"
            >
              {t("audit.backHome")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuditModal;

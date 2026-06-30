import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Cookie } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  type ConsentState,
  DEFAULT_CONSENT,
  ALL_GRANTED,
  getConsentState,
  setConsentState,
  hasConsentCookie,
  applyCategory,
  isCategoryGranted,
  pushConsentUpdate,
} from "@/lib/cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({ ...DEFAULT_CONSENT });

  // Centralized commit: persist + push to Google Consent Mode (single source of truth).
  const commit = (next: ConsentState) => {
    setConsentState(next);
    pushConsentUpdate(next);
  };

  useEffect(() => {
    if (!hasConsentCookie()) {
      // No saved choice — default consent (denied) was already set in index.html.
      // Show banner; do not push any update until the user decides.
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
    // Returning visitor: re-hydrate UI + replay saved choice as an update.
    const saved = getConsentState();
    setConsent(saved);
    pushConsentUpdate(saved);
  }, []);

  const handleAcceptAll = () => {
    commit(ALL_GRANTED);
    setConsent(ALL_GRANTED);
    setVisible(false);
    setShowCustomize(false);
  };

  const handleDenyAll = () => {
    commit({ ...DEFAULT_CONSENT });
    setConsent({ ...DEFAULT_CONSENT });
    setVisible(false);
    setShowCustomize(false);
  };

  const handleSaveCustom = () => {
    commit(consent);
    setVisible(false);
    setShowCustomize(false);
  };

  // Each UI toggle delegates to applyCategory, which flips only the Google
  // signals declared in CATEGORY_MAP for that category. No cross-talk.
  const toggleAnalytics = (checked: boolean) =>
    setConsent((prev) => applyCategory(prev, "analytics", checked));

  const toggleAdStorage = (checked: boolean) =>
    setConsent((prev) => applyCategory(prev, "ad_storage", checked));

  const toggleAdUserData = (checked: boolean) =>
    setConsent((prev) => applyCategory(prev, "ad_user_data", checked));

  const toggleAdPersonalization = (checked: boolean) =>
    setConsent((prev) => applyCategory(prev, "ad_personalization", checked));



  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Banner */}
          {!showCustomize && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 md:px-6 md:pb-6"
            >
              <div
                className="mx-auto max-w-3xl rounded-lg border border-border/50 p-5 md:p-6 shadow-2xl backdrop-blur-sm"
                style={{ backgroundColor: "#0c0e13" }}
              >
                <div className="flex items-start gap-4">
                  <Cookie className="h-6 w-6 shrink-0 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-1.5">
                      Cookie Preferences
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      We use cookies to analyze traffic and personalize ads. You choose what's allowed.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleAcceptAll}
                        className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Accept All
                      </button>
                      <button
                        onClick={handleDenyAll}
                        className="rounded-md border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                      >
                        Deny All
                      </button>
                      <button
                        onClick={() => setShowCustomize(true)}
                        className="rounded-md px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
                      >
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Customize Modal */}
          {showCustomize && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-md rounded-lg border border-border/50 p-6 shadow-2xl"
                style={{ backgroundColor: "#0c0e13" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      Cookie Settings
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCustomize(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-5 mb-6">
                  {/* Essential - always on */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Essential</p>
                      <p className="text-xs text-muted-foreground">Required for the site to function</p>
                    </div>
                    <Switch checked disabled className="opacity-60" />
                  </div>

                  <div className="h-px bg-border/40" />

                  {/* Analytics */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Analytics</p>
                      <p className="text-xs text-muted-foreground">
                        Helps us understand how visitors use the site
                      </p>
                    </div>
                    <Switch
                      checked={isCategoryGranted(consent, "analytics")}
                      onCheckedChange={toggleAnalytics}
                    />
                  </div>

                  <div className="h-px bg-border/40" />

                  {/* Marketing / Ads — single toggle today, drives 3 explicit signals */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Marketing Ads</p>
                      <p className="text-xs text-muted-foreground">
                        Used for ad personalization and measurement
                      </p>
                    </div>
                    <Switch
                      checked={isCategoryGranted(consent, "marketing")}
                      onCheckedChange={toggleMarketing}
                    />
                  </div>

                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveCustom}
                    className="flex-1 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={handleDenyAll}
                    className="rounded-md border border-border px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                  >
                    Deny All
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;

/**
 * Consent state adapter.
 *
 * Klaro owns the consent UI and persistence (localStorage key "klaro").
 * The form submission pipeline (see src/lib/forms/submitForm.ts) still
 * needs a typed ConsentState to gate user identifiers, so this module
 * exposes a read-only view derived from Klaro's stored choice.
 *
 * Scope: GA4 analytics only. `ad_*` signals are always denied.
 */
export type ConsentSignal = 'granted' | 'denied';

export interface ConsentState {
  analytics_storage: ConsentSignal;
  ad_storage: ConsentSignal;
  ad_user_data: ConsentSignal;
  ad_personalization: ConsentSignal;
  functionality_storage: ConsentSignal;
  security_storage: ConsentSignal;
}

export const DEFAULT_CONSENT: ConsentState = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
};

const KLARO_KEY = 'klaro';

export function getConsentState(): ConsentState {
  if (typeof window === 'undefined') return { ...DEFAULT_CONSENT };
  try {
    const raw = window.localStorage.getItem(KLARO_KEY);
    if (!raw) return { ...DEFAULT_CONSENT };
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return {
      ...DEFAULT_CONSENT,
      analytics_storage: parsed.analytics ? 'granted' : 'denied',
    };
  } catch {
    return { ...DEFAULT_CONSENT };
  }
}

/**
 * Cookie Consent — minimal Google Consent Mode v2 engine.
 *
 * Scope: this site uses GA4 for analytics only (no Google Ads, no remarketing).
 * The only user-editable signal is `analytics_storage`. All ad_* signals stay
 * denied. `functionality_storage` and `security_storage` are always granted
 * (strictly necessary).
 *
 * Source of truth: `localStorage['bread_consent_state']` — a single JSON blob
 * whose only meaningful field is `analytics_storage`.
 *
 * Default consent is set synchronously in index.html BEFORE GTM loads. If a
 * saved choice exists, that same inline script replays it as `consent update`
 * on the same tick, so tags never observe a transient all-denied state for a
 * returning visitor. This module therefore only issues updates in response to
 * a user action in the banner — never on mount.
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

const STORAGE_KEY = 'bread_consent_state';
const DEBUG = typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV;

export const DEFAULT_CONSENT: ConsentState = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
};

export const ANALYTICS_GRANTED: ConsentState = {
  ...DEFAULT_CONSENT,
  analytics_storage: 'granted',
};

// ---------- persistence ----------

export function getConsentState(): ConsentState {
  if (typeof window === 'undefined') return { ...DEFAULT_CONSENT };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ConsentState>;
      return { ...DEFAULT_CONSENT, ...parsed };
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_CONSENT };
}

export function setConsentState(state: ConsentState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function hasConsentChoice(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

// ---------- Google Consent Mode v2 engine ----------

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    /** Set by the inline bootstrap in index.html once `consent default` has fired. */
    __consentDefaultSet?: boolean;
  }
}

/**
 * Push a `consent: 'update'` to gtag. Call this ONLY in response to a user
 * action in the banner — the inline bootstrap already replays saved choices
 * on page load, so calling this on mount would double-push.
 */
export function pushConsentUpdate(state: ConsentState): void {
  if (typeof window === 'undefined') return;
  if (!window.__consentDefaultSet) {
    if (DEBUG) console.warn('[consent] update skipped — default not set yet');
    return;
  }
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: state.analytics_storage,
      ad_storage: state.ad_storage,
      ad_user_data: state.ad_user_data,
      ad_personalization: state.ad_personalization,
      functionality_storage: state.functionality_storage,
      security_storage: state.security_storage,
    });
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'consent_updated', consent: { ...state } });
  if (DEBUG) console.info('[consent] update', state);
}

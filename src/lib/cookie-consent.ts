/**
 * Cookie Consent — normalized model + Google Consent Mode v2 engine.
 *
 * Design notes:
 *  - The persisted source of truth uses the *Google* signal names so each
 *    consent type is stored explicitly (no lazy "marketing = true" boolean).
 *  - UI categories (analytics, marketing, ...) are derived from / mapped to
 *    one or more Google signals via CATEGORY_MAP. Adding a new UI toggle =
 *    add an entry to CATEGORY_MAP. The state engine doesn't change.
 *  - Default consent is set in index.html BEFORE GTM loads. This module
 *    only ever issues `consent: 'update'` calls, guarded by
 *    `window.__consentDefaultSet`.
 */

export type ConsentSignal = 'granted' | 'denied';

/** Persisted state. Mirrors Google Consent Mode v2 signal names 1:1. */
export interface ConsentState {
  analytics_storage: ConsentSignal;
  ad_storage: ConsentSignal;
  ad_user_data: ConsentSignal;
  ad_personalization: ConsentSignal;
}

/** Normalized UI-facing model (what toggles bind to). `essential` is always true. */
export interface NormalizedConsent {
  essential: true;
  analytics: boolean;
  ad_storage: boolean;
  ad_user_data: boolean;
  ad_personalization: boolean;
}

/**
 * UI categories → Google signals.
 * Each visible toggle maps to exactly ONE Google Consent Mode v2 signal.
 * No category grants more than one signal. No "marketing master" shortcut.
 */
export const CATEGORY_MAP = {
  essential: [] as const, // non-editable, no Google signals to flip
  analytics: ['analytics_storage'] as const,
  ad_storage: ['ad_storage'] as const,
  ad_user_data: ['ad_user_data'] as const,
  ad_personalization: ['ad_personalization'] as const,
} satisfies Record<string, readonly (keyof ConsentState)[]>;

export type ConsentCategory = keyof typeof CATEGORY_MAP;

const STORAGE_KEY = 'bread_consent_state';
const LEGACY_COOKIE_NAME = 'bread_consent_state';
const DEBUG = typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV;

export const DEFAULT_CONSENT: ConsentState = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

export const ALL_GRANTED: ConsentState = {
  analytics_storage: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
};

// ---------- persistence ----------

function readLegacyCookie(): ConsentState | null {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${LEGACY_COOKIE_NAME}=([^;]*)`)
    );
    if (match && match[1]) {
      return JSON.parse(decodeURIComponent(match[1])) as ConsentState;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function getConsentState(): ConsentState {
  if (typeof window === 'undefined') return { ...DEFAULT_CONSENT };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONSENT, ...(JSON.parse(raw) as Partial<ConsentState>) };
  } catch {
    /* ignore */
  }
  const legacy = readLegacyCookie();
  if (legacy) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
    } catch {
      /* ignore */
    }
    return { ...DEFAULT_CONSENT, ...legacy };
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

export function hasConsentCookie(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.localStorage.getItem(STORAGE_KEY) !== null) return true;
  } catch {
    /* ignore */
  }
  return readLegacyCookie() !== null;
}

// ---------- normalized <-> stored ----------

export function toNormalized(state: ConsentState): NormalizedConsent {
  return {
    essential: true,
    analytics: state.analytics_storage === 'granted',
    ad_storage: state.ad_storage === 'granted',
    ad_user_data: state.ad_user_data === 'granted',
    ad_personalization: state.ad_personalization === 'granted',
  };
}

export function fromNormalized(n: NormalizedConsent): ConsentState {
  return {
    analytics_storage: n.analytics ? 'granted' : 'denied',
    ad_storage: n.ad_storage ? 'granted' : 'denied',
    ad_user_data: n.ad_user_data ? 'granted' : 'denied',
    ad_personalization: n.ad_personalization ? 'granted' : 'denied',
  };
}

/**
 * Flip every Google signal owned by a UI category. Other signals are left
 * untouched — categories never reach across their declared signals.
 */
export function applyCategory(
  state: ConsentState,
  category: ConsentCategory,
  granted: boolean
): ConsentState {
  const signal: ConsentSignal = granted ? 'granted' : 'denied';
  const next: ConsentState = { ...state };
  for (const key of CATEGORY_MAP[category]) {
    next[key] = signal;
  }
  return next;
}

/** Derive a UI checkbox value: true only if *every* signal in the category is granted. */
export function isCategoryGranted(state: ConsentState, category: ConsentCategory): boolean {
  const keys = CATEGORY_MAP[category];
  if (keys.length === 0) return true; // essential
  return keys.every((k) => state[k] === 'granted');
}

// ---------- Google Consent Mode v2 engine ----------

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    __consentDefaultSet?: boolean;
  }
}

/**
 * Push a `consent: 'update'` to gtag using the persisted state. This is the
 * ONLY place that talks to Google Consent Mode for updates — every UI action
 * (Accept All / Deny All / Save Preferences / restore-on-load) funnels here.
 *
 * Guarded by `window.__consentDefaultSet` (set by the inline script in
 * index.html) so an update can never race ahead of the default state.
 */
export function pushConsentUpdate(state: ConsentState): void {
  if (typeof window === 'undefined') return;
  if (!window.__consentDefaultSet) {
    if (DEBUG) console.warn('[consent] update skipped — default not set yet');
    return;
  }
  if (typeof window.gtag !== 'function') {
    if (DEBUG) console.warn('[consent] gtag unavailable, update queued via dataLayer only');
  } else {
    window.gtag('consent', 'update', {
      analytics_storage: state.analytics_storage,
      ad_storage: state.ad_storage,
      ad_user_data: state.ad_user_data,
      ad_personalization: state.ad_personalization,
    });
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'consent_updated', consent: { ...state } });
  if (DEBUG) console.info('[consent] update', state);
}

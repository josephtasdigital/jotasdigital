export interface ConsentState {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
}

// Persisted in localStorage so the banner does not reappear on subsequent
// page loads or SPA route changes.
const STORAGE_KEY = 'bread_consent_state';
// Legacy cookie name — read once for backward compatibility, then migrated.
const LEGACY_COOKIE_NAME = 'bread_consent_state';

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
    // ignore parse errors
  }
  return null;
}

export function getConsentState(): ConsentState {
  if (typeof window === 'undefined') return { ...DEFAULT_CONSENT };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ConsentState;
  } catch {
    // ignore
  }
  // Migrate legacy cookie value, if present, into localStorage.
  const legacy = readLegacyCookie();
  if (legacy) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
    } catch {
      // ignore
    }
    return legacy;
  }
  return { ...DEFAULT_CONSENT };
}

export function setConsentState(state: ConsentState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / privacy mode errors
  }
}

export function hasConsentCookie(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.localStorage.getItem(STORAGE_KEY) !== null) return true;
  } catch {
    // ignore
  }
  // Honor legacy cookie so returning users aren't re-prompted.
  return readLegacyCookie() !== null;
}

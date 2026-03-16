export interface ConsentState {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
}

const COOKIE_NAME = 'bread_consent_state';
const COOKIE_DAYS = 365;

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

export function getConsentState(): ConsentState {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
    if (match && match[1]) {
      return JSON.parse(decodeURIComponent(match[1]));
    }
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULT_CONSENT };
}

export function setConsentState(state: ConsentState): void {
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
  const value = encodeURIComponent(JSON.stringify(state));
  document.cookie = `${COOKIE_NAME}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

export function hasConsentCookie(): boolean {
  return document.cookie.includes(COOKIE_NAME);
}

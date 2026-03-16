// src/utils/stealthDispatcher.ts

export const dispatchStealthEvent = (eventName, eventData = {}) => {
  // 1. Retrieve the exact same Client ID
  let clientId = 'anonymous_' + Math.floor(Math.random() * 1000000000);
  const cookieMatch = document.cookie.match(/_ga=([^;]+)/);
  if (cookieMatch && cookieMatch[1]) {
    const parts = cookieMatch[1].split('.');
    if (parts.length >= 2) {
      clientId = parts.slice(-2).join('.');
    }
  }

  // 2. Read the current consent state
  const getConsentState = () => {
    const defaults = {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    };
    try {
      const match = document.cookie.match(/(?:^|;\s*)bread_consent_state=([^;]*)/);
      if (match && match[1]) {
        return JSON.parse(decodeURIComponent(match[1]));
      }
    } catch(e) {}
    return defaults;
  };

  const consentState = getConsentState();

  // 3. Build the dynamic payload
  const payload = {
    event_name: eventName, // Dynamically injected (e.g., 'generate_lead')
    client_id: clientId,
    page_location: window.location.href,
    page_title: document.title,
    consent: {
      analytics_storage: consentState.analytics_storage,
      ad_storage: consentState.ad_storage,
      ad_user_data: consentState.ad_user_data,
      ad_personalization: consentState.ad_personalization
    },
    ...eventData // Spreads any custom data you passed in (e.g., { value: 50, currency: 'EUR' })
  };

  // 4. Dispatch the Unmarked Van
  fetch('https://bread.josephtasdigital.com/peanuts/crumbs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
  .then(() => console.log(`Stealth event [${eventName}] delivered.`))
  .catch(error => console.error(`Failed to deliver [${eventName}]:`, error));
};

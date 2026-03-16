import { useEffect } from 'react';

export const useStealthEvents = () => {
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      const el = target.closest('[data-stealth-event]') as HTMLElement | null;
      if (!el) return;

      const eventName = el.getAttribute('data-stealth-event');
      if (!eventName) return;

      // Client ID
      let clientId = 'anonymous_' + Math.floor(Math.random() * 1000000000);
      const gaMatch = document.cookie.match(/_ga=([^;]+)/);
      if (gaMatch?.[1]) {
        const parts = gaMatch[1].split('.');
        if (parts.length >= 2) clientId = parts.slice(-2).join('.');
      }

      // Consent
      const defaults = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
      let consent = defaults;
      try {
        const m = document.cookie.match(/(?:^|;\s*)bread_consent_state=([^;]*)/);
        if (m?.[1]) consent = JSON.parse(decodeURIComponent(m[1]));
      } catch {}

      const payload: Record<string, unknown> = {
        event_name: eventName,
        client_id: clientId,
        page_location: window.location.href,
        page_title: document.title,
        consent,
      };

      const stealthValue = el.getAttribute('data-stealth-value');
      if (stealthValue) payload.event_value = stealthValue;

      fetch('https://bread.josephtasdigital.com/peanuts/crumbs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
        .then(() => console.log(`Stealth event [${eventName}] fired.`))
        .catch((err) => console.error(`Stealth event [${eventName}] failed:`, err));
    };

    document.addEventListener('click', handler, true);
    document.addEventListener('submit', handler, true);
    return () => {
      document.removeEventListener('click', handler, true);
      document.removeEventListener('submit', handler, true);
    };
  }, []);
};

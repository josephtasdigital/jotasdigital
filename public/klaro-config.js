/* Klaro configuration — single source of truth for the consent UI.
 *
 * Scope: GA4 analytics only. No Google Ads, no remarketing.
 * The only optional service is "analytics". All ad_* Consent Mode v2
 * signals stay denied at all times.
 *
 * How this plugs into Google Consent Mode v2:
 *   - `index.html` sets `gtag('consent', 'default', ...)` synchronously
 *     BEFORE GTM loads, with everything denied except essential signals.
 *   - When Klaro grants/revokes the "analytics" service (or on page load
 *     for a returning visitor whose choice is already stored), the
 *     service's `callback` fires and we push a single `consent update`
 *     with the correct `analytics_storage` value.
 *   - Klaro persists the choice in localStorage under the key "klaro"
 *     so it survives refreshes — no "reset to denied on refresh".
 */
(function () {
  function pushGtagConsent(analyticsGranted) {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('consent', 'update', {
      analytics_storage: analyticsGranted ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
    });
    window.dataLayer.push({
      event: 'consent_updated',
      consent: {
        analytics_storage: analyticsGranted ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
      },
    });
  }

  window.klaroConfig = {
    version: 1,
    elementID: 'klaro',
    storageMethod: 'localStorage',
    storageName: 'klaro',
    htmlTexts: true,
    cookieExpiresAfterDays: 365,
    default: false,          // opt-in: analytics denied until user accepts
    mustConsent: false,      // non-blocking banner
    acceptAll: true,
    hideDeclineAll: false,
    hideLearnMore: false,
    noAutoLoad: false,
    lang: 'en',

    translations: {
      en: {
        consentModal: {
          title: 'Cookie Preferences',
          description:
            'We use analytics cookies to understand how visitors use the site. You choose what\'s allowed.',
        },
        consentNotice: {
          description:
            'We use analytics cookies to understand how visitors use the site. You choose what\'s allowed.',
          learnMore: 'Customize',
        },
        acceptAll: 'Accept',
        acceptSelected: 'Save Preferences',
        decline: 'Deny',
        ok: 'Accept',
        save: 'Save',
        close: 'Close',
        purposes: {
          analytics: { title: 'Analytics' },
        },
        service: {
          purpose: 'Purpose',
          required: { title: 'Always required' },
          optOut: { title: 'Opt out' },
        },
        purposeItem: { service: 'service', services: 'services' },
        contextualConsent: {
          description: 'Do you want to load external content from {title}?',
          acceptOnce: 'Yes',
          acceptAlways: 'Always',
        },
        poweredBy: '',
      },
    },

    services: [
      {
        name: 'analytics',
        title: 'Analytics (GA4)',
        purposes: ['analytics'],
        default: false,
        required: false,
        optOut: false,
        onlyOnce: false,
        // Klaro fires the callback on load AND on every change with the
        // current consent value — perfect for driving Consent Mode v2.
        callback: function (consent /*, service */) {
          pushGtagConsent(!!consent);
        },
      },
    ],
  };
})();

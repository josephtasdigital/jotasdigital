/**
 * PROJECT BREAD: Universal Stealth Tracker v1.1 (SPA Ready)
 * Architect: data.eng
 * Description: First-party, adblock-resilient data pipeline.
 */

(function(window, document) {
  if (window.BreadTracker) return;

  const CONFIG = {
    endpoint: 'https://bread.josephtasdigital.com/peanuts/crumbs',
    cookieName: '_ga',
    consentCookie: 'bread_consent_state'
  };

  const Utils = {
    getClientId: function() {
      let clientId = 'anonymous_' + Math.floor(Math.random() * 1000000000);
      const match = document.cookie.match(new RegExp(CONFIG.cookieName + '=([^;]+)'));
      if (match && match[1]) {
        const parts = match[1].split('.');
        if (parts.length >= 2) clientId = parts.slice(-2).join('.');
      }
      return clientId;
    },
    getConsent: function() {
      const defaults = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
      try {
        const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + CONFIG.consentCookie + '=([^;]*)'));
        if (match && match[1]) return JSON.parse(decodeURIComponent(match[1]));
      } catch(e) {}
      return defaults;
    }
  };

  window.BreadTracker = {
    send: function(eventName, customData = {}) {
      const payload = {
        event_name: eventName,
        client_id: Utils.getClientId(),
        page_location: window.location.href,
        page_title: document.title,
        consent: Utils.getConsent(),
        ...customData
      };

      fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      }).catch(err => console.warn("BreadTracker delivery failed.", err));
    },

    init: function() {
      // 1. Initial Page View
      this.send('page_view');

      // 2. SPA Route Change Listener (History API Interceptor)
      let lastUrl = window.location.href;
      const originalPushState = history.pushState;
      history.pushState = function() {
        originalPushState.apply(this, arguments);
        if (window.location.href !== lastUrl) {
          lastUrl = window.location.href;
          window.BreadTracker.send('page_view'); // Fires when React changes the URL
        }
      };
      window.addEventListener('popstate', function() {
        if (window.location.href !== lastUrl) {
          lastUrl = window.location.href;
          window.BreadTracker.send('page_view'); // Fires on browser back/forward buttons
        }
      });

      // 3. Global Click Listener for HTML Tags (The LEGO blocks)
      document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-bread-track]');
        if (target) {
          const eventName = target.getAttribute('data-bread-track');
          const eventValue = target.getAttribute('data-bread-value') || null;
          let customData = {};
          if (eventValue) customData.value = eventValue;
          window.BreadTracker.send(eventName, customData);
        }
      });
    }
  };

  window.BreadTracker.init();

})(window, document);

// Privacy-friendly analytics for Philosophy Club Website
// Using Plausible Analytics (self-hosted or plausible.io)
// Alternative: Simple Analytics, Fathom, or Umami

(function() {
  'use strict';

  // Configuration - Update this with your analytics domain
  const ANALYTICS_CONFIG = {
    // Set to true to enable analytics
    enabled: false,

    // Plausible Analytics domain (e.g., 'plausible.io' or your self-hosted domain)
    domain: 'plausible.io',

    // Your website domain as configured in Plausible
    dataDomain: 'philosophyclubsg.com'
  };

  // Only load if enabled
  if (!ANALYTICS_CONFIG.enabled) {
    console.log('Analytics disabled in config');
    return;
  }

  // Create and inject Plausible script
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = ANALYTICS_CONFIG.dataDomain;
  script.src = `https://${ANALYTICS_CONFIG.domain}/js/script.js`;

  // Add to document head
  document.head.appendChild(script);

  // Track custom events (optional)
  window.plausible = window.plausible || function() {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };

  // Example custom event tracking
  function trackEvent(eventName, props) {
    if (typeof window.plausible !== 'undefined') {
      window.plausible(eventName, { props });
    }
  }

  // Track download clicks
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && link.href.match(/\.(pdf|ics|zip|doc|docx)$/i)) {
      const fileName = link.href.split('/').pop();
      trackEvent('File Download', { file: fileName });
    }
  });

  // Track outbound links
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && link.hostname !== window.location.hostname && link.target === '_blank') {
      trackEvent('Outbound Link', { url: link.href });
    }
  });

  console.log('Privacy-friendly analytics loaded');
})();

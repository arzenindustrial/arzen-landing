/* Arzen Industrial Group — shared front-end behavior
   VERSION: v17 — 2026-08-16
   IMPORTANT: The About tabs (Who we are / What we do) work with pure CSS
   (radio + label) and do NOT depend on this file loading. If this script
   fails to load, the site still functions — only GA4 event tracking is lost.
   No frameworks, no build step. */

(function () {
  'use strict';

  /* ---------- GA4 event tracking ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('a.btn, a.nav-cta, a.audience-switch');
    if (t && window.gtag) {
      window.gtag('event', 'cta_click', { label: t.textContent.trim(), href: t.getAttribute('href') });
    }
    var label = e.target.closest('.tab-btn');
    if (label && window.gtag) {
      window.gtag('event', 'tab_select', { tab_label: label.textContent.trim() });
    }
  });

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('.lead-form');
    if (form && window.gtag) {
      window.gtag('event', 'lead_form_submit', { form_id: form.getAttribute('action') });
    }
  });

  window.addEventListener('message', function (e) {
    if (e.data && e.data.event && String(e.data.event).indexOf('calendly') === 0 && window.gtag) {
      window.gtag('event', e.data.event);
    }
  });

  (function () {
    var marks = [25, 50, 75, 100], fired = {};
    window.addEventListener('scroll', function () {
      var pct = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
      marks.forEach(function (m) {
        if (pct >= m && !fired[m] && window.gtag) { fired[m] = true; window.gtag('event', 'scroll_depth', { percent: m }); }
      });
    }, { passive: true });
  })();
})();

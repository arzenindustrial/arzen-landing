/* Arzen Industrial Group — shared front-end behavior
   VERSION: v9 — 2026-08-16
   IMPORTANT: Tabs (About / Contact) work with pure CSS (radio + label) and
   do NOT depend on this file loading. If this script fails to load for any
   reason, the site still functions — only the two enhancements below are lost:
   1) banner buttons pre-selecting a tab before scrolling
   2) GA4 event tracking
   No frameworks, no build step. */

(function () {
  'use strict';

  /* ---------- Banner buttons: href="#contacto" + data-open-tab="buyer|supplier" ---------- */
  document.querySelectorAll('[data-open-tab]').forEach(function (link) {
    link.addEventListener('click', function () {
      var targetId = link.getAttribute('data-open-tab') === 'supplier' ? 'tab-supplier' : 'tab-buyer';
      var radio = document.getElementById(targetId);
      if (radio) radio.checked = true;
    });
  });

  /* ---------- GA4 event tracking ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('a.btn, a.nav-cta');
    if (t && window.gtag) {
      window.gtag('event', 'cta_click', { label: t.textContent.trim(), href: t.getAttribute('href') });
    }
    var label = e.target.closest('.tab-btn');
    if (label && window.gtag) {
      window.gtag('event', 'tab_select', { tab_label: label.textContent.trim() });
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

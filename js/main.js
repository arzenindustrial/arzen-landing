/* Arzen Industrial Group — shared front-end behavior
   VERSION: v22 — 2026-08-16
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

  /* ---------- Scroll-triggered popup (shows once at 25% scroll) ---------- */
  (function () {
    var popup = document.getElementById('scroll-popup');
    if (!popup) return;
    var shown = false;
    var dismissed = false;
    try { dismissed = sessionStorage.getItem('arzen_popup_dismissed') === '1'; } catch (e) {}

    function checkScroll() {
      if (shown || dismissed) return;
      var docHeight = document.body.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      var pct = (window.scrollY / docHeight) * 100;
      if (pct >= 25) {
        popup.hidden = false;
        requestAnimationFrame(function () { popup.classList.add('visible'); });
        shown = true;
        if (window.gtag) window.gtag('event', 'scroll_popup_shown');
      }
    }
    window.addEventListener('scroll', checkScroll, { passive: true });

    function dismiss() {
      popup.classList.remove('visible');
      try { sessionStorage.setItem('arzen_popup_dismissed', '1'); } catch (e) {}
    }
    var closeBtn = popup.querySelector('.popup-close');
    if (closeBtn) closeBtn.addEventListener('click', dismiss);
    var cta = popup.querySelector('.popup-cta');
    if (cta) cta.addEventListener('click', dismiss);
  })();

  /* ---------- Hero carousel auto-advance (manual dots always work via pure CSS,
     this just adds automatic rotation as a progressive enhancement) ---------- */
  (function () {
    var radios = document.querySelectorAll('.slide-radio');
    if (!radios.length) return;
    var i = 0;
    setInterval(function () {
      i = (i + 1) % radios.length;
      radios[i].checked = true;
    }, 6000);
  })();
})();

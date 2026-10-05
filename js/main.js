/* Arzen Industrial Group — shared front-end behavior
   VERSION: v25 — 2026-10-05
   IMPORTANT: The About tabs (Who we are / What we do) work with pure CSS
   (radio + label) and do NOT depend on this file loading. If this script
   fails to load, the site still functions — only GA4 event tracking,
   scroll reveals and the share button are lost.
   No frameworks, no build step. */

(function () {
  'use strict';

  /* ---------- GA4 (single place to set the Measurement ID) ----------
     Replace the placeholder below with the real ID from
     analytics.google.com → Admin → Data Streams (looks like G-ABC123DEF4).
     While it is still the placeholder, nothing is loaded — no failing
     third-party request, no console errors. */
  var GA_ID = 'G-XXXXXXX';
  if (GA_ID && GA_ID.indexOf('XXXX') === -1) {
    var gs = document.createElement('script');
    gs.async = true;
    gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(gs);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  /* ---------- Hero slides 2-4: load after the first paint so the first
     slide (the LCP image) isn't competing with ~600 KB of hidden images ---------- */
  (function () {
    function load() {
      document.querySelectorAll('img.slide-img[data-src]').forEach(function (img) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
    }
    if (document.readyState === 'complete') { load(); } else { window.addEventListener('load', load); }
  })();

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
    var faq = e.target.closest('.faq-item summary');
    if (faq && window.gtag) {
      window.gtag('event', 'faq_toggle', { question: faq.textContent.trim() });
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

  /* ---------- Scroll reveal (progressive enhancement). Elements with
     .reveal are visible by default (see CSS); this only adds the fade-up
     motion where IntersectionObserver is supported. ---------- */
  (function () {
    if (!('IntersectionObserver' in window)) return;
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Share button ---------- */
  (function () {
    var btns = document.querySelectorAll('.share-btn');
    if (!btns.length) return;
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var shareData = { title: document.title, url: window.location.href };
        if (navigator.share) {
          navigator.share(shareData).catch(function () {});
          if (window.gtag) window.gtag('event', 'share_click', { method: 'native' });
          return;
        }
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareData.url).then(function () {
            var original = btn.dataset.label || btn.textContent;
            btn.classList.add('copied');
            btn.textContent = btn.dataset.copiedLabel || 'Link copied';
            setTimeout(function () { btn.classList.remove('copied'); btn.textContent = original; }, 2200);
          });
          if (window.gtag) window.gtag('event', 'share_click', { method: 'copy_link' });
        }
      });
    });
  })();
})();

/* Arzen Industrial Group — shared front-end behavior
   VERSION: v3 — 2026-08-16
   - Accessible tabs controller (About: Quiénes somos/Qué hacemos; Contact: Comprador/Proveedor)
   - data-open-tab links: jump to #contacto AND pre-select the right tab
   - GA4 event tracking: CTA clicks, scroll depth, Calendly widget events, tab switches
   No frameworks, no build step. */

(function () {
  'use strict';

  var tabGroups = {}; // name -> { select(index) }

  function initTabs(root) {
    var name = root.getAttribute('data-tabs');
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

    function select(index, opts) {
      tabs.forEach(function (t, i) {
        var active = i === index;
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.tabIndex = active ? 0 : -1;
        if (panels[i]) panels[i].hidden = !active;
      });
      if (!opts || !opts.silent) tabs[index].focus();
      if (window.gtag) {
        window.gtag('event', 'tab_select', { tab_group: name, tab_label: tabs[index].textContent.trim() });
      }
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % tabs.length); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length); }
        if (e.key === 'Home') { e.preventDefault(); select(0); }
        if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1); }
      });
    });

    if (name) tabGroups[name] = { select: select, tabs: tabs };
  }

  document.querySelectorAll('[data-tabs]').forEach(initTabs);

  /* ---------- Banner buttons: href="#contacto" + data-open-tab="buyer|supplier" ---------- */
  document.querySelectorAll('[data-open-tab]').forEach(function (link) {
    link.addEventListener('click', function () {
      var groupName = link.getAttribute('data-tab-group') || 'contact';
      var targetLabelKey = link.getAttribute('data-open-tab'); // e.g. "buyer" or "supplier"
      var group = tabGroups[groupName];
      if (!group) return;
      var idx = targetLabelKey === 'supplier' ? 1 : 0;
      group.select(idx, { silent: true });
    });
  });

  /* ---------- GA4 event tracking ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('a.btn, a.nav-cta');
    if (t && window.gtag) {
      window.gtag('event', 'cta_click', { label: t.textContent.trim(), href: t.getAttribute('href') });
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

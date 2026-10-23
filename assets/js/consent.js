/*
 * Einwilligungsverwaltung (DSGVO / TDDDG).
 * Bis zur Einwilligung bleiben alle nicht notwendigen Dienste blockiert:
 *  - Skripte:  <script type="text/plain" data-consent="statistics" data-src="https://…"></script>
 *              (oder Inline-Code im Element statt data-src)
 *  - iframes:  <iframe data-consent="external" data-src="https://…"></iframe>
 * Gespeichert wird nur die Auswahl selbst (technisch notwendig), lokal im Browser.
 */
(function () {
  "use strict";

  var KEY = "mhb-consent";
  var VERSION = 1;
  var CATEGORIES = ["external", "statistics"];
  var listeners = [];
  var state = load();

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === VERSION) return s;
    } catch (e) { /* Speicher nicht verfügbar */ }
    return null;
  }

  function save(choice) {
    var prev = state;
    state = { v: VERSION, ts: new Date().toISOString(), external: !!choice.external, statistics: !!choice.statistics };
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* nur für diese Sitzung */ }
    // Widerruf: bereits geladene Dienste lassen sich nur per Neuladen sicher entfernen
    var revoked = prev && CATEGORIES.some(function (c) { return prev[c] && !state[c]; });
    if (revoked) { location.reload(); return; }
    activate();
    listeners.forEach(function (fn) { fn(state); });
  }

  function allowed(cat) { return !!(state && state[cat]); }

  // Blockierte Skripte und iframes freischalten
  function activate() {
    Array.prototype.forEach.call(document.querySelectorAll("script[type='text/plain'][data-consent]"), function (old) {
      if (!allowed(old.getAttribute("data-consent"))) return;
      var s = document.createElement("script");
      Array.prototype.forEach.call(old.attributes, function (a) {
        if (a.name !== "type" && a.name !== "data-src" && a.name !== "data-consent") s.setAttribute(a.name, a.value);
      });
      if (old.getAttribute("data-src")) s.src = old.getAttribute("data-src");
      else s.textContent = old.textContent;
      old.parentNode.replaceChild(s, old);
    });
    Array.prototype.forEach.call(document.querySelectorAll("iframe[data-consent][data-src]"), function (f) {
      if (allowed(f.getAttribute("data-consent"))) { f.src = f.getAttribute("data-src"); f.removeAttribute("data-src"); }
    });
  }

  /* ---------------- Banner ---------------- */
  var box, form, lastFocus;

  function show(settings) {
    box = box || document.getElementById("consent");
    form = form || document.getElementById("consent-form");
    if (!box) return;
    lastFocus = document.activeElement;
    CATEGORIES.forEach(function (c) { form.elements[c].checked = allowed(c); });
    toggleSettings(!!settings);
    box.hidden = false;
    document.documentElement.classList.add("consent-open");
    box.focus({ preventScroll: true });
  }

  function hide() {
    box.hidden = true;
    document.documentElement.classList.remove("consent-open");
    if (lastFocus && lastFocus !== document.body && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function toggleSettings(on) {
    form.hidden = !on;
    box.querySelector("[data-consent='settings']").hidden = on;
    box.querySelector("[data-consent='save']").hidden = !on;
  }

  function init() {
    box = document.getElementById("consent");
    form = document.getElementById("consent-form");
    if (!box) return;
    box.addEventListener("click", function (e) {
      var b = e.target.closest("[data-consent]");
      if (!b || b.tagName !== "BUTTON") return;
      var action = b.getAttribute("data-consent");
      if (action === "settings") { toggleSettings(true); form.querySelector("input:not([disabled])").focus(); return; }
      if (action === "all") save({ external: true, statistics: true });
      else if (action === "necessary") save({});
      else if (action === "save") save({ external: form.elements.external.checked, statistics: form.elements.statistics.checked });
      hide();
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-consent-open]"), function (b) {
      b.addEventListener("click", function () { show(true); });
    });
    if (state) activate();
    else show(false);
  }

  window.Consent = {
    allowed: allowed,
    grant: function (cat) { var c = { external: allowed("external"), statistics: allowed("statistics") }; c[cat] = true; save(c); },
    onChange: function (fn) { listeners.push(fn); },
    open: function () { show(true); }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

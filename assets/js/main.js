(function () {
  "use strict";

  var S = window.SITE;
  var EN = window.I18N_EN || {};
  var root = document.documentElement;
  var lang = "de";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var t = function (de, en) { return lang === "en" ? en : de; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var ph = function (txt) { return '<span class="ph">' + esc(txt) + "</span>"; };

  if (!S.previewMarkers) root.classList.add("no-markers");

  /* ---------------- Formatierung aus zentraler Datenquelle ---------------- */
  function fmtPrice(key) {
    var s = S.services[key];
    if (!s || s.price == null) return ph(t("[Preis]", "[Price]"));
    var n = Number.isInteger(s.price) ? String(s.price) : s.price.toFixed(2).replace(".", lang === "en" ? "." : ",");
    if (lang === "en") return (s.from ? "from " : "") + "€" + n;
    return (s.from ? "ab " : "") + n + " €";
  }
  function fmtDuration(key) {
    var s = S.services[key];
    if (!s || s.duration == null) return ph(t("[Dauer]", "[Duration]"));
    return t("ca. " + s.duration + " Min.", "approx. " + s.duration + " min");
  }
  function addressLine() {
    var a = S.address;
    return a.street + ", " + a.zip + " " + a.city;
  }
  function mapsUrl() {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(S.name + ", " + addressLine());
  }

  function fillData() {
    $$("[data-price]").forEach(function (el) { el.innerHTML = fmtPrice(el.getAttribute("data-price")); });
    $$("[data-duration]").forEach(function (el) { el.innerHTML = fmtDuration(el.getAttribute("data-duration")); });

    var pay = S.payment && S.payment.length ? esc(S.payment.join(" · ")) : ph(t("[ZAHLUNGSARTEN]", "[PAYMENT METHODS]"));
    var payEl = $("#payment-methods"); if (payEl) payEl.innerHTML = pay;
    $$(".js-payment").forEach(function (el) { el.innerHTML = pay; });

    var mail = $("#mail-slot");
    if (mail) mail.innerHTML = S.email.display ? '<a href="mailto:' + esc(S.email.display) + '">' + esc(S.email.display) + "</a>" : ph(t("[E-MAIL]", "[EMAIL]"));

    $$(".js-address").forEach(function (el) { el.textContent = addressLine(); });
    $$(".js-address-block").forEach(function (el) { el.innerHTML = esc(S.address.street) + "<br>" + esc(S.address.zip + " " + S.address.city); });
    var af = $("#addr-flag"); if (af) af.hidden = !!S.address.confirmed;

    $$(".js-phone").forEach(function (el) { el.href = S.phone.href; });
    $$(".js-route").forEach(function (el) { el.href = mapsUrl(); });
    var g = $("#google-link"); if (g) g.href = S.links.google || mapsUrl();
  }

  /* ---------------- Öffnungszeiten & Status (Europe/Berlin) ---------------- */
  var DAYS = {
    de: ["", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
    en: ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  };
  var DAYS_SHORT = {
    de: ["", "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    en: ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  };
  var WD = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

  function nowInZone() {
    var parts = {};
    new Intl.DateTimeFormat("en-GB", { timeZone: S.timeZone, weekday: "short", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    return { day: WD[parts.weekday], date: parts.year + "-" + parts.month + "-" + parts.day, minutes: (+parts.hour) * 60 + (+parts.minute) };
  }
  function addDays(iso, n) {
    var d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function hoursFor(day, iso) {
    for (var i = 0; i < S.exceptions.length; i++) if (S.exceptions[i].date === iso) return S.exceptions[i].hours;
    return S.hours[day];
  }
  var toMin = function (hhmm) { var p = hhmm.split(":"); return (+p[0]) * 60 + (+p[1]); };
  var closedTxt = function () { return t("geschlossen", "closed"); };

  function renderHours() {
    var now = nowInZone();
    var body = $("#hours-body");
    if (body) {
      var html = "";
      for (var d = 1; d <= 7; d++) {
        var iso = addDays(now.date, (d - now.day + 7) % 7);
        var h = hoursFor(d, iso);
        html += '<tr data-day="' + d + '"' + (d === now.day ? ' class="is-today" aria-current="date"' : "") + '><th scope="row">' + DAYS[lang][d] + "</th><td>" + (h ? h[0] + " – " + h[1] : closedTxt()) + "</td></tr>";
      }
      body.innerHTML = html;
    }
    var flag = $("#hours-flag"); if (flag) flag.hidden = !!S.hoursConfirmed;
    renderStatus(now);
  }

  function renderStatus(now) {
    now = now || nowInZone();
    var today = hoursFor(now.day, now.date);
    var open = today && now.minutes >= toMin(today[0]) && now.minutes < toMin(today[1]);
    var text;
    if (open) {
      text = t("Jetzt geöffnet · bis " + today[1] + " Uhr", "Open now · until " + today[1]);
    } else {
      var next = null;
      for (var i = 0; i < 8 && !next; i++) {
        var iso = addDays(now.date, i);
        var day = ((now.day - 1 + i) % 7) + 1;
        var h = hoursFor(day, iso);
        if (h && (i > 0 || now.minutes < toMin(h[0]))) next = { i: i, day: day, h: h };
      }
      if (!next) text = t("Derzeit geschlossen", "Currently closed");
      else if (next.i === 0) text = t("Geschlossen · öffnet heute " + next.h[0] + " Uhr", "Closed · opens today at " + next.h[0]);
      else if (next.i === 1) text = t("Geschlossen · öffnet morgen " + next.h[0] + " Uhr", "Closed · opens tomorrow at " + next.h[0]);
      else text = t("Geschlossen · öffnet " + DAYS_SHORT.de[next.day] + " " + next.h[0] + " Uhr", "Closed · opens " + DAYS_SHORT.en[next.day] + " " + next.h[0]);
    }
    var pill = $("#hero-status");
    if (pill) {
      pill.classList.toggle("is-open", !!open);
      pill.classList.toggle("is-closed", !open);
      $(".status-text", pill).textContent = text;
    }
    var cs = $("#contact-status");
    if (cs) cs.textContent = text;
  }

  /* ---------------- Sprache ---------------- */
  var deText = new Map();
  var deAttr = new Map();
  $$("[data-i18n]").forEach(function (el) { deText.set(el, el.innerHTML); });
  $$("[data-i18n-attr]").forEach(function (el) {
    var store = {};
    el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
      var a = pair.split(":")[0]; store[a] = el.getAttribute(a);
    });
    deAttr.set(el, store);
  });
  var deTitle = document.title;
  var deDesc = $('meta[name="description"]').getAttribute("content");

  function applyLang(next) {
    lang = next === "en" ? "en" : "de";
    root.lang = lang;
    deText.forEach(function (html, el) {
      var key = el.getAttribute("data-i18n");
      el.innerHTML = lang === "en" && EN[key] != null ? EN[key] : html;
    });
    deAttr.forEach(function (store, el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":"); var a = p[0], key = p[1];
        var v = lang === "en" && EN[key] != null ? EN[key].replace(/&amp;/g, "&") : store[a];
        if (v != null) el.setAttribute(a, v);
      });
    });
    document.title = lang === "en" ? "Master's Hair & Beauty – Hairdresser for women, men & kids in Munich" : deTitle;
    $('meta[name="description"]').setAttribute("content", lang === "en" ? "Master's Hair & Beauty in Munich: precise men's cuts and fades, beard care, kids' cuts, women's cuts, balayage and highlights. Book on 089 68 58 47." : deDesc);
    $$("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
    fillData();
    renderHours();
    setupBooking();
    syncMenuLabel();
    try { localStorage.setItem("mhb-lang", lang); } catch (e) { /* Speicher nicht verfügbar */ }
  }

  $$("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
  });
  $$("[data-lang-toggle]").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(lang === "de" ? "en" : "de"); });
  });

  /* ---------------- Header, Fortschritt, mobile Leiste ---------------- */
  var header = $(".header");
  var progress = $(".progress");
  var bar = $(".progress span");
  var mbar = $(".mbar");
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 18);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.classList.toggle("is-visible", y > 120);
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    var showBar = y > 560 && !document.body.classList.contains("is-locked");
    mbar.classList.toggle("is-visible", showBar);
    $$("a", mbar).forEach(function (a) { a.tabIndex = showBar ? 0 : -1; });
    mbar.setAttribute("aria-hidden", String(!showBar));
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* ---------------- Mobiles Menü ---------------- */
  var menuBtn = $(".menu-btn");
  var mnav = $("#mobile-nav");
  function syncMenuLabel() {
    var open = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-label", open ? t("Menü schließen", EN.menuClose) : t("Menü öffnen", EN.menuOpen));
    $("use", menuBtn).setAttribute("href", open ? "#i-close" : "#i-menu");
  }
  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    mnav.hidden = !open;
    syncMenuLabel();
  }
  menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
  $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !mnav.hidden) { setMenu(false); menuBtn.focus(); }
  });
  document.addEventListener("click", function (e) {
    if (!mnav.hidden && !mnav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });

  /* ---------------- Aktiver Navigationspunkt ---------------- */
  var navLinks = $$(".nav a");
  if ("IntersectionObserver" in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (a) { var s = $(a.getAttribute("href")); if (s) navIO.observe(s); });
  }

  /* ---------------- Einblendungen ---------------- */
  var reveals = $$(".reveal");
  var stagger = window.matchMedia("(max-width: 620px)").matches ? 90 : 70;
  reveals.forEach(function (el) {
    var parent = el.parentElement;
    if (parent && parent.classList.contains("grid")) {
      var idx = $$(":scope > .reveal", parent).indexOf(el);
      el.style.transitionDelay = (idx * stagger) + "ms";
    }
  });
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------------- FAQ ---------------- */
  var faqItems = $$(".faq__item");
  function setFaq(item, open) {
    item.classList.toggle("is-open", open);
    $("button", item).setAttribute("aria-expanded", String(open));
  }
  faqItems.forEach(function (item) {
    $("button", item).addEventListener("click", function () {
      var willOpen = !item.classList.contains("is-open");
      faqItems.forEach(function (o) { setFaq(o, false); });
      setFaq(item, willOpen);
    });
  });

  /* ---------------- Buchung ---------------- */
  var bookingLoaded = false;
  function setupBooking() {
    var b = S.booking;
    var configured = (b.mode === "embed" && b.embedUrl) || (b.mode === "link" && b.url);
    var flag = $("#cal-missing-flag");
    var load = $("#cal-load");
    var direct = $("#cal-direct");
    var text = $("#cal-text");
    var note = $("#cal-note");
    if (flag) flag.hidden = !!configured;
    if (bookingLoaded) return;

    $$(".js-book").forEach(function (a) {
      if (b.mode === "link" && b.url) { a.href = b.url; a.target = "_blank"; a.rel = "noopener"; }
    });

    if (b.url) { direct.href = b.url; direct.hidden = false; }
    if (b.mode === "embed" && b.embedUrl) {
      load.hidden = false;
      text.textContent = t("Wähle deinen Wunschtermin direkt im Kalender.", "Pick your preferred slot right in the calendar.");
      note.hidden = false;
      note.innerHTML = t(
        "Der Kalender wird von " + esc(b.provider || "einem externen Anbieter") + " bereitgestellt und erst nach deinem Klick geladen. Dabei werden Daten an den Anbieter übertragen – mehr in der <a href=\"" + b.privacyAnchor + "\">Datenschutzerklärung</a>.",
        "The calendar is provided by " + esc(b.provider || "an external provider") + " and only loads after you click. Data is then transmitted to the provider – see our <a href=\"" + b.privacyAnchor + "\">privacy policy</a>."
      );
    } else if (b.mode === "link" && b.url) {
      text.textContent = t("Die Online-Buchung öffnet sich in einem neuen Tab.", "Online booking opens in a new tab.");
    }
  }
  $("#cal-load").addEventListener("click", function () {
    var b = S.booking;
    var cal = $("#calendar");
    var text = $("#cal-text");
    cal.classList.add("is-loading");
    text.textContent = t("Kalender wird geladen …", "Loading calendar …");
    var iframe = document.createElement("iframe");
    iframe.title = t("Online-Terminbuchung", "Online booking");
    iframe.src = b.embedUrl;
    iframe.loading = "eager";
    var done = false;
    var timer = setTimeout(function () {
      if (done) return;
      done = true;
      iframe.remove();
      cal.classList.remove("is-loading");
      text.textContent = t("Der Kalender konnte nicht geladen werden. Öffne die Buchungsseite direkt oder ruf uns an.", "The calendar couldn't be loaded. Open the booking page directly or give us a call.");
      $("#cal-load").hidden = true;
    }, 15000);
    iframe.addEventListener("load", function () {
      if (done) return;
      done = true; clearTimeout(timer); bookingLoaded = true;
      cal.classList.remove("is-loading");
      $("#cal-placeholder").hidden = true;
      iframe.hidden = false;
    });
    iframe.hidden = true;
    cal.appendChild(iframe);
  });

  /* ---------------- Rechtliche Overlays ---------------- */
  var openDialog = null;
  var lastFocus = null;
  function focusables(el) {
    return $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', el).filter(function (n) { return n.offsetParent !== null; });
  }
  function showDialog(id) {
    var dlg = document.getElementById(id);
    if (!dlg || !dlg.classList.contains("legal")) return;
    if (openDialog && openDialog !== dlg) openDialog.hidden = true;
    if (!openDialog && document.activeElement && document.activeElement !== document.body) lastFocus = document.activeElement;
    openDialog = dlg;
    dlg.hidden = false;
    document.body.classList.add("is-locked");
    mbar.classList.remove("is-visible");
    $(".legal__panel", dlg).scrollTop = 0;
    $(".legal__panel", dlg).focus();
  }
  function hideDialog(fromHash) {
    if (!openDialog) return;
    openDialog.hidden = true;
    openDialog = null;
    document.body.classList.remove("is-locked");
    if (!fromHash && /^#(impressum|datenschutz)$/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
    onScroll();
  }
  function routeHash() {
    var id = location.hash.slice(1);
    if (id === "impressum" || id === "datenschutz") showDialog(id);
    else if (openDialog) hideDialog(true);
  }
  window.addEventListener("hashchange", routeHash);
  // Auslöser merken, bevor die Hash-Navigation den Fokus verschiebt
  $$('a[href="#impressum"], a[href="#datenschutz"]').forEach(function (a) {
    a.addEventListener("click", function () { if (!openDialog) lastFocus = a; });
  });
  $$(".legal [data-close]").forEach(function (el) { el.addEventListener("click", function () { hideDialog(false); }); });
  document.addEventListener("keydown", function (e) {
    if (!openDialog) return;
    if (e.key === "Escape") { e.preventDefault(); hideDialog(false); return; }
    if (e.key === "Tab") {
      var f = focusables(openDialog);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === $(".legal__panel", openDialog))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // Links innerhalb eines Dialogs zu Seitenabschnitten schließen ihn
  $$(".legal a[href^='#']").forEach(function (a) {
    a.addEventListener("click", function () {
      var id = a.getAttribute("href").slice(1);
      if (id !== "impressum" && id !== "datenschutz") hideDialog(true);
    });
  });

  /* ---------------- Strukturierte Daten (nur bestätigte Angaben) ---------------- */
  function jsonLd() {
    var data = { "@context": "https://schema.org", "@type": "HairSalon", name: S.name };
    if (S.phone.confirmed) data.telephone = "+49 89 685847";
    if (S.domain) { data.url = S.domain; data.image = S.domain.replace(/\/$/, "") + "/assets/img/og-image.jpg"; }
    if (S.address.confirmed) data.address = { "@type": "PostalAddress", streetAddress: S.address.street, postalCode: S.address.zip, addressLocality: S.address.city, addressCountry: "DE" };
    if (S.hoursConfirmed) {
      var names = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      data.openingHoursSpecification = [];
      for (var d = 1; d <= 7; d++) if (S.hours[d]) data.openingHoursSpecification.push({ "@type": "OpeningHoursSpecification", dayOfWeek: names[d], opens: S.hours[d][0], closes: S.hours[d][1] });
    }
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ---------------- Start ---------------- */
  $("#year").textContent = new Date().getFullYear();
  var stored = null;
  try { stored = localStorage.getItem("mhb-lang"); } catch (e) { /* ignoriert */ }
  applyLang(stored === "en" ? "en" : "de");
  jsonLd();
  onScroll();
  routeHash();
  setInterval(renderHours, 60000);
})();

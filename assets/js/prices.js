/*
 * Preis-Helfer und Renderer der Preisliste.
 * Läuft im Browser (window.MHB) und im Build-Skript (scripts/build-prices.js),
 * damit die statische Fassung in index.html und die JS-Fassung identisch sind.
 */
(function (w) {
  "use strict";

  var L = {
    de: { from: "ab ", request: "auf Anfrage", fromNote: "„ab“ = Mindestpreis – der Endpreis richtet sich nach Haarlänge und Aufwand.", tabs: "Kategorien der Preisliste", service: "Leistung" },
    en: { from: "from ", request: "on request", fromNote: "“from” = minimum price – the final price depends on hair length and effort.", tabs: "Price list categories", service: "Service" }
  };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  function price(p, lang) {
    if (!p) return "";
    if (p.request) return L[lang].request;
    if (p.price == null) return "";
    var n = String(p.price);
    return lang === "en" ? (p.from ? L.en.from : "") + "€" + n : (p.from ? L.de.from : "") + n + " €";
  }

  function duration(min, lang) {
    if (min == null) return "";
    var h = Math.floor(min / 60), m = min % 60;
    if (lang === "en") return (h ? h + " h" : "") + (h && m ? " " : "") + (m ? m + " min" : "");
    return (h ? h + " Std." : "") + (h && m ? " " : "") + (m ? m + " Min." : "");
  }

  // Sucht einen Eintrag (oder eine Variante) über seinen `key`
  function find(S, key) {
    for (var c = 0; c < S.priceList.length; c++) {
      var items = S.priceList[c].items;
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        if (it.key === key) return it;
        if (it.v) for (var j = 0; j < it.v.length; j++) if (it.v[j].key === key) return it.v[j];
      }
    }
    return null;
  }

  // Günstigster Preis einer Kategorie als „ab“-Angabe
  function categoryFrom(S, catId) {
    var cat = S.priceList.filter(function (c) { return c.id === catId; })[0];
    if (!cat) return null;
    var min = null;
    cat.items.forEach(function (it) {
      (it.v || [it]).forEach(function (p) { if (p.price != null && (min === null || p.price < min)) min = p.price; });
    });
    return min === null ? null : { price: min, from: true };
  }

  function row(it, lang) {
    var name = esc(lang === "en" ? it.en : it.de);
    var desc = lang === "en" ? it.dEn : it.dDe;
    return '<li class="prow' + (it.featured ? " prow--featured" : "") + '">' +
      '<div class="prow__name"><strong>' + name + "</strong>" + (desc ? "<span>" + esc(desc) + "</span>" : "") + "</div>" +
      '<div class="prow__meta"><span class="ppill' + (it.request ? " ppill--req" : "") + '">' + esc(price(it, lang)) + '</span><span class="pdur">' + esc(duration(it.dur, lang)) + "</span></div></li>";
  }

  function panelBody(cat, lang) {
    var html = "";
    if (cat.columns) {
      html += '<div class="ptable" role="table" aria-label="' + esc(lang === "en" ? cat.en : cat.de) + '">' +
        '<div class="ptable__head" role="row"><span role="columnheader">' + L[lang].service + "</span>" +
        cat.columns.map(function (c) { return '<span role="columnheader">' + esc(c[lang]) + "</span>"; }).join("") + "</div>";
      cat.items.forEach(function (it) {
        html += '<div class="ptable__row" role="row"><strong role="rowheader">' + esc(lang === "en" ? it.en : it.de) + "</strong>" +
          it.v.map(function (p, i) {
            return '<span role="cell" class="ptable__cell"><small>' + esc(cat.columns[i][lang]) + '</small><span class="ppill">' + esc(price(p, lang)) + '</span><span class="pdur">' + esc(duration(p.dur, lang)) + "</span></span>";
          }).join("") + "</div>";
      });
      return html + "</div>";
    }
    var open = false;
    cat.items.forEach(function (it) {
      if (it.group) {
        if (open) html += "</ul>";
        html += '<h4 class="pgroup">' + esc(it.group[lang]) + '</h4><ul class="plist">';
        open = true;
        return;
      }
      if (!open) { html += '<ul class="plist">'; open = true; }
      html += row(it, lang);
    });
    return html + (open ? "</ul>" : "");
  }

  // Komplette Preisliste: Tabs + Panels. Ohne JS sind alle Panels sichtbar.
  function render(S, lang, active) {
    lang = lang === "en" ? "en" : "de";
    var tabs = '<div class="ptabs" role="tablist" aria-label="' + L[lang].tabs + '">';
    var panels = "";
    S.priceList.forEach(function (cat, i) {
      var sel = active ? cat.id === active : i === 0;
      var label = esc(lang === "en" ? cat.en : cat.de);
      tabs += '<button type="button" role="tab" class="ptab" id="ptab-' + cat.id + '" aria-controls="ppanel-' + cat.id + '" aria-selected="' + sel + '" tabindex="' + (sel ? 0 : -1) + '">' + label + "</button>";
      var note = lang === "en" ? cat.noteEn : cat.noteDe;
      panels += '<section class="ppanel" role="tabpanel" id="ppanel-' + cat.id + '" aria-labelledby="ptab-' + cat.id + '" data-active="' + sel + '">' +
        '<h3 class="ppanel__title">' + label + "</h3>" + (note ? '<p class="ppanel__note">' + esc(note) + "</p>" : "") + panelBody(cat, lang) + "</section>";
    });
    return tabs + "</div>" + panels + '<p class="pfrom-note">' + L[lang].fromNote + "</p>";
  }

  w.MHB = { price: price, duration: duration, find: find, categoryFrom: categoryFrom, renderPrices: render, esc: esc };
})(typeof window !== "undefined" ? window : this);

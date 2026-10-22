# Master's Hair & Beauty – Website

Statischer Onepager (HTML/CSS/Vanilla-JS, kein Build-Schritt) für Master's Hair & Beauty, München.
Gestaltung: Schwarz · Weiß · Gold · Violett – abgeleitet aus Salonfotos (LED-Bogenspiegel, goldene Stühle, violettes Deckenlicht).

## Starten

```bash
npx http-server -p 8080 .    # oder: python3 -m http.server 8080
```

Dann <http://localhost:8080> öffnen. Für die Veröffentlichung den kompletten Ordner auf beliebiges statisches Hosting legen (Netlify, Vercel, Apache, nginx …).

## Struktur

| Datei | Inhalt |
|---|---|
| `index.html` | Alle Abschnitte (deutsche Fassung, funktioniert ohne JavaScript), Impressum/Datenschutz als Overlays (`#impressum`, `#datenschutz`) |
| `assets/js/data.js` | **Einzige Datenquelle** für Telefon, Adresse, Öffnungszeiten, Ausnahmen, Preise, Dauern, Zahlungsarten, Buchung |
| `assets/js/i18n.js` | Englische Texte (Schlüssel = `data-i18n` im HTML) |
| `assets/js/main.js` | Öffnungsstatus (Europe/Berlin), DE/EN, FAQ, Buchungswidget, Dialoge, Einblendungen, mobile Leiste |
| `assets/css/styles.css` | Designsystem und Responsive-Regeln |
| `assets/fonts/` | Lokal eingebundene Schriften (Bricolage Grotesque, Instrument Sans, DM Mono – OFL) |
| `assets/img/` | Optimierte Salonfotos (WebP + JPG), OG-Bild, Favicon |

## Vor dem Livegang

Platzhalter erscheinen gestreift-gold markiert. Fehlende Daten in `assets/js/data.js` eintragen und dann `previewMarkers: false` setzen.

- [ ] Adresse bestätigen (`address`, aktuell Kandidat aus Verzeichnis: Balanstraße 95, 81539 München) → `confirmed: true`
- [ ] Öffnungszeiten bestätigen (`hours`, `hoursConfirmed: true`), Feiertage/Urlaub in `exceptions`
- [ ] Preise und Dauern aller Leistungen (`services`)
- [ ] Zahlungsarten (`payment`), E-Mail (`email`)
- [ ] Buchungsanbieter + echte URL (`booking`: `mode: "link"` oder `"embed"`)
- [ ] Google-Profil-Link (`links.google`), ggf. bestätigte Bewertung im Bewertungsband
- [ ] Walk-in-, Nachbesserungs-, Kinder-Regeln, Hygienehinweis, ÖPNV/Parken (Texte im HTML mit Klasse `ph`)
- [ ] Inhaber/Team-Vorstellung
- [ ] Impressum + Datenschutz mit echten Betreiberdaten, Hosting und Diensten; rechtlich prüfen
- [ ] Domain in `data.js` (`domain`) sowie `canonical`/`og:url` im `<head>`

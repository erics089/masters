# Master's Hair & Beauty – Website

Statischer Onepager (HTML/CSS/Vanilla-JS, kein Build-Schritt) für Master's Hair & Beauty, München.
Gestaltung: Schwarz · Weiß · Gold · Violett – abgeleitet aus Salonfotos (LED-Bogenspiegel, goldene Stühle, violettes Deckenlicht). Herren-Motive in Schwarz-Weiß. Original-Logo als Vektor (`#logo` im SVG-Sprite).

## Starten

```bash
npx http-server -p 8080 .    # oder: python3 -m http.server 8080
```

Dann <http://localhost:8080> öffnen. Für die Veröffentlichung den kompletten Ordner auf beliebiges statisches Hosting legen (Netlify, Vercel, Apache, nginx …).

## Struktur

| Datei | Inhalt |
|---|---|
| `index.html` | Alle Abschnitte (deutsche Fassung, funktioniert ohne JavaScript), Impressum/Datenschutz als Overlays (`#impressum`, `#datenschutz`) |
| `assets/js/data.js` | **Einzige Datenquelle** für Telefon, Adresse, Öffnungszeiten, Ausnahmen, komplette Preisliste (`priceList`), Google-Bewertung, Zahlungsarten, Buchung |
| `assets/js/prices.js` | Preisformatierung und Renderer der Preisliste (Browser + Build-Skript) |
| `assets/js/consent.js` | Cookie-Einwilligung: blockiert alle nicht notwendigen Skripte/iframes bis zur Zustimmung |
| `scripts/build-prices.js` | Schreibt die deutsche Preisliste statisch in `index.html` (für Besucher ohne JavaScript) |
| `assets/js/i18n.js` | Englische Texte (Schlüssel = `data-i18n` im HTML) |
| `assets/js/main.js` | Öffnungsstatus (Europe/Berlin), DE/EN, FAQ, Buchungswidget, Dialoge, Einblendungen, mobile Leiste |
| `assets/css/styles.css` | Designsystem und Responsive-Regeln |
| `assets/fonts/` | Lokal eingebundene Schriften (Rajdhani, Barlow, Share Tech Mono – OFL) |
| `assets/img/` | Optimierte Salonfotos (WebP + JPG), OG-Bild, Favicon |

## Preise ändern

Preise und Dauern in `assets/js/data.js` → `priceList` anpassen, danach:

```bash
node scripts/build-prices.js
```

## Cookie-Einwilligung

Optionale Dienste nur blockiert einbinden, sie werden nach Zustimmung automatisch aktiviert:

```html
<script type="text/plain" data-consent="statistics" data-src="https://…"></script>
<iframe data-consent="external" data-src="https://…"></iframe>
```

## Vor dem Livegang

Platzhalter erscheinen gestreift-gold markiert. Fehlende Daten in `assets/js/data.js` eintragen und dann `previewMarkers: false` setzen.

- [ ] Adresse bestätigen (`address`, aktuell Kandidat aus Verzeichnis: Balanstraße 95, 81539 München) → `confirmed: true`
- [ ] Öffnungszeiten bestätigen (`hours`, `hoursConfirmed: true`), Feiertage/Urlaub in `exceptions`
- [ ] Zahlungsarten (`payment`), E-Mail (`email`)
- [ ] Buchungsanbieter + echte URL (`booking`: `mode: "link"` oder `"embed"`)
- [ ] Google-Profil-Link (`links.google`); Bewertung (`rating`) regelmäßig aktualisieren
- [ ] Walk-in- und Nachbesserungs-Regeln, Hygienehinweis, ÖPNV/Parken (Texte im HTML mit Klasse `ph`)
- [ ] Inhaber/Team-Vorstellung
- [ ] Impressum + Datenschutz mit echten Betreiberdaten, Hosting und Diensten; rechtlich prüfen
- [ ] Domain in `data.js` (`domain`) sowie `canonical`/`og:url` im `<head>`

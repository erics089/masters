/*
 * Zentrale Stammdaten für Master's Hair & Beauty.
 * Alle Preise, Dauern, Öffnungszeiten, Bewertungen und Links werden NUR hier gepflegt.
 * Nach Änderungen an `priceList`: `node scripts/build-prices.js` ausführen,
 * damit die statische (JavaScript-freie) Preisliste in index.html aktuell bleibt.
 */
window.SITE = {
  // Platzhalter sichtbar markieren (vor Livegang auf false setzen)
  previewMarkers: true,

  name: "Master's Hair & Beauty",
  domain: null, // z. B. "https://www.mastershairundbeauty.de" – für canonical/OG eintragen
  timeZone: "Europe/Berlin",

  phone: { display: "089 68 58 47", href: "tel:+4989685847", confirmed: true }, // Wandschild + Buchungsseite
  email: { display: null, href: null }, // [E-MAIL]

  // Kandidat aus öffentlichem Verzeichnis – vor Livegang bestätigen
  address: {
    street: "Balanstraße 95",
    zip: "81539",
    city: "München",
    district: null,
    confirmed: false
  },

  links: {
    google: null, // [GOOGLE-PROFIL-URL] – ohne Eintrag führt der Link zur Google-Maps-Suche
    instagram: null
  },

  // Google-Bewertung (Stand laut Google-Profil, 23.10.2026). Rezensionstexte stehen in index.html (#bewertungen).
  rating: { value: 4.7, count: 290, asOf: "2026-10" },

  // Buchung: mode "embed" (Widget nach Klick + Einwilligung laden), "link" (externer Tab) oder null
  booking: {
    provider: null,
    mode: null,
    url: null,
    embedUrl: null,
    privacyAnchor: "#datenschutz"
  },

  // Wochenplan: 1 = Montag … 7 = Sonntag. Kandidat aus Verzeichnis, bestätigen!
  hoursConfirmed: false,
  hours: {
    1: null,
    2: ["09:00", "18:30"],
    3: ["09:00", "18:30"],
    4: ["09:00", "18:30"],
    5: ["09:00", "18:30"],
    6: ["09:00", "16:00"],
    7: null
  },
  // Ausnahmen: { date: "YYYY-MM-DD", hours: null | ["HH:MM","HH:MM"] }
  exceptions: [],

  /*
   * Preisliste (Quelle: Online-Buchung des Salons, 23.10.2026).
   * price in €, dur in Minuten, from = „ab“-Preis, request = „auf Anfrage“.
   * key = Verweis für Hero, Leistungskarten und Richtzeiten.
   */
  priceList: [
    {
      id: "herren", de: "Herren", en: "Men",
      items: [
        { key: "herren", de: "Haarschnitt & Föhnen", en: "Haircut & blow-dry", dDe: "Präziser Schnitt inkl. Waschen", dEn: "Precise cut incl. wash", price: 18, dur: 35 },
        { de: "Haarschnitt mit Massage & Styling", en: "Haircut with massage & styling", dDe: "Kopfmassage, Schnitt und Styling", dEn: "Head massage, cut and styling", price: 21, dur: 40 },
        { key: "fade", de: "Maschinenschnitt (gleich lang)", en: "Clipper cut (one length)", dDe: "Schnell und gleichmäßig", dEn: "Quick and even", price: 15, dur: 30 },
        { key: "bart", de: "Bartpflege & Konturen", en: "Beard care & line-up", dDe: "Form, Konturen und Pflegefinish", dEn: "Shape, lines and care finish", price: 12, dur: 15 },
        { de: "Klassische Nassrasur", en: "Classic wet shave", dDe: "Mit heißem Handtuch und Schaum", dEn: "With hot towel and lather", price: 12, dur: 15 },
        { de: "Konturenservice", en: "Line-up service", dDe: "Nacken und Konturen zwischen zwei Schnitten", dEn: "Neckline and contours between cuts", price: 8, dur: 10 },
        { de: "Waxing (Nase & Ohren)", en: "Waxing (nose & ears)", price: 8, dur: 10 },
        { de: "Augenbrauen formen mit Faden", en: "Eyebrow threading", price: 8, dur: 10 },
        { key: "paketHerren", featured: true, de: "Gentleman Servicepaket", en: "Gentleman service package", dDe: "Das Rundum-Paket, u. a. mit 2× Waschen", dEn: "The full package, incl. 2× wash", price: 50, dur: 70 }
      ]
    },
    {
      id: "damen", de: "Damen", en: "Women",
      items: [
        { key: "damenKurz", de: "Waschen, Schneiden & Föhnen – kurz", en: "Wash, cut & blow-dry – short", price: 35, from: true, dur: 45 },
        { key: "damenMittel", de: "Waschen, Schneiden & Föhnen – mittel", en: "Wash, cut & blow-dry – medium", price: 50, from: true, dur: 50 },
        { key: "damenLang", de: "Waschen, Schneiden & Föhnen – lang", en: "Wash, cut & blow-dry – long", price: 60, from: true, dur: 60 },
        { key: "styling", de: "Waschen & Föhnen", en: "Wash & blow-dry", price: 25, from: true, dur: 30 },
        { de: "Waschen & Legen", en: "Wash & set", price: 25, from: true, dur: 45 },
        { de: "Waschen, Blowout & Styling", en: "Wash, blowout & styling", price: 40, from: true, dur: 30 },
        { de: "Volumen, Wellen & Föhnen", en: "Volume, waves & blow-dry", price: 50, from: true, dur: 105 },
        { de: "Dauerwelle", en: "Perm", price: 75, from: true, dur: 105 },
        { de: "Dauerwelle – lang", en: "Perm – long", price: 90, from: true, dur: 105 },
        { de: "Hochsteckfrisur", en: "Updo", request: true, dur: 60 },
        { de: "Braut-Probefrisur", en: "Bridal trial", request: true, dur: 60 },
        { de: "Brautfrisur ohne Make-up", en: "Bridal hair without make-up", request: true, dur: 90 },
        { de: "Brautfrisur mit Make-up", en: "Bridal hair with make-up", request: true, dur: 120 }
      ]
    },
    {
      id: "farbe", de: "Farbe", en: "Colour",
      noteDe: "Alle Farbbehandlungen inkl. Waschen & Styling.",
      noteEn: "All colour services include wash & styling.",
      columns: [{ de: "mit Schnitt", en: "with cut" }, { de: "ohne Schnitt", en: "without cut" }],
      items: [
        { de: "Komplettfärbung", en: "Full colour", v: [{ price: 130, from: true, dur: 150 }, { price: 95, from: true, dur: 90 }] },
        { de: "Tönung", en: "Toning", v: [{ price: 95, from: true, dur: 90 }, { price: 65, from: true, dur: 90 }] },
        { de: "Ansatzfarbe", en: "Root colour", v: [{ price: 100, from: true, dur: 90 }, { key: "coloration", price: 65, from: true, dur: 90 }] },
        { de: "Glossing", en: "Glossing", v: [{ price: 130, from: true, dur: 90 }, { price: 100, from: true, dur: 90 }] },
        { de: "Strähnen – halber Kopf", en: "Highlights – half head", v: [{ price: 120, from: true, dur: 120 }, { key: "straehnen", price: 90, from: true, dur: 120 }] },
        { de: "Strähnen – ganzer Kopf", en: "Highlights – full head", v: [{ price: 200, from: true, dur: 120 }, { price: 180, from: true, dur: 90 }] },
        { de: "Balayage", en: "Balayage", v: [{ price: 250, from: true, dur: 150 }, { key: "balayage", price: 220, from: true, dur: 150 }] }
      ]
    },
    {
      id: "kinder", de: "Kinder", en: "Kids",
      items: [
        { key: "kinder", de: "Jungen – bis 12 Jahre", en: "Boys – up to 12", price: 15, dur: 30 },
        { de: "Mädchen – bis 12 Jahre", en: "Girls – up to 12", price: 20, from: true, dur: 30 },
        { de: "Mädchen – ab 13 Jahren", en: "Girls – 13 and over", price: 25, from: true, dur: 30 }
      ]
    },
    {
      id: "beauty", de: "Beauty", en: "Beauty",
      items: [
        { group: { de: "Make-up", en: "Make-up" } },
        { de: "Tages-Make-up", en: "Day make-up", price: 55, from: true, dur: 45 },
        { de: "Abend-Make-up", en: "Evening make-up", price: 85, from: true, dur: 90 },
        { group: { de: "Augenbrauen & Wimpern", en: "Brows & lashes" } },
        { de: "Augenbrauen zupfen", en: "Eyebrow plucking", price: 10, from: true, dur: 15 },
        { de: "Augenbrauen färben", en: "Eyebrow tint", price: 15, from: true, dur: 20 },
        { de: "Wimpern färben", en: "Lash tint", price: 15, from: true, dur: 20 },
        { de: "Zupfen + Brauen & Wimpern färben", en: "Plucking + brow & lash tint", price: 35, from: true, dur: 30 },
        { de: "Haarentfernung mit Faden – ganzes Gesicht", en: "Threading – full face", price: 35, from: true, dur: 30 },
        { group: { de: "Gesichtsbehandlungen", en: "Facials" } },
        { de: "Microneedling", en: "Microneedling", request: true, dur: 60 },
        { de: "BB Glow", en: "BB Glow", request: true, dur: 60 },
        { de: "Microdermabrasion", en: "Microdermabrasion", request: true, dur: 60 }
      ]
    },
    {
      id: "extensions", de: "Extensions & Keratin", en: "Extensions & keratin",
      items: [
        { de: "Haarverlängerung – Tressen-Methode", en: "Hair extensions – weft method", request: true, dur: 120 },
        { de: "Extensions hochsetzen", en: "Extension move-up", dDe: "Nach individuellen Wünschen", dEn: "Tailored to your wishes", request: true, dur: 20 },
        { de: "Tape-in-Extensions – 25 g", en: "Tape-in extensions – 25 g", price: 100, from: true, dur: 60 },
        { key: "keratin", de: "Keratinglättung (Brazilian Keratin)", en: "Keratin smoothing (Brazilian keratin)", dDe: "Seidenglattes Haar, weniger Frizz – hält mehrere Wochen", dEn: "Silky straight hair, less frizz – lasts several weeks", price: 160, from: true, dur: 180 }
      ]
    },
    {
      id: "beratung", de: "Beratung", en: "Consultation",
      noteDe: "Beratung auf Deutsch und Englisch.",
      noteEn: "Consultations in German and English.",
      items: [
        { de: "Persönliches Beratungsgespräch", en: "Personal consultation", request: true, dur: 15 },
        { de: "Kopfhautanalyse", en: "Scalp analysis", request: true, dur: 15 }
      ]
    },
    {
      id: "azubi", de: "Azubi-Modelltermine", en: "Trainee model appointments",
      noteDe: "Modelltermine bei Chauan, Azubi im 2. Lehrjahr: etwas mehr Zeit, deutlich kleinerer Preis.",
      noteEn: "Model appointments with Chauan, trainee in the 2nd year: a little more time, a much smaller price.",
      items: [
        { de: "Herrenhaarschnitt", en: "Men's haircut", price: 12, dur: 45 },
        { de: "Damenhaarschnitt – gerade", en: "Women's cut – blunt", price: 15, dur: 35 },
        { de: "Damenhaarschnitt – gestuft", en: "Women's cut – layered", price: 15, dur: 45 },
        { de: "Pony schneiden", en: "Fringe trim", price: 5, dur: 20 },
        { de: "Haare waschen & Blow-out", en: "Wash & blow-out", price: 20, dur: 35 },
        { de: "Ansatzfarbe", en: "Root colour", price: 25, from: true, dur: 90 },
        { de: "Tönung / Glossing", en: "Toning / glossing", price: 25, from: true, dur: 60 },
        { de: "Komplettfarbe", en: "Full colour", price: 60, from: true, dur: 180 },
        { de: "Balayage / Strähnen", en: "Balayage / highlights", price: 80, from: true, dur: 240 },
        { de: "Dauerwelle", en: "Perm", price: 45, from: true, dur: 90 },
        { de: "Keratinglättung", en: "Keratin smoothing", price: 160, from: true, dur: 240 },
        { de: "Olaplex-Aufbau", en: "Olaplex treatment", price: 20, from: true, dur: 60 },
        { de: "Augenbrauen zupfen & färben", en: "Brow plucking & tint", price: 15, dur: 20 },
        { de: "Augenbrauen zupfen", en: "Eyebrow plucking", price: 10, dur: 15 }
      ]
    }
  ],

  payment: null // z. B. ["Bar", "EC-Karte"] – [ZAHLUNGSARTEN]
};

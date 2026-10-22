/*
 * Zentrale Stammdaten für Master's Hair & Beauty.
 * Alle Preise, Dauern, Öffnungszeiten und Links werden NUR hier gepflegt.
 * `confirmed: false` bzw. `null` = noch nicht bestätigt → wird in der Vorschau
 * als Platzhalter markiert und nicht in strukturierte Daten übernommen.
 */
window.SITE = {
  // Platzhalter sichtbar markieren (vor Livegang auf false setzen)
  previewMarkers: true,

  name: "Master's Hair & Beauty",
  domain: null, // z. B. "https://www.mastershairundbeauty.de" – für canonical/OG eintragen
  timeZone: "Europe/Berlin",

  phone: { display: "089 68 58 47", href: "tel:+4989685847", confirmed: true }, // laut Wandschild im Salon
  email: { display: null, href: null }, // [E-MAIL]

  // Kandidat aus öffentlichem Verzeichnis – vor Livegang bestätigen
  address: {
    street: "Balanstraße 95",
    zip: "81539",
    city: "München",
    district: null, // [STADTTEIL]
    confirmed: false
  },

  links: {
    google: null, // [GOOGLE-PROFIL-URL]
    instagram: null
  },

  // Buchung: mode "embed" (Widget nach Klick laden), "link" (externer Tab) oder null (noch nicht verbunden)
  booking: {
    provider: null, // z. B. "Planity"
    mode: null,
    url: null, // echte Buchungs-URL
    embedUrl: null, // nur bei mode "embed"
    privacyAnchor: "#datenschutz"
  },

  // Wochenplan: 1 = Montag … 7 = Sonntag; Zeiten "HH:MM". Kandidat aus Verzeichnis, bestätigen!
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
  // Ausnahmen (Feiertage, Betriebsurlaub): { date: "YYYY-MM-DD", hours: null | ["HH:MM","HH:MM"], note: "…" }
  exceptions: [],

  // Preise in Euro, Dauer in Minuten. null = noch nicht bestätigt.
  services: {
    herren:      { price: null, from: true, duration: null },
    fade:        { price: null, from: true, duration: null },
    kinder:      { price: null, from: true, duration: null },
    bart:        { price: null, from: true, duration: null },
    damenKurz:   { price: null, from: true, duration: null },
    damenLang:   { price: null, from: true, duration: null },
    styling:     { price: null, from: true, duration: null },
    balayage:    { price: null, from: true, duration: null },
    straehnen:   { price: null, from: true, duration: null },
    coloration:  { price: null, from: true, duration: null },
    pflege:      { price: null, from: true, duration: null },
    paketHerren: { price: null, from: false, duration: null }
  },
  // Einstiegspreis im Hero = Leistung mit diesem Schlüssel
  heroPriceKey: "herren",
  heroDurationKey: "herren",

  payment: null // z. B. ["Bar", "EC-Karte"] – [ZAHLUNGSARTEN]
};

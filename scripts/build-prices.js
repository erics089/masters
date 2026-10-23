#!/usr/bin/env node
/*
 * Schreibt die deutsche Preisliste aus assets/js/data.js statisch in index.html
 * (zwischen <!-- PRICES:START --> und <!-- PRICES:END -->), damit sie auch ohne
 * JavaScript sichtbar ist. Aufruf: node scripts/build-prices.js
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["assets/js/data.js", "assets/js/prices.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
}

const html = ctx.window.MHB.renderPrices(ctx.window.SITE, "de");
const file = path.join(root, "index.html");
const src = fs.readFileSync(file, "utf8");
const re = /(<!-- PRICES:START -->)[\s\S]*?(<!-- PRICES:END -->)/;
if (!re.test(src)) {
  console.error("Marker <!-- PRICES:START --> / <!-- PRICES:END --> nicht gefunden.");
  process.exit(1);
}
fs.writeFileSync(file, src.replace(re, "$1\n" + html + "\n$2"));
console.log("Preisliste in index.html aktualisiert.");

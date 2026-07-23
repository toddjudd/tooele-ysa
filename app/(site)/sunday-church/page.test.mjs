import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

test("sunday church page renders required visitor information", () => {
  assert.match(source, /title:\s*["']Sunday Church — Tooele YSA Ward["']/);
  assert.match(source, /Sundays, 11:00 AM – 1:00 PM/);
  assert.match(source, /196 N Pinehurst Ave, Tooele, UT 84074/);
  assert.match(source, /href=\{directionsUrl\}/);
  assert.match(source, /target="_blank"/);
  assert.match(source, /rel="noopener noreferrer"/);
  assert.match(source, /aria-label="Get Directions to the Chapel \(opens in new tab\)"/);
  assert.match(source, /import Image from "next\/image"/);
  assert.match(source, /public", "images"/);
  assert.match(source, /\^floor-plan\\\./);
  assert.match(source, /Floor plan of the Tooele chapel showing room locations/);
});

test("sunday church page is ISR and fetches the sacrament program from the CMS", () => {
  // AD-2 reversed for this page: the weekly sacrament program is CMS-driven,
  // so the page is ISR (revalidate) and fetches from Sanity.
  assert.match(source, /export\s+const\s+revalidate\s*=\s*60/);
  assert.match(source, /sacramentProgramQuery/);
  assert.match(source, /client\.fetch/);
  assert.match(source, /hasSanityEnv/);
  // Guarded fetch must degrade gracefully when the CMS is unavailable.
  assert.match(source, /catch\s*\{[^}]*return null/s);
});

test("sunday church page preserves semantic heading and section-band structure", () => {
  assert.equal((source.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((source.match(/<h2\b/g) ?? []).length, 3);
  assert.match(source, />SUNDAY CHURCH</);
  assert.match(source, />SACRAMENT PROGRAM</);
  assert.match(source, />BUILDING GUIDE</);
  assert.match(source, />FIRST TIME\?</);
  assert.match(source, /text-headline-mobile md:text-headline/);
  assert.match(source, /py-section-v-mobile/);
  assert.match(source, /lg:py-section-v/);
});

test("sunday church page renders each sacrament program item type", () => {
  assert.match(source, /case "programHymn"/);
  assert.match(source, /case "programPrayer"/);
  assert.match(source, /case "programSpeaker"/);
  assert.match(source, /case "programMusicalNumber"/);
  assert.match(source, /Presiding/);
  assert.match(source, /Conducting/);
  assert.match(source, /program will be posted here soon/);
});

test("sunday church page includes building and first-time attendance guidance", () => {
  assert.match(source, /Floor plan image coming soon/);
  assert.match(source, /Relief Society/);
  assert.match(source, /Elders quorum/);
  assert.match(source, /Sunday School/);
  assert.match(source, /parking/i);
  assert.match(source, /YSA sacrament meeting/);
});

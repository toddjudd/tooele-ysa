import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

test("sunday church page is static and renders required visitor information", () => {
  assert.match(source, /title:\s*["']Sunday Church — Tooele YSA Ward["']/);
  assert.doesNotMatch(source, /export\s+const\s+revalidate/);
  assert.doesNotMatch(source, /groq|sanity|client\.fetch/i);
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

test("sunday church page preserves semantic heading and section-band structure", () => {
  assert.equal((source.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((source.match(/<h2\b/g) ?? []).length, 2);
  assert.match(source, />SUNDAY CHURCH</);
  assert.match(source, />BUILDING GUIDE</);
  assert.match(source, />FIRST TIME\?</);
  assert.match(source, /text-headline-mobile md:text-headline/);
  assert.match(source, /py-section-v-mobile/);
  assert.match(source, /lg:py-section-v/);
});

test("sunday church page includes building and first-time attendance guidance", () => {
  assert.match(source, /Floor plan image coming soon/);
  assert.match(source, /Relief Society/);
  assert.match(source, /Elders quorum/);
  assert.match(source, /Sunday School/);
  assert.match(source, /parking/i);
  assert.match(source, /YSA sacrament meeting/);
});

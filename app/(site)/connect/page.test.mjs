import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");
const root = join(import.meta.dirname, "..", "..", "..");

test("connect page is ISR and exposes the required page shell", () => {
  assert.match(source, /export\s+const\s+revalidate\s*=\s*60/);
  assert.match(source, /title:\s*["']Let(?:&apos;|')s Connect — Tooele YSA Ward["']/);
  assert.equal((source.match(/<h1\b/g) ?? []).length, 1);
  assert.match(source, />STAY CONNECTED</);
  assert.match(source, /text-headline-mobile md:text-headline/);
  assert.match(source, /py-section-v-mobile/);
  assert.match(source, /lg:py-section-v/);
  assert.doesNotMatch(source, /groq|client\.fetch|@\/lib\/sanity/i);
});

test("connect page renders active LDS app links and coming-soon social cards", () => {
  const expectedLinks = [
    "https://www.churchofjesuschrist.org/learn/mobile-applications/gospel-library?lang=eng",
    "https://www.churchofjesuschrist.org/youth/childrenandyouth/gospel-living-app?lang=eng",
    "https://www.churchofjesuschrist.org/tools/help/about-member-tools?lang=eng",
    "https://myinstitute.churchofjesuschrist.org/",
  ];

  for (const href of expectedLinks) {
    assert.match(source, new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(source, /grid-cols-2/);
  assert.match(source, /lg:grid-cols-4/);
  assert.match(source, /comingSoon=\{true\}/g);
  assert.match(source, /name:\s*"Instagram"/);
  assert.match(source, /name:\s*"Facebook"/);
  assert.match(source, /href="#"/);
});

test("connect page references all required app icon assets", () => {
  for (const fileName of [
    "gospel-library.svg",
    "gospel-living.svg",
    "member-tools.svg",
    "my-institute.svg",
    "instagram.svg",
    "facebook.svg",
  ]) {
    assert.match(source, new RegExp(`/images/app-icons/${fileName}`));
    assert.equal(existsSync(join(root, "public", "images", "app-icons", fileName)), true);
  }
});

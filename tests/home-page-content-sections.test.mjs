import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));

test("HomeContentSection renders reusable Sanity-backed image and empty states", () => {
  assert.ok(exists("components/home-content-section.tsx"));

  const section = read("components/home-content-section.tsx");

  assert.match(section, /from "@\/components\/sanity-image"/);
  assert.match(section, /type HomeContentSectionProps/);
  assert.match(section, /backgroundImage\?/);
  assert.match(section, /eyebrow\?/);
  assert.match(section, /heading\?/);
  assert.match(section, /body\?/);
  assert.match(section, /bg-surface-warm/);
  assert.match(section, /bg-primary\/45/);
  assert.match(section, /text-section-label/);
  assert.match(section, /text-headline-mobile/);
  assert.match(section, /md:text-headline/);
  assert.match(section, /text-body-lg/);
  assert.match(section, /max-w-container-max/);
  assert.match(section, /py-section-v-mobile/);
  assert.match(section, /lg:py-section-v/);
  assert.match(section, /aria-label/);
});

test("Home page fetches both content sections independently and renders join us block", () => {
  const page = read("app/(site)/page.tsx");

  assert.match(page, /from "@\/components\/home-content-section"/);
  assert.match(page, /homeSectionTopQuery/);
  assert.match(page, /homeSectionBottomQuery/);
  assert.match(page, /HomeSectionTopQueryResult/);
  assert.match(page, /HomeSectionBottomQueryResult/);
  assert.match(page, /getHomeSectionTop/);
  assert.match(page, /getHomeSectionBottom/);
  assert.match(page, /client\.fetch\(homeSectionTopQuery\)/);
  assert.match(page, /client\.fetch\(homeSectionBottomQuery\)/);
  assert.match(page, /catch\s*{/);
  assert.match(page, /return null/);
  assert.match(page, /Promise\.all/);
  assert.match(page, /<Hero heroImage=\{heroImage\} \/>/);
  assert.match(page, /<HomeContentSection/);
  assert.match(page, /Sundays, 11:00 AM – 1:00 PM/);
  assert.match(page, /href="\/gatherings"/);
  assert.match(page, /https:\/\/maps\.app\.goo\.gl\/s6kaRrALfUj1PGRU7/);
  assert.match(page, /target="_blank"/);
  assert.match(page, /rel="noopener noreferrer"/);
});

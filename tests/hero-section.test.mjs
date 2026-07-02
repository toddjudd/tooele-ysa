import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));

test("Hero component renders the required static 0/1 image states", () => {
  assert.ok(exists("components/hero.tsx"));

  const hero = read("components/hero.tsx");

  assert.match(hero, /from "@\/components\/sanity-image"/);
  assert.match(hero, /role="region"/);
  assert.match(hero, /aria-label="Hero"/);
  assert.match(hero, /min-h-\[85vh\]/);
  assert.match(hero, /md:min-h-screen/);
  assert.match(hero, /bg-primary/);
  assert.match(hero, /bg-primary\/45/);
  assert.match(hero, /object-cover/);
  assert.match(hero, /sizes="100vw"/);
  assert.match(hero, /TOOELE YSA WARD/);
  assert.match(hero, /<h1[^>]*>[\s\S]*Together in Christ[\s\S]*<\/h1>/);
  assert.match(hero, /text-display-mobile/);
  assert.match(hero, /md:text-display/);
});

test("Hero buttons use the required external link contract and visual styles", () => {
  const hero = read("components/hero.tsx");

  assert.match(hero, /https:\/\/maps\.app\.goo\.gl\/s6kaRrALfUj1PGRU7/);
  assert.match(hero, /aria-label="Get Directions to the Chapel"/);
  assert.match(hero, /https:\/\/www\.churchofjesuschrist\.org\/welcome\/meet-with-missionaries\?lang=eng/);
  assert.match(hero, /target="_blank"/);
  assert.match(hero, /rel="noopener noreferrer"/);
  assert.match(hero, /bg-accent-rust/);
  assert.match(hero, /text-on-accent-rust/);
  assert.match(hero, /hover:bg-\[#8f3f23\]/);
  assert.match(hero, /border-2 border-on-primary/);
  assert.match(hero, /hover:bg-white\/\[0\.08\]/);
  assert.match(hero, /min-h-11/);
  assert.match(hero, /text-cta/);
});

test("Home page fetches hero image through ISR with graceful fallback", () => {
  const page = read("app/(site)/page.tsx");

  assert.match(page, /export const revalidate = 60/);
  assert.match(page, /title:\s*"Tooele YSA Ward"/);
  assert.match(page, /from "@\/components\/hero"/);
  assert.match(page, /import\("@\/lib\/sanity\/client"\)/);
  assert.match(page, /from "@\/lib\/sanity\/queries"/);
  assert.match(page, /heroImageQuery/);
  assert.match(page, /try\s*{/);
  assert.match(page, /process\.env\.NEXT_PUBLIC_SANITY_PROJECT_ID/);
  assert.match(page, /process\.env\.NEXT_PUBLIC_SANITY_DATASET/);
  assert.match(page, /client\.fetch\(heroImageQuery\)/);
  assert.match(page, /catch\s*{/);
  assert.match(page, /return null/);
  assert.match(page, /<Hero heroImage=\{heroImage\} \/>/);
});

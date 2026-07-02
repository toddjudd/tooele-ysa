import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));

test("LeaderCard component matches the required card and contact-link contract", () => {
  assert.ok(exists("components/leader-card.tsx"));

  const component = read("components/leader-card.tsx");

  assert.match(component, /export function LeaderCard/);
  assert.match(component, /name: string/);
  assert.match(component, /title: string/);
  assert.match(component, /phone\?: string \| null/);
  assert.match(component, /email\?: string \| null/);
  assert.match(component, /bg-surface border border-border p-stack-md/);
  assert.match(component, /text-section-label/);
  assert.match(component, /tracking-\[0\.14em\]/);
  assert.match(component, /text-primary/);
  assert.match(component, /text-body-sm text-on-surface-muted/);
  assert.match(component, /href=\{`tel:\$\{phone\}`\}/);
  assert.match(component, /aria-label=\{`Call \$\{name\}: \$\{phone\}`\}/);
  assert.match(component, /href=\{`mailto:\$\{email\}`\}/);
  assert.match(component, /aria-label=\{`Email \$\{name\}`\}/);
  assert.match(component, /flex min-h-11 items-center text-accent-rust/);
  assert.match(component, /transition-colors hover:text-accent-teal/);
  assert.match(component, /\{phone && \(/);
  assert.match(component, /\{email && \(/);
  assert.doesNotMatch(component, /N\/A|placeholder/i);
  assert.doesNotMatch(component, /rounded/);
});

test("About page fetches leader cards through ISR and renders accessible directory states", () => {
  const page = read("app/(site)/about/page.tsx");

  assert.match(page, /export const revalidate = 60/);
  assert.match(page, /title:\s*"About Us — Tooele YSA Ward"/);
  assert.match(page, /from "@\/components\/leader-card"/);
  assert.match(page, /leaderCardsQuery/);
  assert.match(page, /LeaderCardsQueryResult/);
  assert.match(page, /process\.env\.NEXT_PUBLIC_SANITY_PROJECT_ID/);
  assert.match(page, /process\.env\.NEXT_PUBLIC_SANITY_DATASET/);
  assert.match(page, /import\("@\/lib\/sanity\/client"\)/);
  assert.match(page, /client\.fetch\(leaderCardsQuery\)/);
  assert.match(page, /try\s*{/);
  assert.match(page, /catch\s*{/);
  assert.match(page, /return \[\]/);
  assert.match(page, /<h1 id="about-heading"/);
  assert.match(page, /<h2 id="leadership-heading"/);
  assert.match(page, /ABOUT US/);
  assert.match(page, /OUR LEADERSHIP/);
  assert.match(page, /grid grid-cols-1 gap-stack-md sm:grid-cols-2 lg:grid-cols-3/);
  assert.match(page, /Leadership information will be added soon\./);
  assert.match(page, /text-body text-on-surface-muted/);
});

test("leaderCardsQuery fetches ordered leadership fields only", () => {
  const queries = read("lib/sanity/queries.ts");

  assert.match(queries, /export const leaderCardsQuery = defineQuery/);
  assert.match(queries, /\*\[_type == "leaderCard"\] \| order\(displayOrder asc\)/);
  ["_id", "name", "title", "phone", "email", "displayOrder"].forEach((field) => {
    assert.match(queries, new RegExp(`\\b${field}\\b`));
  });
});

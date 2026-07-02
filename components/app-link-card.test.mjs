import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("./app-link-card.tsx", import.meta.url), "utf8");

test("app link card exposes the required props and active external-link behavior", () => {
  assert.match(source, /name:\s*string/);
  assert.match(source, /href:\s*string/);
  assert.match(source, /icon:\s*React\.ReactNode/);
  assert.match(source, /comingSoon\?:\s*boolean/);
  assert.match(source, /aria-label=\{`Open \$\{name\}`\}/);
  assert.match(source, /<span\s+className="sr-only">\(opens in new tab\)<\/span>/);
  assert.match(source, /target=\{comingSoon \? undefined : "_blank"\}/);
  assert.match(source, /rel=\{comingSoon \? undefined : "noopener noreferrer"\}/);
});

test("app link card uses the required visual tokens and accessibility affordances", () => {
  assert.match(source, /bg-primary/);
  assert.match(source, /hover:bg-\[#0d4549\]/);
  assert.match(source, /text-on-primary/);
  assert.match(source, /text-accent-teal/);
  assert.match(source, /px-6/);
  assert.match(source, /py-5/);
  assert.match(source, /min-h-11/);
  assert.match(source, /focus-visible:ring-2/);
  assert.doesNotMatch(source, /rounded-(?!full)/);
});

test("app link card renders a muted coming-soon variant without external-link behavior", () => {
  assert.match(source, /if \(comingSoon\)/);
  assert.match(source, /aria-label=\{`\$\{name\} coming soon`\}/);
  assert.match(source, /aria-disabled="true"/);
  assert.doesNotMatch(source, /href=\{comingSoon \? "#" : href\}/);
  assert.doesNotMatch(source, /tabIndex=\{comingSoon \? -1 : undefined\}/);
  assert.match(source, /Coming Soon/);
  assert.match(source, /rounded-full/);
  assert.match(source, /opacity-/);
  assert.doesNotMatch(source, /pointer-events-none/);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const componentSource = readFileSync(new URL("../components/missionaries-block.tsx", import.meta.url), "utf8");
const pageSource = readFileSync(new URL("../app/(site)/about/page.tsx", import.meta.url), "utf8");

test("MissionariesBlock is static and exposes the required contact actions", () => {
  assert.match(componentSource, /export function MissionariesBlock\(/);
  assert.match(componentSource, /OUR MISSIONARIES/);
  assert.match(componentSource, /MEET WITH MISSIONARIES/);
  assert.match(componentSource, /href=\{`tel:\$\{MISSIONARY_PHONE_TEL\}`\}/);
  assert.match(componentSource, /aria-label=\{`Call Tooele Missionaries: \$\{MISSIONARY_PHONE\}`\}/);
  assert.match(
    componentSource,
    /https:\/\/www\.churchofjesuschrist\.org\/welcome\/meet-with-missionaries\?lang=eng/,
  );
  assert.match(componentSource, /target="_blank"/);
  assert.match(componentSource, /rel="noopener noreferrer"/);
  assert.match(componentSource, /<span className="sr-only"> \(opens in new tab\)<\/span>/);
  assert.doesNotMatch(componentSource, /aria-label="Meet With Missionaries/);
  assert.doesNotMatch(componentSource, /@\/lib\/sanity|client\.fetch|groq/i);
});

test("MissionariesBlock keeps required styling and accessibility guardrails", () => {
  assert.match(componentSource, /bg-accent-rust/);
  assert.match(componentSource, /text-on-accent-rust/);
  assert.match(componentSource, /px-\[32px\]/);
  assert.match(componentSource, /py-\[14px\]/);
  assert.match(componentSource, /hover:bg-\[#8f3f23\]/);
  assert.match(componentSource, /rounded-none/);
  assert.match(componentSource, /text-cta/);
  assert.match(componentSource, /min-h-\[44px\]/);
  assert.match(componentSource, /sr-only/);
  assert.doesNotMatch(componentSource, /Elder|Sister|President\s+[A-Z]/);
});

test("About page assembles identity, leadership, and missionaries in order", () => {
  assert.match(pageSource, /export const revalidate = 60/);
  assert.match(pageSource, /title:\s*"About Us — Tooele YSA Ward"/);
  assert.match(pageSource, /import \{ MissionariesBlock \}/);

  const h1Index = pageSource.indexOf("<h1");
  const leadershipIndex = pageSource.indexOf("OUR LEADERSHIP");
  const missionariesIndex = pageSource.indexOf("<MissionariesBlock />");

  assert.ok(h1Index > -1, "page should have one h1");
  assert.equal(pageSource.match(/<h1/g)?.length, 1);
  assert.ok(leadershipIndex > h1Index, "leadership section follows page h1");
  assert.ok(missionariesIndex > leadershipIndex, "missionaries section follows leadership");
});

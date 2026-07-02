import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const exists = (path) => existsSync(join(root, path));

test("Sanity dependencies and scripts are configured", () => {
  const pkg = JSON.parse(read("package.json"));

  assert.match(pkg.dependencies["next-sanity"], /^(\^|~)?13(\.|$)/);
  assert.match(pkg.dependencies["@sanity\/image-url"], /^(\^|~)?2(\.|$)/);
  assert.ok(pkg.dependencies.sanity);
  assert.ok(pkg.dependencies["@sanity\/vision"]);
  assert.equal(pkg.scripts.typegen, "sanity schema extract --enforce-required-fields && sanity typegen generate");
});

test("embedded Studio route and config use environment-backed Sanity auth", () => {
  assert.ok(exists("sanity.config.ts"));
  assert.ok(exists("sanity.cli.ts"));
  assert.ok(exists("app/studio/[[...tool]]/page.tsx"));
  assert.ok(!exists("middleware.ts"));

  const config = read("sanity.config.ts");
  const env = read("lib/sanity/env.ts");
  const studioPage = read("app/studio/[[...tool]]/page.tsx");
  const studioComponent = read("app/studio/[[...tool]]/studio.tsx");

  assert.match(config, /sanityConfig\.projectId/);
  assert.match(config, /sanityConfig\.dataset/);
  assert.match(env, /process\.env\.NEXT_PUBLIC_SANITY_PROJECT_ID/);
  assert.match(env, /process\.env\.NEXT_PUBLIC_SANITY_DATASET/);
  assert.match(config, /schemaTypes/);
  assert.match(config, /visionTool\(\)/);
  assert.match(studioPage, /<Studio\s*\/?>/);
  assert.match(studioComponent, /"use client"/);
  assert.match(studioComponent, /NextStudio/);
  assert.match(studioComponent, /config=\{config\}/);
});

test("Sanity client, image builder, and queries are centralized", () => {
  assert.ok(exists("lib/sanity/client.ts"));
  assert.ok(exists("lib/sanity/env.ts"));
  assert.ok(exists("lib/sanity/image.ts"));
  assert.ok(exists("lib/sanity/queries.ts"));
  assert.ok(exists("components/sanity-image.tsx"));

  const client = read("lib/sanity/client.ts");
  const env = read("lib/sanity/env.ts");
  const image = read("lib/sanity/image.ts");
  const queries = read("lib/sanity/queries.ts");
  const wrapper = read("components/sanity-image.tsx");

  assert.match(client, /createClient\(/);
  assert.match(client, /apiVersion:\s*"2026-07-01"/);
  assert.match(client, /useCdn:\s*true/);
  assert.match(client, /perspective:\s*"published"/);
  assert.match(client, /sanityConfig\.projectId/);
  assert.match(client, /sanityConfig\.dataset/);
  assert.match(env, /process\.env\.NEXT_PUBLIC_SANITY_PROJECT_ID/);
  assert.match(env, /process\.env\.NEXT_PUBLIC_SANITY_DATASET/);
  assert.match(env, /NEXT_PUBLIC_SANITY_PROJECT_ID is required/);
  assert.match(env, /NEXT_PUBLIC_SANITY_DATASET is required/);

  assert.match(image, /createImageUrlBuilder/);
  assert.match(image, /process\.env\.NEXT_PUBLIC_SANITY_PROJECT_ID/);
  assert.match(image, /process\.env\.NEXT_PUBLIC_SANITY_DATASET/);
  assert.match(image, /\.image\(source\)/);

  [
    "heroImageQuery",
    "homeSectionTopQuery",
    "homeSectionBottomQuery",
    "leaderCardsQuery",
    "upcomingEventsQuery",
  ].forEach((queryName) => assert.match(queries, new RegExp(`export const ${queryName}`)));
  assert.match(queries, /dateTime\s*>=\s*now\(\)/);
  assert.match(queries, /order\(displayOrder asc\)/);
  assert.match(queries, /order\(dateTime asc\)\[0\.\.\.20\]/);

  assert.match(wrapper, /from "next\/image"/);
  assert.match(wrapper, /loader=/);
  assert.match(wrapper, /\.format\("webp"\)/);
  assert.match(wrapper, /\.quality\(80\)/);
  assert.match(wrapper, /sizes=\{sizes\}/);
  assert.doesNotMatch(wrapper, /unoptimized/);
});

test("Sanity schema types match the CMS content contract", () => {
  [
    "sanity/schema-types/hero-image.ts",
    "sanity/schema-types/home-section-top.ts",
    "sanity/schema-types/home-section-bottom.ts",
    "sanity/schema-types/leader-card.ts",
    "sanity/schema-types/ward-event.ts",
    "sanity/schema-types/index.ts",
  ].forEach((path) => assert.ok(exists(path), `${path} should exist`));

  const hero = read("sanity/schema-types/hero-image.ts");
  const top = read("sanity/schema-types/home-section-top.ts");
  const bottom = read("sanity/schema-types/home-section-bottom.ts");
  const leader = read("sanity/schema-types/leader-card.ts");
  const event = read("sanity/schema-types/ward-event.ts");
  const index = read("sanity/schema-types/index.ts");

  assert.match(hero, /name:\s*"heroImage"/);
  assert.match(hero, /type:\s*"image"/);
  assert.match(hero, /hotspot:\s*true/);
  assert.match(hero, /title:\s*"Hero Image"/);

  [top, bottom].forEach((source) => {
    assert.match(source, /title:\s*"Background Image"/);
    assert.match(source, /title:\s*"Eyebrow Text"/);
    assert.match(source, /title:\s*"Section Heading"/);
    assert.match(source, /title:\s*"Body Text"/);
    assert.match(source, /hotspot:\s*true/);
  });

  assert.match(leader, /name:\s*"leaderCard"/);
  assert.match(leader, /title:\s*"Display Order"/);
  assert.match(leader, /rule\.required\(\)/);

  assert.match(event, /name:\s*"wardEvent"/);
  assert.match(event, /type:\s*"datetime"/);
  assert.doesNotMatch(event, /type:\s*"date"/);

  ["heroImage", "homeSectionTop", "homeSectionBottom", "leaderCard", "wardEvent"].forEach((typeName) =>
    assert.match(index, new RegExp(typeName)),
  );
});

test("Sanity type generation outputs the configured project types file", () => {
  assert.ok(exists("lib/types.ts"));

  const cli = read("sanity.cli.ts");
  const types = read("lib/types.ts");

  assert.match(cli, /generates:\s*"\.\/lib\/types\.ts"/);
  assert.match(cli, /path:\s*"\.\/\*\*\/\*\.\{ts,tsx\}"/);
  assert.match(types, /export type HeroImage/);
  assert.match(types, /export type LeaderCard/);
  assert.match(types, /export type WardEvent/);
});

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

test("Next App Router scaffold uses strict TypeScript and Next 16", () => {
  const pkg = JSON.parse(read("package.json"));
  const tsconfig = JSON.parse(read("tsconfig.json"));

  assert.match(pkg.dependencies.next, /^16\./);
  assert.equal(tsconfig.compilerOptions.strict, true);
  assert.ok(existsSync(join(root, "app", "layout.tsx")));
  assert.ok(existsSync(join(root, "app", "(site)", "layout.tsx")));
  assert.ok(existsSync(join(root, "app", "(site)", "page.tsx")));
});

test("Tailwind v4 tokens are declared in globals.css without a Tailwind config", () => {
  const css = read("app/globals.css");
  const rootFiles = existsSync(root) ? readdirSync(root) : [];

  assert.match(css, /@import\s+"tailwindcss"/);
  assert.match(css, /@theme\s*\{/);
  assert.ok(!rootFiles.some((file) => /^tailwind\.config\.(js|mjs|ts|cjs)$/.test(file)));

  [
    "surface",
    "surface-warm",
    "on-surface",
    "on-surface-muted",
    "border",
    "primary",
    "on-primary",
    "accent-rust",
    "on-accent-rust",
    "accent-teal",
    "on-accent-teal",
    "accent-olive",
    "on-accent-olive",
    "accent-amber",
    "on-accent-amber",
    "accent-sand",
    "on-accent-sand",
    "accent-blush",
    "on-accent-blush",
    "accent-crimson",
    "on-accent-crimson",
  ].forEach((token) => assert.match(css, new RegExp(`--color-${token}:`)));

  [
    "display",
    "display-mobile",
    "headline",
    "headline-mobile",
    "section-label",
    "body-lg",
    "body",
    "body-sm",
    "cta",
  ].forEach((token) => assert.match(css, new RegExp(`--text-${token}:`)));

  [
    "section-v",
    "section-v-mobile",
    "container-max",
    "container-px",
    "container-px-lg",
    "stack-sm",
    "stack-md",
    "stack-lg",
    "stack-xl",
  ].forEach((token) => assert.match(css, new RegExp(`--spacing-${token}:`)));

  assert.match(css, /--radius:\s*0px/);
  ["sm", "md", "lg"].forEach((token) =>
    assert.match(css, new RegExp(`--radius-${token}:\\s*0px`)),
  );
  assert.match(css, /--radius-full:\s*9999px/);
});

test("Montserrat is loaded through next/font with only the approved weights", () => {
  const layout = read("app/layout.tsx");
  const css = read("app/globals.css");

  assert.match(layout, /import\s+\{\s*Montserrat\s*\}\s+from\s+"next\/font\/google"/);
  assert.match(layout, /weight:\s*\["400",\s*"700",\s*"800",\s*"900"\]/);
  assert.doesNotMatch(layout, /"500"|"600"/);
  assert.match(layout, /<body\s+className=\{`\$\{montserrat\.className\} \$\{montserrat\.variable\}`\}>/);
  assert.match(css, /--font-sans:\s*var\(--font-montserrat\)/);
});

test("environment example and gitignore expose only the required env contract", () => {
  assert.equal(
    read(".env.example").trim(),
    [
      "SANITY_API_READ_TOKEN=",
      "SANITY_API_WRITE_TOKEN=",
      "NEXT_PUBLIC_SANITY_PROJECT_ID=",
      "NEXT_PUBLIC_SANITY_DATASET=",
      "NEXT_PUBLIC_SANITY_STUDIO_URL=",
    ].join("\n"),
  );

  assert.match(read(".gitignore"), /^\.env\.local$/m);
});

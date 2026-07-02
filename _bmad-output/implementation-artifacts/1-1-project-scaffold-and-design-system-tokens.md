---
baseline_commit: a1a4e8d2175169875046c31558e044578a576f5f
---

# Story 1.1: Project Scaffold & Design System Tokens

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the Next.js App Router project scaffolded with Tailwind v4 CSS-first configuration and all DESIGN.md tokens implemented,
so that all subsequent pages and components build on a consistent, production-ready foundation.

## Acceptance Criteria

1. **Given** a fresh project directory **When** the scaffold is complete **Then** Next.js App Router project is initialized with TypeScript strict mode
2. **And** `globals.css` contains `@import "tailwindcss"` and a `@theme {}` block with all 15 DESIGN.md colors, 8 typography roles, spacing scale, and zero border-radius defaults
3. **And** Montserrat loaded in weights 400, 700, 800, 900 only via `next/font/google`
4. **And** Root `layout.tsx` applies font and globals.css
5. **And** `.env.example` committed with all 4 required env var names (`SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_STUDIO_URL`)
6. **And** `tsconfig.json` has `"strict": true`
7. **And** Project runs with `pnpm dev` without errors

## Tasks / Subtasks

- [x] Task 1: Scaffold Next.js App Router project (AC: #1, #6)
  - [x] Run `pnpm create next-app@latest` with App Router, TypeScript, Tailwind CSS, pnpm
  - [x] Verify `tsconfig.json` has `"strict": true` — add if not present
  - [x] Remove all default boilerplate (default page content, default styles, placeholder images)
  - [x] Verify Next.js 16.x is installed (not 15.x — see version notes below)
- [x] Task 2: Configure Tailwind v4 CSS-first design tokens (AC: #2)
  - [x] In `app/globals.css`, ensure `@import "tailwindcss"` is present
  - [x] Add `@theme {}` block with ALL 15 colors from DESIGN.md (see token reference below)
  - [x] Add ALL 8 typography role tokens to `@theme {}`
  - [x] Add ALL spacing tokens to `@theme {}`
  - [x] Add border-radius tokens (all `0px` except `full: 9999px`)
  - [x] DO NOT create a `tailwind.config.ts` — Tailwind v4 uses CSS-first config only
- [x] Task 3: Load Montserrat font (AC: #3, #4)
  - [x] Import Montserrat from `next/font/google` with subsets `['latin']` and weights `['400', '700', '800', '900']` only
  - [x] Apply font class to `<body>` in root `app/layout.tsx`
  - [x] Set font-family CSS variable in globals.css for Tailwind to consume
- [x] Task 4: Create root layout structure (AC: #4)
  - [x] `app/layout.tsx` — root layout with `<html>`, `<body>`, globals.css import, font application
  - [x] Create `app/(site)/layout.tsx` — public route group layout (placeholder for nav/footer shell in Story 1.3)
  - [x] Create `app/(site)/page.tsx` — Home page placeholder
- [x] Task 5: Environment configuration (AC: #5)
  - [x] Create `.env.example` with var names only: `SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_STUDIO_URL`
  - [x] Ensure `.env.local` is in `.gitignore`
- [x] Task 6: Verify clean build (AC: #7)
  - [x] Run `pnpm dev` and confirm no errors
  - [x] Run `pnpm build` and confirm clean build

## Dev Notes

### Critical Version Information

The architecture was authored with Next.js 15.x assumptions, but **live registry shows Next.js 16.x is current** (16.2.10 at architecture review time). `create-next-app@latest` will scaffold 16.x. Use it.

**Version verification findings (from architecture review):**
- **Next.js:** Use 16.x (not 15.x). Verify `export const revalidate` segment config API works the same in 16.x.
- **Tailwind CSS:** 4.x confirmed. CSS-first config only — NO `tailwind.config.ts` file.
- **TypeScript:** 5.x

[Source: architecture/reviews/review-version-verifier.md — F-1, F-4]

### Tailwind v4 CSS-First Configuration

Tailwind v4's defining feature is CSS-first configuration. There is NO `tailwind.config.js/ts` in a v4 project.

- All tokens go in `@theme {}` blocks inside `globals.css`
- `@import "tailwindcss"` replaces the old `@tailwind base/components/utilities` directives
- Check whether `@tailwindcss/postcss` or `@tailwindcss/vite` is the integration path for Next.js 16 + Tailwind 4

[Source: ARCHITECTURE-SPINE.md — AD-8; review-version-verifier.md — F-4]

### Complete Token Reference for `@theme {}`

**Colors (15 named colors):**
```
surface: #FAFAF8
surface-warm: #F3EDE3
on-surface: #111111
on-surface-muted: #5a5550
border: #d6cfc6
primary: #092f33
on-primary: #FFFFFF
accent-rust: #af5031
on-accent-rust: #FFFFFF
accent-teal: #7fc7cc
on-accent-teal: #092f33
accent-olive: #4b5b34
on-accent-olive: #FFFFFF
accent-amber: #ed8913
on-accent-amber: #092f33
accent-sand: #e4cba9
on-accent-sand: #092f33
accent-blush: #fdaba5
on-accent-blush: #092f33
accent-crimson: #980204
on-accent-crimson: #FFFFFF
```

**Typography roles (8 roles — all Montserrat):**
| Role | Size | Weight | Line Height | Letter Spacing | Transform |
|------|------|--------|-------------|----------------|-----------|
| display | 56px | 900 | 1.0 | 0.02em | uppercase |
| display-mobile | 34px | 900 | 1.05 | 0.02em | uppercase |
| headline | 30px | 800 | 1.1 | 0.01em | uppercase |
| headline-mobile | 22px | 800 | 1.15 | 0.01em | uppercase |
| section-label | 12px | 700 | 1.4 | 0.14em | uppercase |
| body-lg | 18px | 400 | 1.75 | — | — |
| body | 16px | 400 | 1.7 | — | — |
| body-sm | 14px | 400 | 1.6 | — | — |
| cta | 13px | 700 | 1 | 0.1em | uppercase |

**Spacing:**
```
section-v: 88px
section-v-mobile: 56px
container-max: 1100px
container-px: 20px
container-px-lg: 48px
stack-sm: 16px
stack-md: 24px
stack-lg: 40px
stack-xl: 64px
```

**Border radius:**
```
DEFAULT: 0px
sm: 0px
md: 0px
lg: 0px
full: 9999px (pill badges only)
```

[Source: DESIGN.md — colors, typography, spacing, rounded sections]

### Project Structure Notes

Follow this directory structure exactly — it is the architectural seed:

```
tooele-ysa/
  app/
    (site)/                       # Public route group
      layout.tsx                  # Will hold SiteNav + Footer (Story 1.3)
      page.tsx                    # Home / (placeholder for now)
    layout.tsx                    # Root layout: <html>, globals.css, font
    globals.css                   # @import "tailwindcss"; @theme { tokens }
  components/                     # Empty dir — populated in later stories
  lib/
    sanity/                       # Empty dir — populated in Story 1.2
  sanity/
    schema-types/                 # Empty dir — populated in Story 1.2
  public/
    images/                       # Empty dir — static assets added later
  .env.example
  next.config.ts
```

[Source: ARCHITECTURE-SPINE.md — Structural Seed]

### Anti-Pattern Prevention

- **DO NOT** create `tailwind.config.ts` — Tailwind v4 is CSS-first only (AD-8)
- **DO NOT** install any component library (shadcn, MUI, Radix) — all UI is hand-composed Tailwind (AD-8)
- **DO NOT** load Montserrat weights 500 or 600 — only 400, 700, 800, 900 (DESIGN.md)
- **DO NOT** commit `.env.local` — only `.env.example` with var names
- **DO NOT** add any page content beyond minimal placeholders — content comes in later stories

### References

- [Source: ARCHITECTURE-SPINE.md — Full document, especially AD-8, AD-11, Structural Seed]
- [Source: DESIGN.md — colors, typography, spacing, rounded sections]
- [Source: architecture/reviews/review-version-verifier.md — F-1 (Next.js 16), F-4 (Tailwind v4 CSS-first)]
- [Source: PRD addendum — Tech Stack Decisions]

## Dev Agent Record

### Review Findings

- [x] [Review][Patch] Default border-radius token used config-style name instead of Tailwind v4 CSS token [app/globals.css:72]

### Agent Model Used

github-copilot/gpt-5.5

### Debug Log References

- `python3 _bmad/scripts/resolve_customization.py --skill .agents/skills/bmad-dev-story --key workflow` failed because `python3` is unavailable in this environment; workflow customization was resolved manually from `customize.toml` and missing project/user overrides.
- `pnpm create next-app@latest . --ts --tailwind --app --use-pnpm --eslint --empty --disable-git --yes` refused to scaffold into the non-empty repo, so the same scaffold command was run in `C:\Users\todd\AppData\Local\Temp\opencode\tooele-ysa-next-scaffold` and the required files were applied to this workspace.
- Red phase: `pnpm test` failed before implementation because `tsconfig.json`, `app/globals.css`, `app/layout.tsx`, and `.env.example` were missing.
- Green/refactor validation: `pnpm test`, `pnpm lint`, `pnpm build`, and a `pnpm dev` smoke test all passed.

### Completion Notes List

- Scaffolded a Next.js 16.2.10 App Router project with TypeScript strict mode, pnpm scripts, ESLint, PostCSS, and Tailwind 4 CSS-first setup.
- Added `app/globals.css` with `@import "tailwindcss"`, the required color, typography, spacing, and zero-radius design tokens, without adding a Tailwind config file.
- Loaded Montserrat via `next/font/google` using only weights 400, 700, 800, and 900, and applied both the font class and CSS variable at the root body.
- Added root and public route-group layouts plus a minimal home placeholder, removing create-next-app boilerplate content.
- Added `.env.example`, `.gitignore` env protections, placeholder architecture directories, and guardrail tests covering the scaffold contract.
- Verified `pnpm test`, `pnpm lint`, `pnpm build`, and `pnpm dev` smoke test (`GET /` returned 200).

### File List

- `.env.example`
- `.gitignore`
- `_bmad-output/implementation-artifacts/1-1-project-scaffold-and-design-system-tokens.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `app/(site)/layout.tsx`
- `app/(site)/page.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `components/.gitkeep`
- `eslint.config.mjs`
- `lib/sanity/.gitkeep`
- `next-env.d.ts`
- `next.config.ts`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `postcss.config.mjs`
- `public/images/.gitkeep`
- `sanity/schema-types/.gitkeep`
- `tests/scaffold.test.mjs`
- `tsconfig.json`

### Change Log

- 2026-07-02: Implemented Story 1.1 scaffold, design-system tokens, font setup, env contract, guardrail tests, and validation checks.

---
baseline_commit: a1a4e8d2175169875046c31558e044578a576f5f
---

# Story 2.1: Gatherings Page — Meeting Info, Map & Attendance Guide

Status: done

## Story

As a visitor,
I want to see the meeting time, chapel address, directions, building layout, classroom assignments, and what to expect as a first-timer — all on one page,
So that I have everything I need to attend a Sunday meeting without asking anyone.

## Acceptance Criteria

1. **Given** a visitor navigates to `/gatherings`, **When** the page loads, **Then** they see a clearly labeled section displaying "Sundays, 11:00 AM – 1:00 PM" and "196 N Pinehurst Ave, Tooele, UT 84074" as rendered, search-engine-crawlable text.

2. **Given** a visitor views the map section, **When** they tap/click the "Get Directions to the Chapel" button, **Then** Google Maps opens in a new tab to `https://maps.app.goo.gl/s6kaRrALfUj1PGRU7` with `target="_blank" rel="noopener noreferrer"` and an accessible label.

3. **Given** a visitor scrolls to the building section, **When** they view the building layout, **Then** a static image from `public/images/floor-plan.*` renders with a descriptive `alt` attribute. **And** A classroom assignment list is present as readable, accessible text adjacent to or below the image.

4. **Given** a first-time visitor, **When** they view the attendance section, **Then** they see practical notes including parking guidance and a brief expectation-setting paragraph about attending a YSA sacrament meeting.

5. Page uses SSG — no `revalidate` export, no GROQ call (AD-2).

6. Page follows the section-band pattern: each section opens with eyebrow → headline → body content (UX-DR5).

7. Primary button styled per UX-DR6 (accent-rust, zero radius, cta font). Ghost button variant used where appropriate on light background sections (button-ghost-dark).

8. Page `<title>` is "Gatherings — Tooele YSA Ward".

9. Semantic heading order maintained — one `<h1>`, section headings as `<h2>`.

10. All content renders correctly at 375px viewport and up (NFR-6).

11. Minimum 44×44px tap targets on all interactive elements.

## Tasks / Subtasks

- [x] Task 1: Create the Gatherings route file (AC: #5, #8, #9)
  - [x] Create `app/(site)/gatherings/page.tsx`
  - [x] Set page metadata: `<title>` = "Gatherings — Tooele YSA Ward"
  - [x] Ensure NO `revalidate` export — this is pure SSG
  - [x] Ensure NO Sanity imports or GROQ calls — all content is static
  - [x] Set a single `<h1>` for the page (e.g., "Gather With Us on Sundays")

- [x] Task 2: Meeting Info section (AC: #1, #6)
  - [x] Create a section band with eyebrow "GATHERINGS" → headline "GATHER WITH US ON SUNDAYS" → body content
  - [x] Display "Sundays, 11:00 AM – 1:00 PM" as prominent, crawlable text
  - [x] Display "196 N Pinehurst Ave, Tooele, UT 84074" as crawlable text
  - [x] Section uses `surface` background with appropriate section padding

- [x] Task 3: Google Maps CTA (AC: #2, #7, #11)
  - [x] Add "Get Directions to the Chapel" button using `button-primary` style (accent-rust background, zero radius, cta font, 14px 32px padding)
  - [x] Link to `https://maps.app.goo.gl/s6kaRrALfUj1PGRU7`
  - [x] Include `target="_blank" rel="noopener noreferrer"`
  - [x] Add `aria-label="Get Directions to the Chapel (opens in new tab)"`
  - [x] Ensure button meets 44×44px minimum tap target

- [x] Task 4: Building Layout section (AC: #3, #6, #9)
  - [x] Create section band with eyebrow → headline for building info
  - [x] Render static floor plan image from `public/images/floor-plan.*` using `next/image` (with default Vercel optimizer — NOT sanity-image.tsx, per AD-5)
  - [x] Set descriptive `alt` attribute (e.g., "Floor plan of the Tooele chapel showing room locations")
  - [x] Add classroom assignment list as accessible static text below the image
  - [x] Use `<h2>` for section heading

- [x] Task 5: Attendance Guide section (AC: #4, #6, #9)
  - [x] Create section band with eyebrow → headline for first-timers info
  - [x] Write parking guidance content
  - [x] Write expectation-setting paragraph about attending a YSA sacrament meeting
  - [x] Use `<h2>` for section heading

- [x] Task 6: Responsive & Accessibility polish (AC: #10, #11)
  - [x] Verify single-column layout renders correctly at 375px viewport
  - [x] Verify section padding: 56px mobile / 88px desktop
  - [x] Verify typography scale: headline-mobile (22px) on mobile, headline (30px) on desktop
  - [x] Verify all interactive elements meet 44×44px tap target minimum
  - [x] Verify semantic heading order: one `<h1>`, `<h2>` for each section
  - [x] Add skip-to-main-content support (should already exist from Epic 1 nav)

## Dev Notes

### Architecture Compliance (MUST FOLLOW)

- **Rendering: SSG only.** This page has zero CMS dependency. Do NOT add `revalidate`. Do NOT import the Sanity client or any GROQ queries. This is the only SSG page in the site (AD-2).
- **File location:** `app/(site)/gatherings/page.tsx` — inside the `(site)` route group which shares the SiteNav + Footer layout from `app/(site)/layout.tsx`.
- **Static images use `next/image` with default Vercel optimizer** — the `sanity-image.tsx` wrapper is for Sanity-sourced images only (AD-5). The floor plan is a static asset from `public/`.
- **External links:** All external links use `target="_blank" rel="noopener noreferrer"` — no exceptions (convention from architecture).
- **Tailwind v4 CSS-first:** All styling via Tailwind utility classes. No component library. Design tokens come from `@theme {}` block in `globals.css` (AD-8).
- **TypeScript strict mode:** No `any` types. All props typed (AD-11).
- **File naming:** Component files use `kebab-case.tsx`. PascalCase exports (convention from architecture).
- **Zero border radius:** All buttons, cards, sections use 0px radius — no `rounded-*` classes (DESIGN.md).
- **One component per file.**

### Section-Band Pattern (UX-DR5)

Every content section on this page MUST follow this visual rhythm:
1. **Eyebrow** — `section-label` style (12px/700/uppercase/tracking +0.14em) in `on-surface-muted` color
2. **Headline** — `headline` style (30px desktop / 22px mobile, 800 weight, uppercase)
3. **Body content** — `body-lg` for intro paragraphs (18px/400/1.75 line-height), `body` for regular text

Each section is a full-width background band with content constrained to container max-width (1100px).

### Button Styling (UX-DR6)

- **Primary button (Get Directions):** `accent-rust` (#af5031) background, white text, 14px 32px padding, `cta` font (13px/700/uppercase/tracking +0.1em), zero radius. Hover: #8f3f23.
- **Ghost button (if needed on light sections):** `button-ghost-dark` — transparent background, 2px solid `primary` border, `primary` text, hover background rgba(9,47,51,0.06).
- Never put a `button-ghost-dark` on a dark section — use `button-ghost-light` instead.

### Dark/Light Section Alternation (UX-DR14)

Interior pages do not introduce dark bands mid-page. Pattern: the SiteNav (dark) is already rendered by the layout, then content sections alternate between `surface` (#FAFAF8) and `surface-warm` (#F3EDE3) backgrounds, then the Footer (dark) closes the page. No `primary`-colored full-bleed sections in the Gatherings page body.

### Spacing Tokens

| Token | Desktop | Mobile |
|---|---|---|
| `section-v` | 88px | — |
| `section-v-mobile` | 56px | — |
| `container-max` | 1100px | 1100px |
| `container-px` | — | 20px |
| `container-px-lg` | 48px | — |
| `stack-sm` | 16px | 16px |
| `stack-md` | 24px | 24px |
| `stack-lg` | 40px | 40px |
| `stack-xl` | 64px | 64px |

### Typography Tokens

| Role | Size | Weight | Line-Height | Transform |
|---|---|---|---|---|
| `display` | 56px (desktop) | 900 | 1.0 | uppercase |
| `display-mobile` | 34px (mobile) | 900 | 1.05 | uppercase |
| `headline` | 30px (desktop) | 800 | 1.1 | uppercase |
| `headline-mobile` | 22px (mobile) | 800 | 1.15 | uppercase |
| `section-label` | 12px | 700 | 1.4 | uppercase, tracking +0.14em |
| `body-lg` | 18px | 400 | 1.75 | none |
| `body` | 16px | 400 | 1.7 | none |
| `body-sm` | 14px | 400 | 1.6 | none |
| `cta` | 13px | 700 | 1 | uppercase, tracking +0.1em |

### Static Content Details

All content on this page is hardcoded — no CMS. Content is owned by Todd and changes rarely.

**Meeting info:**
- Day/time: "Sundays, 11:00 AM – 1:00 PM"
- Address: "196 N Pinehurst Ave, Tooele, UT 84074"
- Google Maps URL: `https://maps.app.goo.gl/s6kaRrALfUj1PGRU7`

**Building layout:**
- Floor plan image: `public/images/floor-plan.*` (Todd supplies at build time — use a placeholder or TODO comment if not yet present)
- Classroom assignments: static text list (placeholder acceptable for initial implementation)

**Attendance guide:**
- Parking guidance for 196 N Pinehurst Ave
- What to expect at a YSA sacrament meeting (brief, welcoming tone — see Voice & Tone below)

### Voice & Tone

From EXPERIENCE.md — microcopy guidance:

| Context | Do | Don't |
|---|---|---|
| Headings | "Gather With Us on Sundays" | "Sunday Worship Service Information" |
| CTA buttons | "Get Directions" | "Click Here" |
| Map CTA | "We're at 196 N Pinehurst Ave" | "Location: 196 N Pinehurst Ave, Tooele, UT 84074" |

Use LDS vocabulary naturally: "sacrament meeting," "ward," "bishop" — not "service," "congregation," "pastor."

### Dependencies (Epic 1 Prerequisite)

This story depends on Epic 1 being complete, specifically:
- **Story 1.1:** Project scaffold, Tailwind v4 @theme tokens in globals.css, Montserrat font, TypeScript strict mode
- **Story 1.3:** SiteNav and Footer in `app/(site)/layout.tsx` — the Gatherings page inherits these

If the site shell (nav + footer) is not yet in place, this page can still be built — it will work once the layout is added.

### Floor Plan Image Note

The architecture specifies `public/images/floor-plan.*` as a static file supplied by Todd. If this file does not exist yet at implementation time:
- Use a placeholder `<div>` with text "Floor plan image coming soon" styled in `body` / `on-surface-muted`
- Do NOT create a fake image or pull from an external source
- The `next/image` wrapper is ready to swap in once the file is supplied

### Accessibility Checklist

- [ ] Skip-to-main-content link (from layout — verify working)
- [ ] `<h1>` used once for page title
- [ ] `<h2>` for each section heading
- [ ] Floor plan image has descriptive `alt` text
- [ ] Google Maps button has `aria-label` with "(opens in new tab)" suffix
- [ ] All tap targets ≥ 44×44px
- [ ] Focus indicators not suppressed (Tailwind `ring` utility)
- [ ] Page keyboard-navigable: tab order follows reading order

### Project Structure Notes

- File path: `app/(site)/gatherings/page.tsx`
- Inherits layout from: `app/(site)/layout.tsx` (SiteNav + Footer)
- Root layout: `app/layout.tsx` (html, globals.css, Montserrat font)
- Design tokens: `app/globals.css` @theme block
- Static assets: `public/images/floor-plan.*`
- No components directory files needed for this story (unless extracting reusable section-band pattern)
- If a reusable `SectionBand` component pattern was established in Epic 1, reuse it. If not, implement the section-band pattern inline and consider extracting later.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2] — Story requirements and acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture/architecture-tooele-ysa-2026-07-01/ARCHITECTURE-SPINE.md#AD-2] — SSG rendering strategy for /gatherings
- [Source: _bmad-output/planning-artifacts/architecture/architecture-tooele-ysa-2026-07-01/ARCHITECTURE-SPINE.md#AD-5] — Image delivery rules (static vs Sanity)
- [Source: _bmad-output/planning-artifacts/architecture/architecture-tooele-ysa-2026-07-01/ARCHITECTURE-SPINE.md#AD-8] — Tailwind v4 CSS-first configuration
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-tooele-ysa-2026-07-01/DESIGN.md#Components] — Button styles, spacing, typography tokens
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-tooele-ysa-2026-07-01/EXPERIENCE.md#Component Patterns] — Building layout and section band behavior
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-tooele-ysa-2026-07-01/EXPERIENCE.md#Voice and Tone] — Microcopy guidance
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-tooele-ysa-2026-07-01/EXPERIENCE.md#Key Flows] — UJ-1: Visitor finds when and where to show up
- [Source: _bmad-output/planning-artifacts/prds/prd-tooele-ysa-2026-07-01/prd.md#4.2] — FR-5 through FR-8

## Dev Agent Record

### Agent Model Used

github-copilot/gpt-5.5

### Debug Log References

- 2026-07-02: `python3 _bmad/scripts/resolve_customization.py --skill .agents/skills/bmad-dev-story --key workflow` failed because `python3` is unavailable in this environment; resolved customization manually from base/team/user files.
- 2026-07-02: `pnpm test -- "app/(site)/gatherings/page.test.mjs"` failed in RED phase against placeholder route, then passed after implementation.
- 2026-07-02: `pnpm test` passed: 20 tests, 0 failures.
- 2026-07-02: `pnpm lint` passed with one unrelated warning in `.agents/skills/create-agent-with-sanity-context/references/ecommerce/app/src/app/api/chat/route.ts`.
- 2026-07-02: `pnpm build` passed; `/gatherings` prerendered as static content.

### Implementation Plan

- Implement `/gatherings` inline in `app/(site)/gatherings/page.tsx` using static hardcoded content and Next metadata.
- Keep the page pure SSG by avoiding `revalidate`, Sanity imports, GROQ, and async CMS fetching.
- Use the existing Tailwind v4 theme tokens for section bands, typography, spacing, and CTA styling.
- Detect `public/images/floor-plan.*` at build/render time and render it through `next/image` when present; use the approved placeholder when the asset is absent.
- Add source-inspection tests for static rendering constraints, visitor information, heading structure, CTA link contract, and attendance/building content.

### Completion Notes List

- Implemented the Gatherings page with meeting time, chapel address, directions CTA, building guide, classroom assignments, and first-time attendance guidance.
- Added metadata title `Gatherings — Tooele YSA Ward` and preserved pure SSG behavior with no `revalidate`, Sanity imports, or GROQ calls.
- Added `next/image` support for a future `public/images/floor-plan.*` asset with descriptive alt text; current repository has no floor-plan asset, so the approved placeholder renders.
- Verified responsive/accessibility requirements through static class checks, semantic headings, inherited skip-to-main-content support, visible focus rings, and 44px-minimum CTA target.
- Added node test coverage for the Gatherings page contract and ran full test, lint, and build validation.

### File List

- `app/(site)/gatherings/page.tsx`
- `app/(site)/gatherings/page.test.mjs`
- `_bmad-output/implementation-artifacts/2-1-gatherings-page-meeting-info-map-and-attendance-guide.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-07-02: Implemented static Gatherings page, added route contract tests, validated SSG build, and moved story to review.

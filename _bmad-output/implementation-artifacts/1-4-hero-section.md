---
baseline_commit: a1a4e8d2175169875046c31558e044578a576f5f
---

# Story 1.4: Hero Section

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to see a striking full-screen hero with the ward's image and tagline when I land on the Home page,
so that I immediately understand this is the Tooele YSA Ward and feel welcomed.

## Acceptance Criteria

1. **Given** one heroImage document is published in Sanity **When** a visitor loads the Home page **Then** the hero renders full-bleed at 100vh desktop / 85vh mobile with the Sanity image, a dark overlay (primary at 0.45 opacity), the ward name eyebrow ("TOOELE YSA WARD" in section-label style), the tagline "TOGETHER IN CHRIST" in display typography, and two buttons side by side: "Get Directions" (primary/rust) and "Meet With Missionaries" (ghost-light)
2. **Given** zero heroImage documents in Sanity **When** a visitor loads the Home page **Then** the hero renders with a solid `{colors.primary}` background — no broken image, no placeholder **And** Tagline and buttons still render normally
3. **Given** a visitor views the hero buttons **When** they tap "Get Directions" **Then** Google Maps opens in a new tab to `https://maps.app.goo.gl/s6kaRrALfUj1PGRU7` with `target="_blank" rel="noopener noreferrer"` and accessible label "Get Directions to the Chapel"
4. **Given** a visitor views the hero buttons **When** they tap "Meet With Missionaries" **Then** the Church missionary page opens in a new tab to `https://www.churchofjesuschrist.org/welcome/meet-with-missionaries?lang=eng` with `target="_blank" rel="noopener noreferrer"`
5. **And** Hero image delivered via `sanity-image.tsx` wrapper with WebP format and responsive srcset
6. **And** GROQ fetch wrapped in try/catch — on error returns empty, hero renders fallback state (AD-12)
7. **And** `export const revalidate = 60` on the Home page module (ISR)
8. **And** Page `<title>` is "Tooele YSA Ward"
9. **And** `<h1>` is the tagline "Together in Christ"

## Tasks / Subtasks

- [x] Task 1: Create Hero component (AC: #1, #2)
  - [x] Create `components/hero.tsx` (renamed from `hero-carousel.tsx` in structural seed — this is a single static image, NOT a carousel per PRD FR-1 update)
  - [x] Full-bleed: 100vh on desktop, 85vh on mobile
  - [x] When image exists: render via `sanity-image.tsx` wrapper, cover-fit, with dark overlay (`{colors.primary}` at 0.45 opacity)
  - [x] When no image (0 images): solid `{colors.primary}` background — no broken image, no placeholder
  - [x] Overlaid content (always rendered regardless of image state):
    - Ward name eyebrow: "TOOELE YSA WARD" in `section-label` style
    - Tagline: "TOGETHER IN CHRIST" in `display` style on desktop, `display-mobile` on mobile
    - Two buttons side by side (stack vertically on narrow mobile if needed)
  - [x] ARIA: `role="region"` and `aria-label="Hero"` on the hero section
- [x] Task 2: Create Button components (AC: #3, #4)
  - [x] Create primary button component/style: `{colors.accent-rust}` background, `{colors.on-accent-rust}` text, 14px 32px padding, `cta` typography, hover `#8f3f23`, zero border-radius
  - [x] Create ghost-light button component/style: transparent background, `2px solid {colors.on-primary}` border, `{colors.on-primary}` text, 12px 30px padding, `cta` typography, hover `rgba(255,255,255,0.08)`
  - [x] "Get Directions" button: primary style, links to `https://maps.app.goo.gl/s6kaRrALfUj1PGRU7`, `target="_blank" rel="noopener noreferrer"`, `aria-label="Get Directions to the Chapel"`
  - [x] "Meet With Missionaries" button: ghost-light style, links to `https://www.churchofjesuschrist.org/welcome/meet-with-missionaries?lang=eng`, `target="_blank" rel="noopener noreferrer"`
  - [x] All buttons: minimum 44×44px tap target
- [x] Task 3: Wire Home page data fetching (AC: #5, #6, #7, #8, #9)
  - [x] Update `app/(site)/page.tsx` as a Server Component
  - [x] Import `heroImageQuery` from `lib/sanity/queries.ts`
  - [x] Fetch hero image data in RSC, wrapped in try/catch — on error return null/empty (AD-12)
  - [x] Pass image data to Hero component
  - [x] Add `export const revalidate = 60` at top of page module (ISR, AD-2)
  - [x] Set page metadata: `<title>` = "Tooele YSA Ward"
  - [x] Ensure `<h1>` is "Together in Christ" (the tagline in the hero)
- [x] Task 4: Verify
  - [x] Hero renders with fallback background when no Sanity content exists
  - [x] Both buttons open correct URLs in new tabs
  - [x] Image renders via `sanity-image.tsx` when heroImage exists in Sanity
  - [x] Page title is "Tooele YSA Ward"
  - [x] Responsive: 100vh desktop, 85vh mobile, typography scales
  - [x] `pnpm build` succeeds

### Review Findings

- [x] [Review][Patch] Sanity image URL builder should not silently use empty project/dataset config [lib/sanity/image.ts:3]

## Dev Notes

### This Is NOT a Carousel

The PRD FR-1 was updated to specify a **single static hero image** — not a carousel. The architecture structural seed references `hero-carousel.tsx` but the epics file and PRD clarify: "No carousel, no rotation, no auto-advance — single image only." Name the component `hero.tsx` to reflect this.

Two states only:
- **0 images:** solid `{colors.primary}` background. No controls, no broken image.
- **1 image:** static full-bleed image with overlay. No controls, no dots.

[Source: epics.md — FR-1; EXPERIENCE.md — State Patterns: Hero 0/1 image]

### Hero Visual Specifications (from DESIGN.md)

```
Background fallback: #092f33 (primary)
Overlay color: #092f33 (primary)
Overlay opacity: 0.45
Text: #FFFFFF (on-primary)
Min height desktop: 100vh
Min height mobile: 85vh
Tagline role: display typography
```

**Overlaid content stack (top to bottom):**
1. Eyebrow: "TOOELE YSA WARD" — `section-label` style (12px/700/uppercase/+0.14em tracking)
2. Tagline: "TOGETHER IN CHRIST" — `display` style on desktop (56px/900/uppercase), `display-mobile` on mobile (34px/900/uppercase)
3. Two buttons side by side:
   - "Get Directions" — `button-primary` (rust background)
   - "Meet With Missionaries" — `button-ghost-light` (transparent, white border)

[Source: DESIGN.md — components.hero, button-primary, button-ghost-light]

### Button Specifications

**Primary (`button-primary`):**
- Background: `#af5031` (accent-rust)
- Text: `#FFFFFF`
- Hover background: `#8f3f23`
- Padding: 14px 32px
- Font: `cta` (13px/700/uppercase/+0.1em)
- Border-radius: 0px

**Ghost Light (`button-ghost-light`):**
- Background: transparent
- Border: `2px solid #FFFFFF` (on-primary)
- Text: `#FFFFFF`
- Hover background: `rgba(255,255,255,0.08)`
- Padding: 12px 30px
- Font: `cta`
- Border-radius: 0px

[Source: DESIGN.md — components.button-primary, button-ghost-light]

### External Link Pattern

All external links must use `target="_blank" rel="noopener noreferrer"` — no exceptions. This is a global convention.

**Specific URLs:**
- Get Directions: `https://maps.app.goo.gl/s6kaRrALfUj1PGRU7`
- Meet With Missionaries: `https://www.churchofjesuschrist.org/welcome/meet-with-missionaries?lang=eng`

[Source: ARCHITECTURE-SPINE.md — Consistency Conventions: External links]

### ISR Error Handling (AD-12)

The GROQ fetch for heroImage MUST be wrapped in try/catch. On catch, return null/empty and render the fallback state (solid primary background). Do NOT re-throw. Do NOT show an error boundary — the graceful empty state is the contract.

```typescript
// Pattern for all ISR page GROQ fetches
let heroImage = null;
try {
  heroImage = await client.fetch(heroImageQuery);
} catch {
  heroImage = null; // graceful fallback
}
```

[Source: ARCHITECTURE-SPINE.md — AD-12]

### Accessibility

- Hero section: `role="region"`, `aria-label="Hero"`
- `<h1>` on Home page is "Together in Christ" (the tagline) — semantic heading order requires one `<h1>` per page
- Button aria-labels: "Get Directions to the Chapel" (includes destination for screen readers)
- Image alt: hero image inherits Sanity `title` field as alt text. Fallback state has no image = no alt needed.
- Focus indicators on buttons via Tailwind `ring` utility

[Source: EXPERIENCE.md — Accessibility Floor]

### Previous Story Context

This story builds on Story 1.1 (scaffold + tokens) and Story 1.2 (Sanity infrastructure). The Hero component will use:
- `sanity-image.tsx` wrapper from Story 1.2
- `heroImageQuery` from `lib/sanity/queries.ts` (Story 1.2)
- Tailwind design tokens from `globals.css @theme {}` (Story 1.1)
- Font (Montserrat) from root layout (Story 1.1)

### Project Structure

```
components/
  hero.tsx              # NEW — full-bleed hero section (NOT hero-carousel.tsx)
app/
  (site)/
    page.tsx            # UPDATE — Home page with ISR fetch + Hero
```

### Anti-Pattern Prevention

- **DO NOT** name this `hero-carousel.tsx` — it is a single static image, not a carousel
- **DO NOT** render Sanity images with raw `<img>` — use `sanity-image.tsx` wrapper (AD-5)
- **DO NOT** let GROQ fetch errors throw — catch and render fallback (AD-12)
- **DO NOT** add `NEXT_PUBLIC_` to `SANITY_API_READ_TOKEN` (AD-3)
- **DO NOT** put the GROQ query string inline in page.tsx — import from `lib/sanity/queries.ts` (AD-4)
- **DO NOT** use `force-dynamic` rendering — ISR with `revalidate = 60` only (AD-2)

### References

- [Source: ARCHITECTURE-SPINE.md — AD-2, AD-3, AD-4, AD-5, AD-12, Capability Map]
- [Source: DESIGN.md — components.hero, button-primary, button-ghost-light]
- [Source: EXPERIENCE.md — State Patterns (Hero 0/1 image), Accessibility Floor, Key Flows (Flow 1)]
- [Source: epics.md — Story 1.4 acceptance criteria, FR-1, FR-2, FR-4]

## Dev Agent Record

### Agent Model Used

gpt-5.5

### Debug Log References

- `pnpm test` (red phase): failed as expected before implementation for missing Hero/page wiring and image wrapper behavior.
- `pnpm test`: passed 15/15 after implementation.
- `pnpm lint`: passed with one pre-existing warning in `.agents/skills/create-agent-with-sanity-context/references/ecommerce/app/src/app/api/chat/route.ts`.
- `pnpm build`: passed; `/` prerendered with 1 minute revalidation.

### Completion Notes List

- Implemented a static full-bleed Home hero with 85vh mobile / 100vh desktop sizing, solid primary fallback, optional Sanity image background, primary overlay, eyebrow, accessible `<h1>`, and two external CTA links.
- Updated Sanity image wrapper to generate responsive WebP srcset URLs through a Next image loader instead of disabling optimization.
- Wired the Home page as an async Server Component with `revalidate = 60`, metadata title, Sanity hero image fetch, and graceful fallback on missing env or fetch errors.
- Added regression coverage for the hero component contract, CTA link contract, ISR/page data wiring, and Sanity image wrapper behavior.

### File List

- `app/(site)/page.tsx`
- `components/hero.tsx`
- `components/sanity-image.tsx`
- `lib/sanity/image.ts`
- `tests/hero-section.test.mjs`
- `tests/sanity-infrastructure.test.mjs`
- `_bmad-output/implementation-artifacts/1-4-hero-section.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-07-02: Implemented Hero section, Home page Sanity data wiring, responsive image wrapper update, and regression tests; moved story to review.

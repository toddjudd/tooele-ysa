---
baseline_commit: a1a4e8d2175169875046c31558e044578a576f5f
---

# Story 1.5: Home Page Content Sections

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Content Manager,
I want to update the two featured content sections on the Home page through Sanity,
so that I can keep the ward's welcome messaging and imagery fresh without contacting the developer.

## Acceptance Criteria

1. **Given** a homeSectionTop document is published in Sanity with background image, eyebrow, heading, and body text **When** a visitor loads the Home page **Then** the first content section renders below the hero with the background image (via sanity-image.tsx, dark overlay for text contrast), and overlaid HTML text: eyebrow in section-label style, heading in headline style, body in body-lg
2. **Given** a homeSectionBottom document is published with the same fields **When** a visitor loads the Home page **Then** the second content section renders below the first with the same component pattern
3. **Given** no homeSectionTop or homeSectionBottom document is published **When** a visitor loads the page **Then** the section renders gracefully — either with a surface-warm background and placeholder text, or is omitted entirely without breaking the layout
4. **Given** a visitor views the Home page below the content sections **When** they see the "join us" block **Then** it displays "Sundays, 11:00 AM – 1:00 PM" with a working link to `/gatherings`
5. **And** Section eyebrow → headline → body rhythm follows UX-DR5 pattern
6. **And** Dark/light alternation: dark hero → light/warm content sections → dark footer (UX-DR14)
7. **And** Text is responsive (real HTML, not baked into images) and accessible
8. **And** GROQ fetches wrapped in try/catch per AD-12
9. **And** Content sections use the reusable Home Content Section component (UX-DR17)

## Tasks / Subtasks

- [x] Task 1: Create HomeContentSection component (AC: #1, #2, #5, #7, #9)
  - [x] Create `components/home-content-section.tsx` — reusable for both top and bottom sections
  - [x] Props: background image (optional), eyebrow (string), heading (string), body (string)
  - [x] When image exists: render via `sanity-image.tsx` wrapper as a background, with dark overlay for text contrast (same pattern as hero: `{colors.primary}` at 0.45 opacity)
  - [x] Overlaid HTML text (not baked into image): eyebrow in `section-label` style, heading in `headline` style, body in `body-lg` style
  - [x] Follow the eyebrow → headline → body rhythm (UX-DR5)
  - [x] Text is real HTML — responsive, accessible, selectable
  - [x] Section uses full-width background with content constrained to container max-width
- [x] Task 2: Handle empty states (AC: #3)
  - [x] When no Sanity content exists for a section: render with `{colors.surface-warm}` (#F3EDE3) background and placeholder text, OR omit the section entirely
  - [x] Layout must not break regardless of which sections have content
  - [x] No broken image, no error state shown to visitor
- [x] Task 3: Create Join Us block (AC: #4)
  - [x] Static section below the content sections
  - [x] Text: "Sundays, 11:00 AM – 1:00 PM"
  - [x] Link to `/gatherings` — internal link, NOT external (no `target="_blank"`)
  - [x] Follow section-band pattern: eyebrow → heading → body + CTA
  - [x] Google Maps CTA button linking to `https://maps.app.goo.gl/s6kaRrALfUj1PGRU7` (opens in new tab, `target="_blank" rel="noopener noreferrer"`) — FR-4
- [x] Task 4: Wire Home page data fetching (AC: #8)
  - [x] In `app/(site)/page.tsx`, import `homeSectionTopQuery` and `homeSectionBottomQuery` from `lib/sanity/queries.ts`
  - [x] Fetch both in RSC, each wrapped in individual try/catch (AD-12)
  - [x] On error, return null — section renders empty state or is omitted
  - [x] Pass data to HomeContentSection components
  - [x] `revalidate = 60` already set from Story 1.4
- [x] Task 5: Implement dark/light alternation (AC: #6)
  - [x] Ensure section background colors follow the pattern: dark hero → light/warm content → dark footer
  - [x] Content sections use `{colors.surface}` or `{colors.surface-warm}` backgrounds when no image
  - [x] When image is present, overlay provides dark treatment — text uses `{colors.on-primary}`
  - [x] No additional dark bands between hero and footer on interior pages
- [x] Task 6: Verify
  - [x] Both content sections render when Sanity data exists
  - [x] Empty states render gracefully when no Sanity data exists
  - [x] "Join us" block appears with correct text and working link
  - [x] Text is responsive and accessible on all breakpoints
  - [x] `pnpm build` succeeds

### Review Findings

- [x] [Review][Patch] Incomplete CMS section content could mix published and fallback copy [components/home-content-section.tsx:27] — fixed by treating a section as CMS-backed only when all required text fields are present, otherwise rendering the complete fallback section without a background image.

## Dev Notes

### Home Content Section Component (UX-DR17)

This is a reusable component used twice on the Home page — once for `homeSectionTop` data and once for `homeSectionBottom` data. Both Sanity document types have the same shape.

**Fields from Sanity:**
- `image` — background image (Sanity image with hotspot)
- `eyebrow` — short label text (string)
- `heading` — section heading (string)
- `body` — body copy (text)

**Visual behavior:**
- When image exists: full-bleed background image via `sanity-image.tsx`, with dark overlay (`{colors.primary}` at ~0.45 opacity) for text contrast. Text overlaid in `{colors.on-primary}`.
- When no image: section uses `{colors.surface-warm}` background with text in `{colors.on-surface}`.
- Text is always real HTML over the image — NOT text baked into the image. This ensures responsiveness and accessibility.

[Source: epics.md — FR-3a; DESIGN.md — UX-DR17]

### Section Band Pattern (UX-DR5)

Every content section follows this rhythm:
1. `section-label` eyebrow — short, uppercase, high tracking (e.g., "WELCOME")
2. `headline` heading — larger, bold, uppercase
3. Optional `body-lg` intro paragraph

Section has full-width background color band with content constrained to `{spacing.container-max}` (1100px). Vertical padding: `{spacing.section-v}` (88px) desktop, `{spacing.section-v-mobile}` (56px) mobile.

[Source: DESIGN.md — Section Labels + Headings, Layout & Spacing]

### Dark/Light Alternation (UX-DR14)

The structural page pattern: dark nav → dark hero → light content → [optional surface-warm] → dark footer.

- Content sections should alternate between `{colors.surface}` and `{colors.surface-warm}` for visual rhythm
- No additional dark bands between hero and footer on the Home page (unless the content section has a background image with overlay)

[Source: DESIGN.md — Layout & Spacing, dark/light alternation]

### Join Us Block (FR-3)

Static content — not CMS-driven:
- Meeting time: "Sundays, 11:00 AM – 1:00 PM"
- Link to Gatherings page: `/gatherings` (internal link)
- Google Maps CTA: links to `https://maps.app.goo.gl/s6kaRrALfUj1PGRU7` (external, new tab)
- Follow section-band pattern (eyebrow → heading → body)

[Source: epics.md — FR-3, FR-4]

### ISR Error Handling (AD-12)

Each GROQ fetch must be individually wrapped in try/catch. If `homeSectionTopQuery` fails, the top section renders empty state but `homeSectionBottomQuery` still executes independently.

```typescript
let topSection = null;
try {
  topSection = await client.fetch(homeSectionTopQuery);
} catch {
  topSection = null;
}

let bottomSection = null;
try {
  bottomSection = await client.fetch(homeSectionBottomQuery);
} catch {
  bottomSection = null;
}
```

[Source: ARCHITECTURE-SPINE.md — AD-12]

### Previous Story Context

This story builds on:
- **Story 1.1:** Scaffold + design tokens (globals.css @theme, Montserrat font)
- **Story 1.2:** Sanity infrastructure (`sanity-image.tsx`, queries, client, schemas for homeSectionTop/Bottom)
- **Story 1.3:** Nav + Footer shell (layout wrapper)
- **Story 1.4:** Hero section (already on Home page, `revalidate = 60` already set)

The Home page `app/(site)/page.tsx` already has:
- `export const revalidate = 60` (from Story 1.4)
- Hero component rendering with heroImage fetch (from Story 1.4)
- Metadata with title "Tooele YSA Ward" (from Story 1.4)

This story ADDS content sections and the join-us block below the hero.

### Project Structure

```
components/
  home-content-section.tsx   # NEW — reusable section with Sanity background image + overlaid text
app/
  (site)/
    page.tsx                 # UPDATE — add content sections + join-us block below hero
```

### Anti-Pattern Prevention

- **DO NOT** bake text into images — all text must be real HTML for accessibility and responsiveness
- **DO NOT** use raw `<img>` for Sanity images — use `sanity-image.tsx` wrapper (AD-5)
- **DO NOT** let GROQ errors throw — catch and render fallback per section (AD-12)
- **DO NOT** use inline GROQ query strings — import from `lib/sanity/queries.ts` (AD-4)
- **DO NOT** add dark section bands between hero and footer — light/warm sections only (UX-DR14)
- **DO NOT** skip the eyebrow → headline → body rhythm — every section needs it (UX-DR5, DESIGN.md)
- **DO NOT** use more than 3 accent colors on this page — primary, accent-rust, accent-teal cover 90% (DESIGN.md)

### References

- [Source: ARCHITECTURE-SPINE.md — AD-2, AD-4, AD-5, AD-12]
- [Source: DESIGN.md — Section Labels + Headings, Layout & Spacing, dark/light alternation, components]
- [Source: EXPERIENCE.md — Component Patterns (Section band), State Patterns (Home content section empty)]
- [Source: epics.md — Story 1.5 acceptance criteria, FR-3, FR-3a, FR-4, UX-DR5, UX-DR14, UX-DR17]

## Dev Agent Record

### Agent Model Used

gpt-5.5

### Debug Log References

- `pnpm test` (red phase): failed as expected before implementation for missing HomeContentSection and Home page content-section wiring.
- `pnpm test`: passed 17/17 after implementation.
- `pnpm lint`: passed with one pre-existing warning in `.agents/skills/create-agent-with-sanity-context/references/ecommerce/app/src/app/api/chat/route.ts`.
- `pnpm build`: passed; `/` prerendered with 1 minute revalidation.

### Completion Notes List

- Implemented reusable `HomeContentSection` with optional Sanity background image, `SanityImage` rendering, primary 45% overlay, accessible real HTML text, section-band typography rhythm, and warm placeholder fallback content.
- Updated the Home page to fetch `homeSectionTop` and `homeSectionBottom` independently with per-query try/catch fallback, then render both sections below the hero.
- Added the static Join Us section with the required Sunday meeting time, internal `/gatherings` link, and external Google Maps CTA contract.
- Added regression coverage for the new component contract, independent section fetch wiring, empty states, and Join Us links.

### File List

- `app/(site)/page.tsx`
- `components/home-content-section.tsx`
- `tests/home-page-content-sections.test.mjs`
- `_bmad-output/implementation-artifacts/1-5-home-page-content-sections.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-07-02: Implemented Home page content sections, Join Us block, independent Sanity fetch handling, and regression tests; moved story to review.

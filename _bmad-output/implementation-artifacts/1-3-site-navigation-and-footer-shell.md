---
baseline_commit: a1a4e8d2175169875046c31558e044578a576f5f
---

# Story 1.3: Site Navigation & Footer Shell

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want a persistent navigation bar and footer on every page,
so that I can move between pages and always know I'm on the Tooele YSA Ward website.

## Acceptance Criteria

1. **Given** a visitor on any page at desktop width (≥768px) **When** they view the nav **Then** they see a sticky 72px dark teal bar with logo/wordmark left and four links right (Home, Gatherings, About Us, Let's Connect) in section-label style, with the active page link in accent-teal
2. **Given** a visitor on mobile (<768px) **When** they tap the hamburger icon **Then** a full-width drawer opens below the nav bar with all four links
3. **And** Escape key closes the drawer
4. **And** Focus is trapped inside the open drawer
5. **And** Tapping any link or the X button closes the drawer
6. **Given** a visitor on any page **When** they scroll to the footer **Then** they see the full-bleed dark primary footer with "Together in Christ" tagline in headline-mobile/accent-teal, four nav links in section-label style, and copyright line with current year
7. **And** Horizontal top border per DESIGN.md footer spec
8. **Given** a keyboard user on any page **When** they press Tab **Then** a skip-to-main-content link appears on focus (visually hidden otherwise)
9. **And** All nav links resolve to correct routes (`/`, `/gatherings`, `/about`, `/connect`)
10. **And** `app/(site)/layout.tsx` renders SiteNav and Footer on all pages
11. **And** Minimum 44×44px tap targets on all interactive elements
12. **And** Mobile nav height is 64px per DESIGN.md

## Tasks / Subtasks

- [x] Task 1: Create SiteNav component (AC: #1, #2, #3, #4, #5, #9, #11, #12)
  - [x] Create `components/site-nav.tsx`
  - [x] Desktop (≥768px): sticky top bar, 72px height, `{colors.primary}` background
  - [x] Left: ward wordmark/logo (44px tall per DESIGN.md)
  - [x] Right: four links (Home, Gatherings, About Us, Let's Connect) in `section-label` typography style
  - [x] Active link: `{colors.accent-teal}` color — use `usePathname()` from `next/navigation` to determine active state
  - [x] Mobile (<768px): 64px height, hamburger icon replaces links
  - [x] Hamburger tap opens full-width drawer below nav bar with same dark background
  - [x] Close drawer on: link tap, X button tap, Escape key press
  - [x] Focus trap inside open drawer — tab cycles through nav links and close button only
  - [x] When drawer closes, return focus to hamburger button
  - [x] All interactive elements: minimum 44×44px tap target
  - [x] `usePathname()` is a client hook — mark component `'use client'`
- [x] Task 2: Create Footer component (AC: #6, #7, #9)
  - [x] Create `components/footer.tsx`
  - [x] Full-bleed `{colors.primary}` background
  - [x] Top border: `1px solid rgba(255,255,255,0.12)` per DESIGN.md footer spec
  - [x] Tagline "Together in Christ" in `headline-mobile` typography, `{colors.accent-teal}` color
  - [x] Four nav links in `section-label` style, `rgba(255,255,255,0.65)` color
  - [x] Copyright line: `© {current year} Tooele YSA Ward` — dynamic year via `new Date().getFullYear()`
  - [x] Links resolve to: `/`, `/gatherings`, `/about`, `/connect`
- [x] Task 3: Create Skip-to-Content link (AC: #8)
  - [x] Add skip-to-main-content link as first focusable element in `app/(site)/layout.tsx`
  - [x] Visually hidden by default (sr-only), visible on focus
  - [x] Links to `#main-content` anchor
  - [x] Add `id="main-content"` to `<main>` element in site layout
- [x] Task 4: Wire layout (AC: #10)
  - [x] Update `app/(site)/layout.tsx` to render: SkipLink → SiteNav → `<main id="main-content">` → Footer
  - [x] Create placeholder pages for routing: `app/(site)/gatherings/page.tsx`, `app/(site)/about/page.tsx`, `app/(site)/connect/page.tsx`
- [x] Task 5: Verify
  - [x] All four routes load with nav and footer
  - [x] Active link highlights correctly on each page
  - [x] Mobile drawer opens/closes, focus trap works, Escape key works
  - [x] Tab key shows skip link, skip link jumps to main content
  - [x] `pnpm build` succeeds

### Review Findings

- [x] [Review][Patch] Desktop nav height starts at the wrong breakpoint [components/site-nav.tsx:73]

## Dev Notes

### Component Visual Specifications

**Navigation (from DESIGN.md `{components.nav}`):**
- Background: `#092f33` (primary)
- Text: `#FFFFFF` (on-primary)
- Active text: `#7fc7cc` (accent-teal)
- Height desktop: 72px
- Height mobile: 64px
- Logo height: 44px

**Footer (from DESIGN.md `{components.footer}`):**
- Background: `#092f33` (primary)
- Tagline color: `#7fc7cc` (accent-teal) — rendered in `headline-mobile` typography (22px/800/uppercase)
- Text: `rgba(255,255,255,0.65)` — nav links in `section-label` style (12px/700/uppercase)
- Text bright: `#FFFFFF` (on-primary)
- Top border: `1px solid rgba(255,255,255,0.12)`

[Source: DESIGN.md — components.nav, components.footer]

### Nav Link Routes

| Label | Route |
|-------|-------|
| Home | `/` |
| Gatherings | `/gatherings` |
| About Us | `/about` |
| Let's Connect | `/connect` |

Order is locked — mirrors the reference site discovery journey.

[Source: EXPERIENCE.md — Information Architecture, nav link order]

### Accessibility Requirements

- **Skip-to-content link:** visually hidden, shown on focus, links to `#main-content` (UX-DR13)
- **Focus trap in mobile drawer:** tab cycles through links + close button only. Escape returns focus to hamburger. (UX-DR3)
- **Keyboard nav:** Tab order follows reading order. All hover states have equivalent focus states. (EXPERIENCE.md — Interaction Primitives)
- **Focus indicators:** native browser default not suppressed. Use Tailwind `ring` utility consistently.
- **Semantic heading order:** nav/footer do not contain heading elements (headings are page content)

[Source: EXPERIENCE.md — Accessibility Floor; DESIGN.md — UX-DR3, UX-DR13]

### Mobile Drawer Behavior

- Drawer slides down or fades in below the fixed nav bar
- Page content is visible but inert (focus trapped inside drawer)
- Drawer not in DOM or `hidden` when closed
- No auto-close on scroll

[Source: EXPERIENCE.md — State Patterns: Mobile nav open/closed]

### Dark/Light Section Pattern

The structural pattern for all pages: dark nav → dark hero → light content → dark footer. The nav and footer are always dark `{colors.primary}` backgrounds. Content areas between use `{colors.surface}` or `{colors.surface-warm}`.

[Source: DESIGN.md — Layout & Spacing, dark/light alternation; UX-DR14]

### Project Structure

```
components/
  site-nav.tsx        # Sticky nav + mobile drawer (client component)
  footer.tsx          # Dark footer band (server component)
app/
  (site)/
    layout.tsx        # SiteNav + Footer wrapper for all pages
    page.tsx          # Home (already exists from Story 1.1)
    gatherings/
      page.tsx        # Placeholder
    about/
      page.tsx        # Placeholder
    connect/
      page.tsx        # Placeholder
```

### Anti-Pattern Prevention

- **DO NOT** use a component library for nav/drawer — hand-compose with Tailwind (AD-8)
- **DO NOT** add rounded corners to nav, footer, or buttons — zero border-radius everywhere (DESIGN.md)
- **DO NOT** skip focus trap implementation — it is an accessibility requirement, not optional
- **DO NOT** mix ghost button variants — no `button-ghost-dark` on dark backgrounds (DESIGN.md Do's/Don'ts)
- **DO NOT** suppress native focus indicators — add `ring` utility, never `outline-none` without replacement

### References

- [Source: ARCHITECTURE-SPINE.md — Structural Seed, AD-8, Consistency Conventions]
- [Source: DESIGN.md — components.nav, components.footer, Layout & Spacing]
- [Source: EXPERIENCE.md — Information Architecture, Component Patterns, State Patterns, Accessibility Floor]
- [Source: epics.md — Story 1.3 acceptance criteria]

## Dev Agent Record

### Agent Model Used

github-copilot/gpt-5.5

### Debug Log References

- 2026-07-02: `python3 _bmad/scripts/resolve_customization.py --skill .agents/skills/bmad-dev-story --key workflow` failed because `python3` is unavailable in this environment; workflow customization was resolved manually from `customize.toml` files.
- 2026-07-02: Captured baseline commit `a1a4e8d2175169875046c31558e044578a576f5f`.
- 2026-07-02: `pnpm test` passed: 12 tests.
- 2026-07-02: `pnpm lint` completed with one unrelated warning in `.agents/skills/create-agent-with-sanity-context/references/ecommerce/app/src/app/api/chat/route.ts`.
- 2026-07-02: `pnpm build` passed and generated `/`, `/about`, `/connect`, `/gatherings`, and `/studio/[[...tool]]`.

### Completion Notes List

- Implemented a client `SiteNav` with desktop sticky navigation, mobile drawer, Escape close behavior, drawer focus trap, focus return to the hamburger button, active route styling, and 44px minimum tap targets.
- Implemented the dark primary footer with tagline, locked route links, dynamic copyright year, and the specified top border.
- Wired the site layout with skip-to-main-content, `SiteNav`, `<main id="main-content">`, and `Footer` around all `(site)` routes.
- Added placeholder pages for `/gatherings`, `/about`, and `/connect` so all navigation links resolve.
- Added shared site link constants and Node test coverage for route order and active route matching.

### File List

- `app/(site)/about/page.tsx`
- `app/(site)/connect/page.tsx`
- `app/(site)/gatherings/page.tsx`
- `app/(site)/layout.tsx`
- `app/(site)/page.tsx`
- `components/footer.tsx`
- `components/site-nav.tsx`
- `lib/site-links.test.mjs`
- `lib/site-links.ts`

### Change Log

- 2026-07-02: Added site navigation, mobile drawer behavior, footer, skip link, placeholder routes, and navigation route tests.

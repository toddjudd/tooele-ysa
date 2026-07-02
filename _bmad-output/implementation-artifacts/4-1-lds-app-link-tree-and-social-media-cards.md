---
baseline_commit: a3d523dbba8c1dfc00a64e157d98cc4e129f64fe
---

# Story 4.1: LDS App Link Tree & Social Media Cards

Status: in-progress

## Story

As a member,
I want quick access to LDS digital tools and ward social media from one place,
so that I don't have to search for each app or account separately.

## Acceptance Criteria

1. **Given** a visitor navigates to `/connect`, **when** the page loads, **then** the link tree section displays four LDS app link cards in a responsive grid — 2 columns mobile, 4 columns desktop.

2. **Given** a visitor views an app link card, **when** they see each card, **then** it displays the app name in section-label style / on-primary color, an icon in accent-teal, on a dark primary background (`#092f33`) with 20px 24px padding, zero border-radius.

3. **Given** a visitor taps/clicks an app link card, **when** the link activates, **then** it opens the correct URL in a new tab with `target="_blank" rel="noopener noreferrer"`:
   - Gospel Library → `https://www.churchofjesuschrist.org/learn/mobile-applications/gospel-library?lang=eng`
   - Gospel Living → `https://www.churchofjesuschrist.org/youth/childrenandyouth/gospel-living-app?lang=eng`
   - Member Tools → `https://www.churchofjesuschrist.org/tools/help/about-member-tools?lang=eng`
   - My Institute → `https://myinstitute.churchofjesuschrist.org/`

4. **Given** a visitor views an app link card, **then** each card has an accessible `aria-label` (e.g., "Open Gospel Library") with visually-hidden "(opens in new tab)" suffix.

5. **Given** a visitor hovers over an app link card, **then** the card background shifts to `#0d4549`.

6. **Given** the ward social media handles are not yet confirmed (OQ-1, OQ-2), **when** a visitor views the Instagram and Facebook cards, **then** the cards render with `href="#"` and a visible "Coming Soon" badge or muted state visually distinct from active link cards — not a broken or missing element.

7. **Given** a visitor views the Let's Connect page, **then** the link tree section follows the eyebrow → headline → content rhythm (UX-DR5) with section-label eyebrow and headline heading.

8. **Given** a visitor on mobile or desktop, **then** all card tap targets meet minimum 44×44px.

## Tasks / Subtasks

- [ ] Task 1: Create `/connect` page route and shell (AC: #1, #7)
  - [ ] Create `app/(site)/connect/page.tsx` with ISR (`export const revalidate = 60`)
  - [ ] Set page `<title>` to "Let's Connect — Tooele YSA Ward"
  - [ ] Add semantic `<h1>` for the page
  - [ ] Scaffold page with section-band pattern: eyebrow → headline → content

- [ ] Task 2: Build `AppLinkCard` component (AC: #2, #4, #5, #8)
  - [ ] Create `components/app-link-card.tsx`
  - [ ] Props: `name: string`, `href: string`, `icon: React.ReactNode`, `comingSoon?: boolean`
  - [ ] Dark primary background (`bg-[--color-primary]`), zero border-radius
  - [ ] App name in section-label typography, on-primary color
  - [ ] Icon in accent-teal color
  - [ ] Padding: 20px top/bottom, 24px left/right
  - [ ] Hover state: background shifts to `#0d4549`
  - [ ] `aria-label="Open {name}"` with visually-hidden "(opens in new tab)" suffix
  - [ ] External link attributes: `target="_blank" rel="noopener noreferrer"`
  - [ ] Minimum 44×44px tap target (the entire card is the tap target)
  - [ ] Focus ring via Tailwind `ring` utility for keyboard users

- [ ] Task 3: Build "Coming Soon" variant for social media cards (AC: #6)
  - [ ] When `comingSoon` is true, render with `href="#"` (no navigation)
  - [ ] Add visible "Coming Soon" badge — pill-shaped (`rounded-full` is the ONLY allowed round element per DESIGN.md), positioned within the card
  - [ ] Muted visual treatment: reduced opacity or desaturated styling to distinguish from active cards
  - [ ] Suppress hover background shift on coming-soon cards
  - [ ] No `target="_blank"` when href is "#"

- [ ] Task 4: Add app icon assets (AC: #2)
  - [ ] Place SVG or PNG icons in `public/images/app-icons/` for: Gospel Library, Gospel Living, Member Tools, My Institute, Instagram, Facebook
  - [ ] Use simple, recognizable icons — can be generic app-style icons for LDS apps
  - [ ] Instagram and Facebook can use standard brand icons

- [ ] Task 5: Assemble link tree grid on `/connect` page (AC: #1, #7)
  - [ ] Responsive grid: `grid-cols-2` mobile, `grid-cols-4` at desktop breakpoint (≥1024px)
  - [ ] Render all four LDS app cards with correct URLs
  - [ ] Render Instagram and Facebook cards with `comingSoon={true}` and `href="#"`
  - [ ] Section structure: eyebrow ("STAY CONNECTED" or similar) → headline → card grid
  - [ ] Section uses surface or surface-warm background per dark/light alternation (UX-DR14)

## Dev Notes

### Architecture Compliance

- **Rendering:** `/connect` is ISR with `export const revalidate = 60` (AD-2). This story's content is static, but the page will also host the events section (Story 4.2) which needs ISR.
- **No GROQ queries in this story.** The app link cards and social media cards are fully static — hardcoded in Next.js source. GROQ queries for events will be added in Story 4.2.
- **External link rule:** Every external link MUST use `target="_blank" rel="noopener noreferrer"` — no exceptions (architecture consistency convention).
- **File naming:** `kebab-case.tsx` for component files, PascalCase for exports. One component per file.
- **No component library:** All UI built with Tailwind utility classes only (AD-8). No shadcn, MUI, or Radix.
- **Tailwind v4 CSS-first:** All tokens already defined in `globals.css @theme {}` block from Story 1.1. Use `--color-primary`, `--color-on-primary`, `--color-accent-teal`, etc. as CSS custom properties in Tailwind classes.
- **Zero border-radius** on all elements except pill badges (`rounded-full`). The "Coming Soon" badge is the ONE exception where `rounded-full` is acceptable.

### Component Token Reference (from DESIGN.md)

```
app-link-card:
  background: '#092f33'        (--color-primary)
  text: '#FFFFFF'              (--color-on-primary)
  hover-background: '#0d4549'
  icon-color: '#7fc7cc'        (--color-accent-teal)
  padding: '20px 24px'
```

### Open Questions Impacting This Story

- **OQ-1:** Ward Instagram handle/URL — not yet confirmed. Card renders with "Coming Soon" state.
- **OQ-2:** Ward Facebook page URL — not yet confirmed. Card renders with "Coming Soon" state.
- When Todd confirms these handles, update the card `href` values and remove `comingSoon` prop. No architectural changes needed.

### File Locations

| File | Action | Purpose |
|------|--------|---------|
| `app/(site)/connect/page.tsx` | NEW | Let's Connect page with ISR |
| `components/app-link-card.tsx` | NEW | Reusable app link card component |
| `public/images/app-icons/` | NEW | App icon assets (SVG/PNG) |

### Testing Guidance

- Verify all four LDS app links open correct URLs in new tabs
- Verify Instagram/Facebook cards show "Coming Soon" and do NOT navigate
- Verify responsive grid: 2 columns on mobile (<640px), 4 columns on desktop (≥1024px)
- Verify hover states only on active cards (not "Coming Soon" cards)
- Verify keyboard focus ring on all cards
- Verify `aria-label` attributes on all cards
- Verify 44×44px minimum tap targets
- Verify zero border-radius on all cards
- Verify page title: "Let's Connect — Tooele YSA Ward"
- Verify semantic heading order: one `<h1>`, section heading as `<h2>`

### Project Structure Notes

- This story creates the `/connect` page shell. Story 4.2 will add the events section to this same page.
- The `app-link-card.tsx` component is only used on `/connect` — not shared across pages.
- Icons go in `public/images/app-icons/` per the architecture structural seed.
- The page sits in `app/(site)/connect/` route group, sharing the site layout (SiteNav + Footer) from Story 1.3.

### References

- [Source: epics.md#Story 4.1] — Full acceptance criteria and FR coverage (FR-12, FR-13)
- [Source: ARCHITECTURE-SPINE.md#AD-2] — ISR rendering strategy for /connect
- [Source: ARCHITECTURE-SPINE.md#AD-8] — Tailwind v4 CSS-first, no component library
- [Source: DESIGN.md#app-link-card] — Component visual tokens
- [Source: EXPERIENCE.md#Component Patterns] — App link card behavioral spec
- [Source: EXPERIENCE.md#Interaction Primitives] — External link rules, tap target minimums
- [Source: DESIGN.md#Shapes] — Zero border-radius rule, pill badge exception
- [Source: open-questions.md#OQ-1, OQ-2] — Social media handles pending

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

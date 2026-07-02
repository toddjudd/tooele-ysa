---
baseline_commit: a1a4e8d2175169875046c31558e044578a576f5f
---

# Story 3.1: Leadership Directory & Leader Cards

Status: done

## Story

As a member,
I want to see a directory of ward leaders with their phone numbers and emails,
so that I can quickly call or email the bishop or another leader without asking around.

## Acceptance Criteria

1. **Given** one or more `leaderCard` documents are published in Sanity, **When** a visitor loads `/about`, **Then** the Leadership Directory section renders with the heading "OUR LEADERSHIP" and a responsive grid of leader cards — 1 column mobile, 2 columns tablet (640px+), 3 columns desktop (1024px+).

2. **Given** a leader card has Name, Title, Phone, and Email, **When** it renders, **Then** Name displays in section-label style / primary color, Title in body-sm / muted, Phone as a tappable `tel:` link in accent-rust with `aria-label="Call [Name]: [number]"`, and Email as a tappable `mailto:` link in accent-rust with `aria-label="Email [Name]"`.

3. **Given** a leader card has no Phone or Email (optional fields absent), **When** it renders, **Then** the missing field line is omitted entirely — no gap, no "N/A", no placeholder text. Card reflows cleanly with consistent 24px padding.

4. **Given** a leader card has Phone but no Email (or vice versa), **When** it renders, **Then** only the present field renders with consistent padding.

5. **Given** zero `leaderCard` documents in Sanity, **When** a visitor loads `/about`, **Then** the leader grid area shows "Leadership information will be added soon." in body style / on-surface-muted color.

6. Leader cards styled per UX-DR7: flat rectangular, surface background (`#FAFAF8`), 1px border in border color (`#d6cfc6`), 24px padding, zero border-radius.

7. Full-line tap targets on phone/email links (minimum 44×44px).

8. Link hover state transitions from accent-rust (`#af5031`) to accent-teal (`#7fc7cc`).

9. GROQ query `leaderCardsQuery` fetched in RSC, wrapped in try/catch — on error returns empty array, renders empty state (AD-12).

10. `export const revalidate = 60` on the About Us page (ISR).

11. Page follows section-band pattern with eyebrow → headline → content (UX-DR5).

## Tasks / Subtasks

- [x] Task 1: Create the About Us page route (AC: #1, #9, #10, #11)
  - [x] Create `app/(site)/about/page.tsx` with ISR `export const revalidate = 60`
  - [x] Page `<title>` is "About Us — Tooele YSA Ward"
  - [x] Semantic heading order: one `<h1>` for page, `<h2>` for Leadership section
  - [x] Fetch `leaderCardsQuery` in RSC with try/catch returning `[]` on error
  - [x] Ward identity paragraph at top of page (placeholder text for launch)
  - [x] Follow eyebrow ("ABOUT US") → headline → body rhythm

- [x] Task 2: Create the LeaderCard component (AC: #2, #3, #4, #6, #7, #8)
  - [x] Create `components/leader-card.tsx` as a PascalCase export
  - [x] Props: `name: string`, `title: string`, `phone?: string`, `email?: string`
  - [x] Name in section-label style (`font-size: 12px`, `font-weight: 700`, `letter-spacing: 0.14em`, `text-transform: uppercase`) with primary color (`#092f33`)
  - [x] Title in body-sm style (`font-size: 14px`, `font-weight: 400`) with muted color (`#5a5550`)
  - [x] Phone as `<a href="tel:...">` in accent-rust (`#af5031`) with `aria-label="Call [Name]: [number]"`
  - [x] Email as `<a href="mailto:...">` in accent-rust with `aria-label="Email [Name]"`
  - [x] Full-line tap target on phone/email links — use `block` or `flex` with min-height 44px
  - [x] Hover: transition color from accent-rust to accent-teal (`#7fc7cc`)
  - [x] Card: surface background (`#FAFAF8`), `border: 1px solid #d6cfc6`, `padding: 24px`, zero border-radius
  - [x] Omit absent optional fields — no gap, no placeholder

- [x] Task 3: Create the leadership directory grid (AC: #1, #5)
  - [x] In the About page, render leader cards in a responsive CSS grid
  - [x] Grid: `grid-cols-1` default, `sm:grid-cols-2` (640px+), `lg:grid-cols-3` (1024px+)
  - [x] Gap between cards: `stack-md` (24px)
  - [x] Empty state: "Leadership information will be added soon." in body style / on-surface-muted

- [x] Task 4: Add `leaderCardsQuery` to `lib/sanity/queries.ts` (AC: #9)
  - [x] Named export: `export const leaderCardsQuery = ...`
  - [x] Query fetches all `leaderCard` documents, ordered by `displayOrder asc`
  - [x] Fields: `_id`, `name`, `title`, `phone`, `email`, `displayOrder`

### Review Findings

- [x] [Review][Patch] Normalize phone numbers in `tel:` hrefs [components/leader-card.tsx:17] — fixed by stripping non-dial characters from the link target while preserving the displayed phone number and aria label.

## Dev Notes

### Architecture Compliance

- **AD-2 (ISR):** `/about` must export `export const revalidate = 60`. Not SSG, not force-dynamic.
- **AD-3 (Server-only):** GROQ query runs in RSC only. `SANITY_API_READ_TOKEN` never exposed to client.
- **AD-4 (next-sanity):** All queries via `next-sanity`. No raw `fetch()` to Sanity API. Queries are named exports in `lib/sanity/queries.ts`.
- **AD-9 (Singleton client):** Import client from `lib/sanity/client.ts`. Never call `createClient()` in page files.
- **AD-11 (TypeScript strict):** No `any`. Use generated types from `lib/types.ts` for `LeaderCard` document shape.
- **AD-12 (Error handling):** Wrap GROQ fetch in try/catch. On error, return `[]`. Render the empty state. Never throw.

### File Structure

Files to create (all NEW):
- `app/(site)/about/page.tsx` — About Us page (ISR)
- `components/leader-card.tsx` — LeaderCard component

Files that must already exist (from Epic 1 stories):
- `app/(site)/layout.tsx` — Site layout with SiteNav + Footer
- `lib/sanity/client.ts` — Sanity client singleton
- `lib/sanity/queries.ts` — GROQ query exports (add `leaderCardsQuery`)
- `lib/types.ts` — Generated types (must include `LeaderCard` type)
- `app/globals.css` — Tailwind v4 @theme tokens

**CRITICAL DEPENDENCY:** This story depends on Epic 1 stories (1-1 through 1-3) being complete. The scaffold, Sanity infrastructure, site nav, and footer must exist. The `leaderCard` Sanity schema and `leaderCardsQuery` GROQ query should have been created in Story 1.2. If they don't exist yet, they must be created as part of this story.

### Tailwind Token Usage

All styling must use Tailwind v4 utility classes referencing the @theme tokens in globals.css. Key tokens for this story:

| Token | CSS Variable | Value | Usage |
|-------|-------------|-------|-------|
| surface | `--color-surface` | `#FAFAF8` | Card background |
| primary | `--color-primary` | `#092f33` | Name color |
| on-surface-muted | `--color-on-surface-muted` | `#5a5550` | Title color, empty state text |
| accent-rust | `--color-accent-rust` | `#af5031` | Phone/email link color |
| accent-teal | `--color-accent-teal` | `#7fc7cc` | Link hover color |
| border | `--color-border` | `#d6cfc6` | Card border |
| section-v | `--spacing-section-v` | `88px` | Section vertical padding (desktop) |
| section-v-mobile | `--spacing-section-v-mobile` | `56px` | Section vertical padding (mobile) |
| container-max | `--spacing-container-max` | `1100px` | Content max-width |

### Library Versions

| Package | Version | Notes |
|---------|---------|-------|
| next-sanity | 13.x | Use for GROQ fetches. Imports: `import { client } from '@/lib/sanity/client'` |
| @sanity/image-url | 2.x | Not needed for leader cards (no images) |
| next | 15.x | `params`/`searchParams` are async in Next.js 15 |
| tailwindcss | 4.x | CSS-first config, @theme block in globals.css |

### GROQ Query Pattern

```groq
*[_type == "leaderCard"] | order(displayOrder asc) {
  _id,
  name,
  title,
  phone,
  email,
  displayOrder
}
```

### Testing Checklist

- [ ] Leader cards render correctly with all fields present
- [ ] Leader cards render correctly with only phone (no email)
- [ ] Leader cards render correctly with only email (no phone)
- [ ] Leader cards render correctly with neither phone nor email
- [ ] Empty state renders when no leaderCard documents exist
- [ ] `tel:` links are tappable and functional
- [ ] `mailto:` links are tappable and functional
- [ ] Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
- [ ] 44×44px minimum tap targets on all links
- [ ] Hover transitions work (rust → teal)
- [ ] Page title is "About Us — Tooele YSA Ward"
- [ ] Semantic heading order: h1 → h2
- [ ] ISR revalidation set to 60s
- [ ] Error handling: GROQ failure renders empty state (no 500)

### Project Structure Notes

- Page lives in the `(site)` route group to share SiteNav + Footer layout
- Component file uses kebab-case: `leader-card.tsx`
- Component export uses PascalCase: `LeaderCard`
- One component per file
- GROQ query added to existing `lib/sanity/queries.ts` — do not create a separate queries file

### References

- [Source: epics.md#Story 3.1] — Full acceptance criteria and BDD scenarios
- [Source: ARCHITECTURE-SPINE.md#AD-2] — ISR rendering strategy
- [Source: ARCHITECTURE-SPINE.md#AD-12] — Error handling contract
- [Source: DESIGN.md#Components#Leader Card] — Visual spec for leader-card component
- [Source: EXPERIENCE.md#State Patterns] — Leadership directory empty state treatment
- [Source: EXPERIENCE.md#Component Patterns] — Leader card behavioral spec
- [Source: prd.md#FR-9] — Leadership directory Sanity-managed requirement
- [Source: prd.md#FR-10] — Leader card display requirement

## Dev Agent Record

### Agent Model Used

github-copilot/gpt-5.5

### Debug Log References

- `pnpm test -- tests/leadership-directory.test.mjs` — 3 passed
- `pnpm test` — 23 passed
- `pnpm lint` — passed with 1 unrelated warning in `.agents/skills/create-agent-with-sanity-context/references/ecommerce/app/src/app/api/chat/route.ts`
- `pnpm build` — passed

### Completion Notes List

- Implemented the `/about` page as an ISR server component with metadata, section-band layout, Sanity environment guard, `leaderCardsQuery` fetch, and try/catch fallback to `[]`.
- Added `LeaderCard` with token-based flat card styling, optional phone/email rendering, accessible `tel:` and `mailto:` links, 44px tap targets, and rust-to-teal hover transitions.
- Rendered the leadership directory grid with 1/2/3 column breakpoints and the required empty state.
- Verified the existing `leaderCardsQuery` export matches the story query contract.
- Added focused Node tests covering leader card behavior, About page integration, responsive grid classes, empty state, ISR metadata, and query fields.

### File List

- `app/(site)/about/page.tsx`
- `components/leader-card.tsx`
- `tests/leadership-directory.test.mjs`
- `_bmad-output/implementation-artifacts/3-1-leadership-directory-and-leader-cards.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-07-02: Implemented leadership directory About page, LeaderCard component, focused tests, and story/sprint tracking updates.

---
baseline_commit: a3d523dbba8c1dfc00a64e157d98cc4e129f64fe
---

# Story 3.2: Missionaries Section & Page Assembly

Status: done

## Story

As a visitor,
I want to find missionary contact information on the About Us page,
so that I or a friend can reach out to meet with missionaries in the Tooele area.

## Acceptance Criteria

1. **Given** a visitor is on `/about`, **When** they scroll below the leadership directory, **Then** they see a Missionaries section with a heading ("OUR MISSIONARIES"), a contact phone number rendered as a `tel:` link, and a primary button linking to `https://www.churchofjesuschrist.org/welcome/meet-with-missionaries?lang=eng` opening in a new tab.

2. Phone number `tel:` link has an accessible `aria-label` (e.g., "Call Tooele Missionaries: [number]").

3. External link uses `target="_blank" rel="noopener noreferrer"`.

4. Missionaries section is fully static — hardcoded in Next.js, renders identically regardless of Sanity availability.

5. No individual missionary names displayed — only the shared phone number and Church contact link.

6. Section follows the eyebrow → headline → content rhythm (UX-DR5).

7. Button styled per UX-DR6 (primary button: accent-rust background, on-accent-rust text, 14px 32px padding, cta font, hover darkens to `#8f3f23`, zero radius). Or ghost-dark variant if section is on a light background.

8. Page `<title>` is "About Us — Tooele YSA Ward".

9. Semantic heading order: one `<h1>` for the page, `<h2>` for Leadership and Missionaries sections.

10. About Us page ward identity paragraph present at top of page (placeholder text acceptable for launch).

11. Minimum 44×44px tap targets on all interactive elements (phone link and CTA button).

12. Dark/light section alternation: the Missionaries section should follow the page's light content pattern (no new dark bands mid-page on interior pages per UX-DR14).

## Tasks / Subtasks

- [x] Task 1: Create the MissionariesBlock component (AC: #1, #2, #3, #4, #5, #6, #7, #11)
  - [x] Create `components/missionaries-block.tsx` as a PascalCase export
  - [x] Fully static — no props from CMS, no GROQ query, no Sanity dependency
  - [x] Section eyebrow: "OUR MISSIONARIES" in section-label style
  - [x] Section headline: e.g., "MEET WITH MISSIONARIES" in headline style
  - [x] Brief paragraph in body-lg explaining what missionaries do / how to reach them
  - [x] Phone number as `<a href="tel:+1XXXXXXXXXX">` with `aria-label="Call Tooele Missionaries: (XXX) XXX-XXXX"`
  - [x] Use placeholder phone number until Todd supplies the real one (OQ-3). Format: `(435) 555-0199` or similar placeholder with a code comment `// TODO: Replace with actual missionary phone number (OQ-3)`
  - [x] "Meet With Missionaries" button linking to `https://www.churchofjesuschrist.org/welcome/meet-with-missionaries?lang=eng`
  - [x] Button: primary style (accent-rust `#af5031` bg, white text, `14px 32px` padding, cta font `13px/700/uppercase/0.1em tracking`, hover `#8f3f23`, zero radius) OR ghost-dark if on light background
  - [x] External link: `target="_blank" rel="noopener noreferrer"`
  - [x] Button `aria-label`: include "(opens in new tab)" suffix via visually-hidden span
  - [x] Minimum 44×44px tap targets on phone link and button

- [x] Task 2: Assemble the complete About Us page (AC: #8, #9, #10, #12)
  - [x] Ensure `app/(site)/about/page.tsx` (created in Story 3.1) integrates both sections
  - [x] Page structure top to bottom:
    1. Ward identity paragraph (placeholder text, `<h1>` — "About Us" or "About the Tooele YSA Ward")
    2. Leadership Directory section (`<h2>` — "OUR LEADERSHIP")
    3. Missionaries section (`<h2>` — "OUR MISSIONARIES")
  - [x] Verify semantic heading order: h1 → h2 → h2 (no skipped levels)
  - [x] Verify `<title>` is "About Us — Tooele YSA Ward"
  - [x] Verify dark/light alternation: light surface sections, no dark bands mid-page (UX-DR14)
  - [x] Ensure section vertical padding: 88px desktop / 56px mobile per @theme tokens
  - [x] Content constrained to container max-width (1100px), centered

- [x] Task 3: Verify page-level integration (AC: all)
  - [x] Confirm ISR `export const revalidate = 60` is set (from Story 3.1)
  - [x] Confirm GROQ error handling for leadership section doesn't affect missionaries section
  - [x] Missionaries section renders independently of Sanity availability
  - [x] Page renders correctly at 375px viewport and up
  - [x] All keyboard navigation works (Tab through links, focus visible)
  - [x] Skip-to-main-content link works on this page

### Review Findings

- [x] [Review][Patch] Let the visually-hidden new-tab suffix participate in the CTA accessible name [components/missionaries-block.tsx:33] — fixed by removing the redundant `aria-label` from the external CTA so the visible link text plus `sr-only` suffix forms the accessible name.

## Dev Notes

### Architecture Compliance

- **AD-1 (Layer boundary):** MissionariesBlock is a Presentation-layer component with zero CMS dependency. It has no knowledge of Sanity.
- **AD-2 (ISR):** The `/about` page is ISR (revalidate=60) because the leadership section needs it. The static missionaries block is unaffected — it renders the same on every build and every revalidation.
- **AD-6 (No auth):** No auth concerns — this is a public page component.
- **AD-8 (Tailwind only):** Style with Tailwind v4 utilities only. No component library.
- Convention: External links always use `target="_blank" rel="noopener noreferrer"` — enforced in the component, not inline.

### File Structure

Files to create (NEW):
- `components/missionaries-block.tsx` — MissionariesBlock component (fully static)

Files to modify (UPDATE from Story 3.1):
- `app/(site)/about/page.tsx` — Import and render MissionariesBlock below the leadership directory

Files that must already exist (from Epic 1 + Story 3.1):
- `app/(site)/layout.tsx` — Site layout with SiteNav + Footer
- `app/globals.css` — Tailwind v4 @theme tokens
- `components/leader-card.tsx` — LeaderCard component (from Story 3.1)

### Previous Story Intelligence (Story 3.1)

Story 3.1 created the About Us page route and the LeaderCard component. Key patterns to follow:
- The page already has `export const revalidate = 60`
- The page already imports the Sanity client and fetches `leaderCardsQuery`
- The page already has the ward identity paragraph and Leadership section
- The missionaries block is ADDITIVE — render it below the leadership directory
- Do NOT modify the leadership directory logic — only add the missionaries section below it
- The page already follows the eyebrow → headline → content rhythm — maintain that pattern

### Tailwind Token Usage

Key tokens for this story:

| Token | CSS Variable | Value | Usage |
|-------|-------------|-------|-------|
| surface | `--color-surface` | `#FAFAF8` | Section background |
| primary | `--color-primary` | `#092f33` | Headline color |
| on-surface | `--color-on-surface` | `#111111` | Body text |
| on-surface-muted | `--color-on-surface-muted` | `#5a5550` | Eyebrow color on light bg |
| accent-rust | `--color-accent-rust` | `#af5031` | Primary button bg, phone link |
| on-accent-rust | `--color-on-accent-rust` | `#FFFFFF` | Primary button text |
| section-v | `--spacing-section-v` | `88px` | Section vertical padding (desktop) |
| section-v-mobile | `--spacing-section-v-mobile` | `56px` | Section vertical padding (mobile) |
| container-max | `--spacing-container-max` | `1100px` | Content max-width |

### Component Pattern: Primary Button

The primary button on the missionaries section must match UX-DR6 exactly:
```
Background: #af5031 (accent-rust)
Text: #FFFFFF (on-accent-rust)
Padding: 14px 32px
Font: 13px / 700 / uppercase / letter-spacing 0.1em (cta token)
Hover: #8f3f23
Border-radius: 0px
```

If a reusable button component exists from Epic 1 (Story 1.4 hero buttons), use it. If not, apply the styles directly with Tailwind utilities.

### Open Question: Missionary Phone Number (OQ-3)

The missionary phone number is TBD (Todd to supply). Use a realistic-looking placeholder:
```tsx
// TODO: Replace with actual Tooele missionary phone number (OQ-3)
const MISSIONARY_PHONE = "(435) 555-0199";
```

The placeholder must be:
- Clearly marked with a TODO comment
- A valid-format phone number so the tel: link works correctly
- Easy to find-and-replace when the real number is provided

### Library Versions

| Package | Version | Notes |
|---------|---------|-------|
| next | 15.x | No special imports needed for this static component |
| tailwindcss | 4.x | CSS-first, @theme tokens in globals.css |

### Testing Checklist

- [ ] MissionariesBlock renders with eyebrow, headline, phone link, and CTA button
- [ ] Phone link uses `tel:` protocol and has correct aria-label
- [ ] CTA button opens Church missionary page in new tab
- [ ] CTA button has `target="_blank" rel="noopener noreferrer"`
- [ ] Button styled per UX-DR6 (rust bg, white text, zero radius, cta font)
- [ ] Button hover darkens to `#8f3f23`
- [ ] Section renders identically when Sanity is unavailable
- [ ] No individual missionary names displayed
- [ ] Semantic heading order across full page: h1 → h2 (leadership) → h2 (missionaries)
- [ ] Page renders correctly at 375px viewport
- [ ] 44×44px minimum tap targets on phone link and button
- [ ] Keyboard navigation: Tab reaches phone link and button, focus indicators visible
- [ ] Dark/light alternation: no dark bands mid-page
- [ ] Section padding: 88px desktop, 56px mobile
- [ ] Content constrained to 1100px max-width

### Project Structure Notes

- Component file uses kebab-case: `missionaries-block.tsx`
- Component export uses PascalCase: `MissionariesBlock`
- One component per file
- Fully static — no CMS props, no data fetching
- The phone number and Church URL are the only "data" — hardcoded as constants at the top of the file

### References

- [Source: epics.md#Story 3.2] — Full acceptance criteria and BDD scenarios
- [Source: ARCHITECTURE-SPINE.md#Structural Seed] — `components/missionaries-block.tsx` location
- [Source: ARCHITECTURE-SPINE.md#AD-6] — No auth, fully static
- [Source: DESIGN.md#Components#Primary Button] — Button-primary visual spec
- [Source: DESIGN.md#Components#Section Labels + Headings] — Eyebrow → headline → body rhythm
- [Source: EXPERIENCE.md#Component Patterns] — Missionaries block behavioral spec
- [Source: EXPERIENCE.md#Voice and Tone] — "Our Missionaries" heading, no named individuals
- [Source: prd.md#FR-11] — Missionaries section requirements
- [Source: prd.md#OQ-3] — Missionary phone number pending from Todd

## Dev Agent Record

### Agent Model Used

github-copilot/gpt-5.5

### Debug Log References

- `pnpm test` red phase: failed because `components/missionaries-block.tsx` did not exist.
- `pnpm test` green/final: 26 tests passed.
- `pnpm lint`: passed with one pre-existing warning in `.agents/skills/create-agent-with-sanity-context/references/ecommerce/app/src/app/api/chat/route.ts`.
- `pnpm build`: passed.

### Completion Notes List

- Added a fully static `MissionariesBlock` presentation component with placeholder missionary phone number, accessible `tel:` link, external Church CTA, primary rust button styling, and 44px minimum tap targets.
- Integrated `MissionariesBlock` below the leadership directory on `/about` without changing leadership data fetching or Sanity error handling.
- Added Node regression tests covering static rendering requirements, external-link contract, visual/accessibility guardrails, ISR metadata, and page section order.

### File List

- `_bmad-output/implementation-artifacts/3-2-missionaries-section-and-page-assembly.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `app/(site)/about/page.tsx`
- `components/missionaries-block.tsx`
- `tests/missionaries-section.test.mjs`

### Change Log

- 2026-07-02: Implemented Story 3.2 missionaries block, about page assembly, regression tests, and review-ready tracking updates.

---
baseline_commit: 8b31288fe196446fa3b2d43a898e315b08c89e92
---

# Story 4.2: Ward Events Calendar

Status: done

## Story

As a member,
I want to see upcoming ward activities listed on the Let's Connect page,
so that I know what events are coming up without having to ask in a group text.

## Acceptance Criteria

1. **Given** one or more `wardEvent` documents are published in Sanity with current or future dates, **when** a visitor loads `/connect`, **then** the events section renders with heading "UPCOMING EVENTS" and a list of events sorted ascending by date.

2. **Given** an event has Title and Date/Time (required fields), **when** it renders, **then** the date displays in section-label style / accent-rust color (`#af5031`), the title in body-lg / on-surface color (`#111111`), with a 3px solid accent-rust left border on each item. No card frame — list items are visually light (UX-DR8).

3. **Given** an event has optional Description and/or Location, **when** it renders, **then** the description displays in body / on-surface-muted (`#5a5550`), and location displays similarly as secondary content.

4. **Given** an event has a Date/Time value, **when** it renders, **then** the date is formatted in human-readable form (e.g., "Monday, July 7 at 7:00 PM"). Use `Intl.DateTimeFormat` or equivalent — no external date library.

5. **Given** events exist with past dates, **when** the page renders, **then** past events are filtered out — only events on or after the current date are shown. Filtering happens in the GROQ query (`dateTime >= now()`), not client-side.

6. **Given** zero upcoming events exist in Sanity, **when** a visitor loads the page, **then** the events section renders with "No upcoming events listed yet." in body style / on-surface-muted color. App link cards from Story 4.1 still render normally above.

7. **Given** the GROQ fetch fails, **when** the page renders, **then** the events section renders the same empty state as AC #6 — no error thrown, no 500 page (AD-12).

8. **Given** a Content Manager creates a new `wardEvent` in Sanity Studio, **when** they publish it, **then** it appears on the Let's Connect page within 60 seconds (ISR revalidation) without developer involvement.

## Tasks / Subtasks

- [x] Task 1: Verify `wardEvent` schema exists (dependency from Story 1.2)
  - [x] Confirm `sanity/schema-types/ward-event.ts` exists with fields: `title` (string, required), `dateTime` (datetime, required), `description` (text, optional), `location` (string, optional)
  - [x] Confirm schema field labels use plain language (e.g., "Event Title", "Date & Time", "Description", "Location")
  - [x] Confirm `wardEvent` is registered in `sanity/schema-types/index.ts`

- [x] Task 2: Verify `upcomingEventsQuery` exists in queries.ts (dependency from Story 1.2)
  - [x] Confirm `lib/sanity/queries.ts` has named export `upcomingEventsQuery`
  - [x] Query must: filter `_type == "wardEvent"` AND `dateTime >= now()`, order by `dateTime asc`, limit to 20 results (`[0...20]`)
  - [x] Query selects: `_id`, `title`, `dateTime`, `description`, `location`

- [x] Task 3: Build `EventItem` component (AC: #2, #3, #4)
  - [x] Create `components/event-item.tsx`
  - [x] Props: `title: string`, `dateTime: string`, `description?: string`, `location?: string`
  - [x] Left border: 3px solid accent-rust (`border-l-[3px] border-[--color-accent-rust]`)
  - [x] Date line: section-label typography, accent-rust color — formatted human-readable (e.g., "Monday, July 7 at 7:00 PM")
  - [x] Title: body-lg typography, on-surface color
  - [x] Optional description: body typography, on-surface-muted color — only rendered when present
  - [x] Optional location: body-sm typography, on-surface-muted — only rendered when present
  - [x] No card frame, no background, no border-radius — visually light list item
  - [x] Appropriate vertical spacing between items (stack-md: 24px)

- [x] Task 4: Format dateTime for human-readable display (AC: #4)
  - [x] Create a utility function (in `event-item.tsx` or a shared `lib/format.ts`)
  - [x] Input: ISO 8601 datetime string from Sanity
  - [x] Output: "Monday, July 7 at 7:00 PM" format
  - [x] Use `Intl.DateTimeFormat` with options: `{ weekday: 'long', month: 'long', day: 'numeric' }` for date, `{ hour: 'numeric', minute: '2-digit' }` for time
  - [x] Locale: `'en-US'`
  - [x] Handle edge cases: midnight events, all-day events (if dateTime has no time component)

- [x] Task 5: Add events section to `/connect` page (AC: #1, #5, #6, #7, #8)
  - [x] Import `upcomingEventsQuery` from `lib/sanity/queries.ts`
  - [x] Import Sanity client from `lib/sanity/client.ts`
  - [x] Fetch events in the RSC (Server Component) — NEVER client-side (AD-3)
  - [x] Wrap GROQ fetch in try/catch — on error, return empty array (AD-12)
  - [x] Render events section below the app link cards section from Story 4.1
  - [x] Section structure: eyebrow ("UPCOMING EVENTS") → headline → event list
  - [x] Map over events array, render `EventItem` for each
  - [x] Empty state: when events array is empty, render "No upcoming events listed yet." in body / on-surface-muted
  - [x] `export const revalidate = 60` already present from Story 4.1

- [x] Task 6: Ensure page semantic structure (AC: #1)
  - [x] Verify one `<h1>` for the page (already from Story 4.1)
  - [x] Events section heading is `<h2>` — "UPCOMING EVENTS"
  - [x] Verify heading hierarchy is not broken by adding this section

### Review Findings

- [x] [Review][Patch] Event time formatting uses the deployment timezone instead of the authored Sanity time [`lib/format-event-date.ts:8`]
- [x] [Review][Patch] Coming-soon app cards render inert `href="#"` anchors after click prevention was removed [`components/app-link-card.tsx:12`]

## Dev Notes

### Architecture Compliance

- **Rendering:** `/connect` page already has `export const revalidate = 60` from Story 4.1 — do not duplicate.
- **Server-only data fetching (AD-3):** GROQ query MUST execute in the RSC. `SANITY_API_READ_TOKEN` is server-side only. Never use `NEXT_PUBLIC_` prefix for the token.
- **Sanity client singleton (AD-9):** Import from `lib/sanity/client.ts` — do NOT create a new client instance.
- **Named query exports only (AD-4):** Use `upcomingEventsQuery` from `lib/sanity/queries.ts` — no inline GROQ strings in the page file.
- **Error handling (AD-12):** Wrap GROQ fetch in try/catch. On catch, return `[]`. Render the empty state. Do NOT re-throw. Do NOT show error boundaries in v1.
- **TypeScript strict (AD-11):** Use `sanity-typegen` generated types from `lib/types.ts` for the `wardEvent` document shape. No `any`.

### Component Token Reference (from DESIGN.md)

```
event-item:
  date-accent: '#af5031'       (--color-accent-rust)
  date-font: section-label     (12px / 700 / uppercase / tracking +0.14em)
  title-color: '#111111'       (--color-on-surface)
  title-font: body-lg          (18px / 400 / 1.75 line-height)
  meta-color: '#5a5550'        (--color-on-surface-muted)
  border-left: '3px solid #af5031'
```

### GROQ Query Contract

```groq
// upcomingEventsQuery — must be in lib/sanity/queries.ts
*[_type == "wardEvent" && dateTime >= now()] | order(dateTime asc) [0...20] {
  _id,
  title,
  dateTime,
  description,
  location
}
```

- `dateTime >= now()` — server-side filtering, not client-side
- `order(dateTime asc)` — earliest events first
- `[0...20]` — max 20 events (EXPERIENCE.md cap)
- No pagination in v1 — Content Manager keeps list trim

### Sanity Schema Contract (AD-10)

```
wardEvent:
  title       → string  (required)
  dateTime    → datetime (ISO 8601, required) — NOT Sanity 'date' type
  description → text    (optional)
  location    → string  (optional)
```

`wardEvent.dateTime` is Sanity type `datetime` (full ISO 8601 timestamp with time), NOT `date` (YYYY-MM-DD only). This is critical for human-readable time formatting.

### Previous Story Intelligence

Story 4.1 establishes:
- The `/connect` page shell at `app/(site)/connect/page.tsx`
- Page `<title>` as "Let's Connect — Tooele YSA Ward"
- `<h1>` for the page
- `export const revalidate = 60`
- Section-band pattern with eyebrow → headline → content
- App link cards grid in the first section

This story ADDS the events section below the app link cards. Do NOT recreate the page shell or duplicate the ISR export.

### File Locations

| File | Action | Purpose |
|------|--------|---------|
| `app/(site)/connect/page.tsx` | UPDATE | Add events section with GROQ fetch below existing app link cards |
| `components/event-item.tsx` | NEW | Event list item component |

### Testing Guidance

- Create 3+ test `wardEvent` documents in Sanity Studio with varying dates (past, today, future)
- Verify past events are NOT displayed
- Verify future events sort ascending by date
- Verify date format: "Monday, July 7 at 7:00 PM" style
- Verify optional description renders when present, hidden when absent
- Verify optional location renders when present, hidden when absent
- Verify empty state message when zero upcoming events exist
- Delete all events and verify graceful empty state
- Verify error resilience: temporarily break the Sanity connection and confirm the page renders with empty state (no 500 error)
- Verify app link cards from Story 4.1 still render correctly above the events section
- Verify semantic heading structure: `<h1>` (page) → `<h2>` (sections)
- Verify the Content Manager can create/edit/delete events in Sanity Studio without developer help

### Project Structure Notes

- `event-item.tsx` is used only on `/connect` — not shared across pages.
- Date formatting utility can be co-located in `event-item.tsx` or extracted to `lib/format.ts` if other pages later need date formatting. Developer's judgment — keep it simple for now.
- The page update pattern: this story modifies `connect/page.tsx` created in Story 4.1. Read the file thoroughly before modifying. Preserve all existing content (app link cards section, page metadata, ISR export).

### References

- [Source: epics.md#Story 4.2] — Full acceptance criteria and FR coverage (FR-14, FR-15)
- [Source: ARCHITECTURE-SPINE.md#AD-2] — ISR rendering for /connect
- [Source: ARCHITECTURE-SPINE.md#AD-3] — Server-only CMS data fetching
- [Source: ARCHITECTURE-SPINE.md#AD-4] — Named GROQ query exports only
- [Source: ARCHITECTURE-SPINE.md#AD-9] — Sanity client singleton
- [Source: ARCHITECTURE-SPINE.md#AD-10] — Schema field type contracts (wardEvent.dateTime = datetime)
- [Source: ARCHITECTURE-SPINE.md#AD-12] — ISR GROQ error handling: return empty, never throw
- [Source: DESIGN.md#event-item] — Component visual tokens
- [Source: EXPERIENCE.md#Component Patterns] — Event item behavioral spec
- [Source: EXPERIENCE.md#State Patterns] — Events empty state treatment
- [Source: EXPERIENCE.md#Voice and Tone] — Event microcopy: "FHE — Monday, July 7" style

## Dev Agent Record

### Agent Model Used

github-copilot/gpt-5.5

### Debug Log References

- `python3 _bmad/scripts/resolve_customization.py --skill .agents/skills/bmad-dev-story --key workflow` failed because `python3` is unavailable; fallback customization loading was used.
- `pnpm test` red phase failed for missing `lib/format-event-date.ts` and `lib/sanity/upcoming-events.ts` before implementation.
- `pnpm test` passed: 38/38 tests.
- `pnpm lint` passed with one unrelated warning in `.agents/skills/create-agent-with-sanity-context/references/ecommerce/app/src/app/api/chat/route.ts`.
- `pnpm build` passed.

### Completion Notes List

- Verified existing `wardEvent` schema fields, required validations, plain-language labels, and schema registration.
- Verified existing `upcomingEventsQuery` filters by upcoming `wardEvent` documents, orders ascending, limits to 20, and projects required fields.
- Added `EventItem` with light list-item styling, accent-rust left border, formatted date line, optional description, and optional location.
- Added `formatEventDateTime` with `Intl.DateTimeFormat` coverage for ISO datetimes, midnight events, and date-only all-day values.
- Added server-side `fetchUpcomingEvents` helper that returns an empty list when Sanity fetching fails.
- Updated `/connect` as an async RSC to fetch upcoming events with the named query and singleton client, preserving `revalidate = 60`.
- Added events section below app link cards with empty state and semantic heading hierarchy.
- Added/updated tests for date formatting, fetch failure fallback, connect page event section placement, and page source constraints.

### File List

- sanity/schema-types/ward-event.ts
- sanity/schema-types/index.ts
- lib/sanity/queries.ts
- app/(site)/connect/page.tsx
- app/(site)/connect/page.test.mjs
- components/event-item.tsx
- lib/format-event-date.ts
- lib/sanity/upcoming-events.ts
- tests/event-date-format.test.mjs
- tests/upcoming-events.test.mjs
- _bmad-output/implementation-artifacts/4-2-ward-events-calendar.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log

- 2026-07-02: Implemented ward events calendar on `/connect`, added event item/date formatting/fetch fallback tests, and moved story to review.

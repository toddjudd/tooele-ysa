---
name: Tooele YSA Ward
description: Behavioral and information architecture specification for the Tooele Young Single Adult Ward public website — four pages, mobile-first, Tailwind CSS on Next.js.
status: draft
created: 2026-07-01
updated: 2026-07-01
sources:
  - _bmad-output/planning-artifacts/prds/prd-tooele-ysa-2026-07-01/prd.md
  - _bmad-output/planning-artifacts/prds/prd-tooele-ysa-2026-07-01/addendum.md
design: DESIGN.md
---

# Tooele YSA Ward — Experience Spine

> Paired with `DESIGN.md` (Tooele YSA Ward). Behavioral, structural, and flow decisions live here. Visual specs (colors, typography, spacing, component appearance) live in `DESIGN.md`. DESIGN.md wins on visual conflict; this spine wins on behavioral conflict.

## Foundation

Mobile-first responsive web. Next.js App Router (v14+) with Tailwind CSS. No component library framework (no shadcn, no MUI) — all UI is hand-composed from Tailwind utilities following the `DESIGN.md` token definitions. Sanity CMS v3 supplies dynamic content (hero images, leadership directory, events); everything else is statically built. Deployment target: Vercel with ISR revalidation at 60-second intervals on ISR pages.

Four pages total: **Home** (`/`), **Gatherings** (`/gatherings`), **About Us** (`/about`), **Let's Connect** (`/connect`). No auth, no forms, no user accounts. Entirely read-only public surface.

The experience principle: **orient in seconds, zero friction to act**. Every page has a single primary action. Navigation is always present and always readable.

## Information Architecture

| Surface       | Path          | Rendering    | CMS dependency       | Primary action            |
| ------------- | ------------- | ------------ | -------------------- | ------------------------- |
| Home          | `/`           | ISR (60s)    | Hero images          | Get Directions            |
| Gatherings    | `/gatherings` | SSG (static) | None                 | Get Directions (map link) |
| About Us      | `/about`      | ISR (60s)    | Leadership directory | Call/email a leader       |
| Let's Connect | `/connect`    | ISR (60s)    | Events calendar      | Browse events / open app  |

**Nav links (in order):** Home · Gatherings · About Us · Let's Connect. Order is locked — mirrors the reference site and the visitor's natural discovery journey (arrive → find us → meet us → stay connected).

**No global search.** No in-page anchors except where explicitly required (Gatherings page has logical section flow that benefits from a smooth-scroll "jump to map" treatment — optional enhancement, not required for v1).

**Footer links:** same four pages + (optional) a link to the Church's missionary contact page. Footer is not a site map; it is a re-entry point.

## Voice and Tone

Microcopy. Brand voice and aesthetic posture (editorial philosophy) live in `DESIGN.md`.

| Context            | Do                                                            | Don't                                             |
| ------------------ | ------------------------------------------------------------- | ------------------------------------------------- |
| Headings           | "Gather With Us on Sundays"                                   | "Sunday Worship Service Information"              |
| CTA buttons        | "Get Directions" · "Meet With Missionaries"                   | "Click Here" · "Submit"                           |
| Map CTA            | "We're at 196 N Pinehurst Ave"                                | "Location: 196 N Pinehurst Ave, Tooele, UT 84074" |
| Leader cards       | Bishop's name, no honorifics in labels                        | "His Eminence" · "Pastor"                         |
| Event items        | "FHE — Monday, July 7"                                        | "Family Home Evening Event on Monday 07/07/2026"  |
| Missionary section | "Our Missionaries" with a link to the Church contact page     | Named individual missionaries                     |
| Empty states       | "No upcoming events listed yet."                              | "There are currently no events in the system."    |
| Error / offline    | Not applicable — static/ISR site; no user-facing errors in v1 | —                                                 |

**LDS vocabulary notes:** Use "sacrament meeting," "ward," "bishop," "Elders Quorum," "Relief Society" naturally — these are the correct terms for the audience. Do not substitute "service," "congregation," or "pastor" as euphemisms.

**URL-facing microcopy:** Google Maps links always include the ward name in the link label for screen readers: `Get Directions to the Chapel`.

## Component Patterns

Behavioral. Visual specs for all components named here live in `DESIGN.md.Components`.

| Component          | Appears on       | Behavior                                                                                                                                                                                                                                                                                                                                             |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Site nav           | All pages        | Sticky top bar. Desktop: horizontal link list right-aligned. Mobile (< 768px): hamburger icon — tap opens a full-width drawer below the bar; tap any link or the X closes it. Escape key closes drawer. Active page link is visually distinguished.                                                                                                  |
| Hero carousel      | Home             | Auto-advances every 5 seconds. Pause on hover (desktop) / no auto-pause on touch (mobile). Swipe-left/right gesture supported on touch. Carousel indicators (dots) are visible but not the primary control. At 0 images: renders solid `{colors.primary}` background with no broken-image fallback required. No carousel controls shown at 0 images. |
| Section band       | All pages        | Full-width background color change. Content constrained to container. Opens with eyebrow → heading → optional introductory paragraph rhythm.                                                                                                                                                                                                         |
| Primary button     | Home, Gatherings | Single per section. Navigates to external URL (map, Church site) in a new tab. Never submits a form.                                                                                                                                                                                                                                                 |
| Ghost button       | Home hero        | Paired with primary button in hero. Same layout rules.                                                                                                                                                                                                                                                                                               |
| Leader card        | About Us         | CMS-driven grid (1 column mobile, 2 columns tablet, 3 columns desktop). Each card: Name, Title, optional phone `tel:` link, optional email `mailto:` link. Card renders cleanly when optional fields are absent — no empty lines, no "N/A".                                                                                                          |
| Event item         | Let's Connect    | CMS-driven list. Date + title required; description + location optional. Items sorted ascending by date. Fetch returns next 20 events maximum; no pagination in v1 (Content Manager keeps the list trim).                                                                                                                                            |
| App link card      | Let's Connect    | Static grid (2 columns mobile, 4 columns desktop). Four entries: Gospel Library, Gospel Living, Member Tools (LDS Tools), My Institute. Each is an external link opening in a new tab with `rel="noopener noreferrer"`. Icons are SVG or PNG, supplied by Todd.                                                                                      |
| Missionaries block | About Us         | Fully static. Phone number displayed as `tel:` link. Primary link → `https://www.churchofjesuschrist.org/welcome/meet-with-missionaries?lang=eng`. No individual missionary names are displayed — only the shared phone number and the Church contact link.                                                                                          |
| Building layout    | Gatherings       | Static `<img>` with descriptive `alt`. Served from the Next.js `public/` folder. Image is supplied by Todd at build time. Adjacent or below: a classroom assignment list (static text, not CMS).                                                                                                                                                     |
| Footer             | All pages        | Dark band. Tagline · Nav links · Copyright. No social media links in v1 unless added by Todd.                                                                                                                                                                                                                                                        |

## State Patterns

| State                              | Surface       | Treatment                                                                                                                                                                                                        |
| ---------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero: 0 images (no Sanity content) | Home          | Solid `{colors.primary}` background. Tagline and buttons render normally over it. No broken-image indicator.                                                                                                     |
| Hero: 1 image                      | Home          | Static (no carousel controls, no dots). Image fills hero.                                                                                                                                                        |
| Hero: 2+ images                    | Home          | Carousel behavior active. Dots visible. Auto-advance at 5s.                                                                                                                                                      |
| Leadership directory: empty        | About Us      | Section renders with heading "OUR LEADERSHIP" and static missionaries block below. The leader grid area shows: "Leadership information will be added soon." in `{typography.body}`, `{colors.on-surface-muted}`. |
| Leader card: optional field absent | About Us      | Card reflows — the absent field line is omitted entirely. Padding adjusts. No gap or placeholder text.                                                                                                           |
| Events: empty                      | Let's Connect | Static text: "No upcoming events listed yet." in `{typography.body}`, `{colors.on-surface-muted}`. App link grid and missionaries block still render normally.                                                   |
| Mobile nav: open                   | All pages     | Drawer slides down (or fades in) below the fixed nav bar. Page content is visible but inert (focus trapped inside drawer).                                                                                       |
| Mobile nav: closed                 | All pages     | Default state. Drawer not in DOM or `hidden`.                                                                                                                                                                    |
| ISR stale content                  | All pages     | Transparent to the visitor — ISR handles revalidation server-side. No loading spinners, no "refresh" toasts in v1.                                                                                               |

## Interaction Primitives

**Touch-first.** The primary audience is 18–30-year-olds on mobile. Every tap target is minimum 44×44px per WCAG 2.1 guidelines. Tap targets on leader cards include the full card row for the phone/email link, not just the text.

**External links.** All external links (Google Maps, Church websites, app stores, My Institute) open in a new tab with `target="_blank" rel="noopener noreferrer"`. This is enforced globally — no exceptions.

**No hover-only interactions.** All hover states (button darkening, nav link color change) have equivalent focus states for keyboard users. Touch users never rely on hover.

**Carousel gestures.** Swipe left: advance to next. Swipe right: go to previous. Threshold: 40px horizontal movement minimum before registering a swipe. Carousel does not hijack vertical scroll.

**tel: links.** All phone numbers on the site are wrapped in `tel:` href attributes. On desktop, the link opens the system default phone handler. On mobile, it dials directly. Both behaviors are correct.

**Keyboard nav.** Tab order follows reading order (top to bottom, left to right). Nav drawer: when open, tab cycles through nav links and the close button only. Esc closes drawer and returns focus to the hamburger button.

## Accessibility Floor

Behavioral rules. Visual contrast specifications (minimum ratios) live in `DESIGN.md`.

- All images (`<img>`) have non-empty `alt` attributes. Hero carousel images inherit the Sanity `title` field value as their `alt`. The building layout image has a descriptive human-written `alt` set by Todd at build time.
- Carousel: includes `role="region"` and `aria-label="Hero Carousel"`. Carousel items use `aria-hidden="true"` on non-active slides. Prev/next controls (if rendered) have `aria-label` text.
- Leader cards: phone and email links have descriptive `aria-label` attributes: `aria-label="Call [Name]: [number]"` and `aria-label="Email [Name]"`.
- App link cards: `aria-label="Open Gospel Library"` etc. (external link behavior described by `aria-describedby` or by the visible "(opens in new tab)" pattern — use the visually-hidden suffix approach).
- Skip-to-main-content link present on all pages. Visually hidden by default; shown on focus.
- Page `<title>` elements: Home → "Tooele YSA Ward", inner pages → "[Page Name] — Tooele YSA Ward".
- Semantic heading order: `<h1>` once per page (hero tagline on Home; page title on inner pages). Section headings are `<h2>`. Card names are `<h3>`. Never skip heading levels.
- Focus indicators: native browser default not suppressed. Tailwind `ring` utility applied consistently on all interactive elements.

**Contrast:** `{colors.on-surface}` on `{colors.surface}` exceeds 7:1 (AAA). `{colors.on-primary}` on `{colors.primary}` exceeds 7:1. `{colors.on-accent-rust}` on `{colors.accent-rust}` must be verified — if it falls below 4.5:1, `{colors.on-accent-rust}` shifts to `#FFFFFF` (already specified) and the hover state darkens further to maintain ratio. [ASSUMPTION: contrast ratios pass with the specified tokens — verify in implementation with a tool like axe-core.]

## Key Flows

### Flow 1 — Visitor finds when and where to show up (UJ-1)

**Protagonist:** Taylor, new to Tooele, searching for a YSA ward on Sunday afternoon. On mobile Chrome.

1. Taylor taps a search result link and lands on the Home page.
2. The hero loads with a full-bleed carousel image. "TOGETHER IN CHRIST" fills the viewport. "TOOELE YSA WARD" eyebrow is visible above it.
3. Two buttons: "Get Directions" (rust, primary) and "Meet With Missionaries" (ghost). Taylor ignores both — she sees the "GATHERINGS" nav link.
4. Taylor taps "Gatherings" in the nav (or the nav opens via hamburger, she taps "Gatherings").
5. Gatherings page loads. Section heading: "GATHER WITH US ON SUNDAYS". She reads: "Sundays, 11:00 AM – 1:00 PM · 196 N Pinehurst Ave, Tooele, UT 84074."
6. Below: "Get Directions to the Chapel" button. Taylor taps it.
7. **Climax:** Google Maps opens with the chapel location. Taylor has what she needs in under 30 seconds, no account required.

### Flow 2 — Member looks up the bishop's phone number (UJ-2)

**Protagonist:** Marcus, active ward member, needs to schedule a temple recommend interview. On iPhone Safari.

1. Marcus opens `tooelaysa.org` directly and taps "About Us."
2. About Us loads. Section heading: "OUR LEADERSHIP." Leader cards in a 1-column grid.
3. He scans: the first card reads "Bishop — [Name]" with a phone number link.
4. **Climax:** Marcus taps the `tel:` link. iOS dials directly.
5. Resolution: No group text, no asking around. Task complete in 10 seconds.

### Flow 3 — Content Manager publishes a new hero image (UJ-3)

**Protagonist:** Sierra, the ward Content Manager, on her laptop after designing a Sunday announcement in Canva.

1. Sierra exports the Canva graphic as a PNG (1920×1080 or similar).
2. She opens Sanity Studio (`/studio` route on the deployed site or localhost) and logs in.
3. She navigates to Hero Images → New.
4. She uploads the Canva export. Sets Display Order. Sets `isActive: true`. Clicks Publish.
5. **Climax:** Within 60 seconds (ISR revalidation interval), the image appears in the Home page carousel for any visitor loading the page.
6. Resolution: Sierra confirms live in a private browser tab. No Slack message to Todd.

### Flow 4 — Member checks upcoming ward activities (UJ-4)

**Protagonist:** Jada, active ward member, curious what's on this month. On Android Chrome.

1. Jada opens the site and taps "Let's Connect."
2. The page loads. Below the app link cards is the "UPCOMING EVENTS" section.
3. She sees a date-accented list: FHE (Monday), Ward Temple Trip (Saturday), Activity Night (Friday).
4. **Climax:** Jada knows the schedule without asking anyone.
5. Resolution: She taps "Let's Connect" in the footer later to find the missionary contact link for a friend.

## Responsive & Platform

**Mobile (<640px):**

- Nav collapses to hamburger.
- Hero text at `{typography.display-mobile}` (34px).
- Section headings at `{typography.headline-mobile}` (22px).
- Leader card grid: 1 column.
- App link card grid: 2 columns.
- Section padding: `{spacing.section-v-mobile}` (56px).

**Tablet (640–1023px):**

- Nav may remain hamburger or expand to inline links at 768px breakpoint — implement inline links at 768px+.
- Leader card grid: 2 columns.
- App link card grid: 2–3 columns.

**Desktop (≥1024px):**

- Nav fully expanded.
- Leader card grid: 3 columns.
- App link card grid: 4 columns.
- Container max-width `{spacing.container-max}` (1100px), centered.
- Hero: 100vh.

**Platform notes:** iOS Safari receives standard HTML/CSS. No PWA, no service worker, no offline mode in v1. The site is a public information resource, not an application — browser caching and Vercel CDN are sufficient.

## Content Ownership Map

| Content area                       | Owner           | Edit method              | Update frequency              |
| ---------------------------------- | --------------- | ------------------------ | ----------------------------- |
| Hero carousel images               | Content Manager | Sanity CMS               | Weekly / as needed            |
| Leadership directory               | Content Manager | Sanity CMS               | When callings change          |
| Events calendar                    | Content Manager | Sanity CMS               | Monthly                       |
| Meeting time + address             | Todd            | Next.js source code      | Rarely / stable               |
| Building layout image              | Todd            | Next.js `public/` folder | Rarely                        |
| Classroom assignments              | Todd            | Next.js source code      | Quarterly at most             |
| App link URLs                      | Todd            | Next.js source code      | Rarely                        |
| Missionary phone number            | Todd            | Next.js source code      | When missionaries change      |
| Ward tagline                       | Todd            | Next.js source code      | Stable                        |
| Ward identity paragraph (About Us) | Todd            | Next.js source code      | Rarely; lorem ipsum at launch |

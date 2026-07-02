---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-tooele-ysa-2026-07-01/prd.md
  - _bmad-output/planning-artifacts/prds/prd-tooele-ysa-2026-07-01/addendum.md
  - _bmad-output/planning-artifacts/architecture/architecture-tooele-ysa-2026-07-01/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-tooele-ysa-2026-07-01/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-tooele-ysa-2026-07-01/DESIGN.md
---

# Tooele YSA Ward Website - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the Tooele YSA Ward Website, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: The Home page shall render a full-width static hero image fetched from the `heroImage` Sanity document type. The Content Manager can replace the hero image without developer involvement. Image delivered via Sanity CDN with WebP conversion and responsive srcset. When no image is published, the hero section renders with a solid CSS background (`{colors.primary}`). No carousel, no rotation, no auto-advance — single image only.

FR-2: The Home page shall display the ward tagline "Together in Christ" as a prominent typographic element, positioned below or overlaid on the Hero Carousel. Hardcoded in Next.js, visible without JavaScript.

FR-3: The Home page shall display a static "join us" block naming the meeting time (Sundays, 11:00 AM – 1:00 PM) with a link to the Gatherings page.

FR-3a: The Home page shall display two Sanity-driven content sections (modeled on the reference site's "Good Morning Locals" / "Good Evening Locals" sections). Each section consists of a background image and overlaid text fields (eyebrow, heading, body copy) managed in Sanity CMS. The Content Manager can update the background image and text for each section independently without developer involvement. Text renders as real HTML over the image for responsiveness and accessibility. Two distinct Sanity document types — one per section position (e.g., `homeSectionTop`, `homeSectionBottom`).

FR-4: The Home page shall include a Google Maps CTA button linking to the chapel (https://maps.app.goo.gl/s6kaRrALfUj1PGRU7), opening in a new tab with an accessible label.

FR-5: The Gatherings page shall display the Sunday sacrament meeting schedule (11:00 AM – 1:00 PM) and chapel address (196 N Pinehurst Ave, Tooele, UT 84074) in a visually prominent section.

FR-6: The Gatherings page shall include a Google Maps link (and optionally an embedded iframe map) for the chapel address.

FR-7: The Gatherings page shall display a static building layout image and classroom assignment list. Both sourced as static assets in the Next.js project.

FR-8: The Gatherings page shall include practical attendance notes for first-time attendees: what to expect, parking, building access.

FR-9: The About Us page shall render a Leadership Directory fetched from the `leaderCard` Sanity document type. Each card displays Name, Title, Phone (optional), Email (optional). Content Manager can manage without developer involvement.

FR-10: Each Leader Card shall present Name and Title as primary text; Phone as a tappable tel: link; Email as a tappable mailto: link. Visual layout consistent regardless of which optional fields are present.

FR-11: The About Us page shall include a static Missionaries section with a fixed contact phone number (tel: link) and a link to the Church missionary contact page. Hardcoded in Next.js; independent of Sanity.

FR-12: The Let's Connect page shall display link cards for four LDS digital tools (Gospel Library, Gospel Living, Member Tools, My Institute), each opening in a new tab.

FR-13: The Let's Connect page shall display link cards for ward Instagram and Facebook pages. Before handles are confirmed, cards render with href="#" and a visible "Coming Soon" badge.

FR-14: The Let's Connect page shall render an event list fetched from the `wardEvent` Sanity document type. Events displayed chronologically ascending, filtered to current/future dates only. Graceful empty state when zero events exist.

FR-15: Each event shall display Title and Date/Time as primary content, with optional Description and Location as secondary content. Date/Time formatted in human-readable form. No separate event detail route in v1.

FR-16: All pages shall include a top navigation bar with links to Home, Gatherings, About Us, Let's Connect. Active page link visually distinguished. Navigation collapses to mobile menu at 768px breakpoint.

FR-17: All pages shall include a footer displaying the ward name ("Tooele YSA Ward") and current copyright year.

### NonFunctional Requirements

NFR-1: Core Web Vitals targets — LCP ≤ 2.5s, CLS < 0.1, measured on mobile 4G. Sanity image CDN with responsive srcset and Next.js Image component for hero images.

NFR-2: Hero image and home content section images delivered as WebP via Sanity's image transformation pipeline.

NFR-3: Static pages (Gatherings) use SSG. CMS-driven sections (Home hero, About Us leadership, Let's Connect events) use ISR with revalidation interval of 60 seconds.

NFR-4: All images have descriptive alt text. Interactive elements have accessible labels. Color contrast meets WCAG 2.1 AA minimum.

NFR-5: All four pages are keyboard-navigable; focus order is logical.

NFR-6: All pages render correctly on viewports 375px and above. Single-column on mobile, expanding at md breakpoint (768px+).

NFR-7: Sanity document type field labels and descriptions use plain language so the Content Manager can complete all operations without developer assistance.

NFR-8: No user authentication, no server-side form submissions, no user-generated content in v1. Contact interactions are tel: and mailto: links only.

NFR-9: Sanity Studio protected by Sanity's standard authentication. API token stored as server-side env var, never exposed to client bundle.

### Additional Requirements

- Architecture specifies a greenfield scaffold from Next.js App Router with embedded Sanity Studio (AD-1, AD-6, AD-7)
- Sanity client singleton pattern required — one client exported from `lib/sanity/client.ts` with fixed apiVersion, useCdn, perspective params (AD-9)
- All GROQ queries must be named exports from `lib/sanity/queries.ts` — no inline query strings in page files (AD-4)
- `sanity-image.tsx` is the mandatory wrapper for all Sanity-sourced images — no raw `<img>` or un-wrapped `next/image` with Sanity URLs (AD-5)
- TypeScript strict mode required; Sanity document types generated via `sanity-typegen`, living in `lib/types.ts` (AD-11)
- ISR pages must wrap GROQ fetches in try/catch, returning empty arrays on failure — never throw (AD-12)
- Tailwind CSS v4 configured CSS-first: `@import "tailwindcss"` in globals.css with all design tokens in a `@theme {}` block — no JS config file (AD-8)
- Per-route rendering strategy enforced: `/gatherings` is SSG (no revalidate), all other pages ISR with `export const revalidate = 60` (AD-2)
- Server-only CMS data fetching — all GROQ queries in RSC or at build time; SANITY_API_READ_TOKEN never prefixed NEXT_PUBLIC_ (AD-3)
- Sanity schema field type contracts: `wardEvent.dateTime` is Sanity `datetime`, `heroImage.image` is `image` with `hotspot: true`, `leaderCard.phone/email` are optional strings (AD-10)
- Two new Sanity document types required for Home page content sections: `homeSectionTop` and `homeSectionBottom` — each with fields for background image (`image` with `hotspot: true`), eyebrow text (string), heading text (string), and body copy (text). These are singleton-style documents (one per section position)
- Environment variables: 4 required vars set in Vercel dashboard only, `.env.example` committed with var names (AD-7)
- External links always use `target="_blank" rel="noopener noreferrer"` — enforced in components
- Minimum 44×44 CSS px tap targets for all interactive elements

### UX Design Requirements

UX-DR1: Implement the complete Tailwind v4 @theme token system from DESIGN.md — 15 named colors with semantic roles, 8 typography roles (display, display-mobile, headline, headline-mobile, section-label, body-lg, body, body-sm, cta), spacing scale (section-v, section-v-mobile, container-max, container-px, container-px-lg, stack-sm/md/lg/xl), and zero border-radius defaults in globals.css.

UX-DR2: Load Montserrat font in weights 400, 700, 800, and 900 only. No intermediate weights. Single typeface for entire site.

UX-DR3: Implement the Site Nav component — sticky top bar, 72px desktop / 64px mobile, dark teal background, logo left, links right in section-label style, active link in accent-teal. Mobile hamburger at <768px with full-width drawer, Escape key closes drawer, focus trapped inside when open.

UX-DR4: Implement the Hero component as a single static full-bleed image (no carousel, no rotation, no controls). Two states: 0 images (solid primary background fallback), 1 image (displayed full-bleed). Dark overlay (primary color at 0.45 opacity) over the image for text contrast. Overlaid: ward name eyebrow, tagline "TOGETHER IN CHRIST", and two buttons (Get Directions primary + Meet With Missionaries ghost). 100vh desktop, 85vh mobile.

UX-DR5: Implement the section-band pattern — every content section uses the eyebrow (section-label) → headline → optional body-lg intro paragraph rhythm. Full-width background color bands with content constrained to container max-width.

UX-DR6: Implement Primary Button component (accent-rust background, on-accent-rust text, 14px 32px padding, cta font, hover darkens to #8f3f23, zero radius) and Ghost Button variants (ghost-light for dark backgrounds, ghost-dark for light backgrounds, 2px border, transparent background).

UX-DR7: Implement the Leader Card component — flat rectangular card with surface background, 1px border, Name in section-label/primary color, Title in body-sm/muted, phone/email links in accent-rust with full-line tap targets. Graceful reflow when optional fields absent. Responsive grid: 1 column mobile, 2 columns tablet, 3 columns desktop.

UX-DR8: Implement the Event Item component — left-bordered list item (3px solid accent-rust), date in section-label style/accent-rust, title in body-lg, optional description in body/muted. No card frame. Sorted ascending by date, max 20 events fetched, past events filtered out.

UX-DR9: Implement the App Link Card component — dark primary background, icon in accent-teal, name in section-label/on-primary, hover background shift. External link in new tab. Responsive grid: 2 columns mobile, 4 columns desktop.

UX-DR10: Implement the Footer component — full-bleed primary background, tagline "Together in Christ" in headline-mobile/accent-teal, four nav links in section-label style, copyright line, horizontal top border.

UX-DR11: Implement the Missionaries Block component — fully static, phone number as tel: link, primary link to Church missionary contact page. No individual missionary names.

UX-DR12: Implement all state patterns from EXPERIENCE.md: hero 0/1 image states, home content section empty states (graceful fallback when no Sanity content published), leadership directory empty state ("Leadership information will be added soon."), leader card optional field absent reflow, events empty state ("No upcoming events listed yet."), mobile nav open/closed with focus trapping, ISR stale content (transparent to visitor).

UX-DR13: Implement accessibility floor — skip-to-main-content link (visually hidden, shown on focus), semantic heading order (one h1 per page), page title pattern ("[Page Name] — Tooele YSA Ward"), hero ARIA attributes, leader card aria-labels on phone/email links, app link card aria-labels with visually-hidden "(opens in new tab)" suffix.

UX-DR14: Implement dark/light section alternation pattern — dark nav → dark hero → light content → optional surface-warm tint sections → dark footer. No additional dark bands mid-page on interior pages.

UX-DR15: Implement responsive breakpoints — mobile (<640px), tablet (640–1023px), desktop (≥1024px) with specific layout adaptations: nav collapse at 768px, leader card grid columns (1/2/3), app link card grid columns (2/2-3/4), typography scale shifts (display-mobile vs display, headline-mobile vs headline), section padding shifts (56px mobile vs 88px desktop).

UX-DR16: Implement the Building Layout component on Gatherings page — static img from public/ folder with descriptive alt text, adjacent classroom assignment list as static text.

UX-DR17: Implement the Home Content Section component — a reusable section band with a Sanity-driven background image (delivered via sanity-image.tsx wrapper with dark overlay for text contrast) and overlaid HTML text fields (eyebrow, heading, body copy). Text is responsive and accessible. Two instances on the Home page, each backed by its own Sanity document type. Graceful empty state when no content is published (section renders with surface-warm background and placeholder text or is omitted).

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR-1 | Epic 1 | Static hero image from Sanity |
| FR-2 | Epic 1 | Tagline display |
| FR-3 | Epic 1 | Static "join us" meeting time block |
| FR-3a | Epic 1 | Two Sanity-driven content sections |
| FR-4 | Epic 1 | Google Maps CTA |
| FR-5 | Epic 2 | Meeting time and address |
| FR-6 | Epic 2 | Google Maps link/embed |
| FR-7 | Epic 2 | Building layout + classroom list |
| FR-8 | Epic 2 | Practical attendance info |
| FR-9 | Epic 3 | Leadership directory (Sanity) |
| FR-10 | Epic 3 | Leader card display |
| FR-11 | Epic 3 | Missionaries section (static) |
| FR-12 | Epic 4 | LDS app link tree |
| FR-13 | Epic 4 | Social media links (Coming Soon) |
| FR-14 | Epic 4 | Events calendar (Sanity) |
| FR-15 | Epic 4 | Event display |
| FR-16 | Epic 1 | Global navigation |
| FR-17 | Epic 1 | Footer |

## Epic List

### Epic 1: Project Foundation & Home Page
A visitor can land on the site, see the hero image with the ward tagline, read the two Sanity-driven content sections, get directions to the chapel, and navigate to any page via the site nav and footer.
**FRs covered:** FR-1, FR-2, FR-3, FR-3a, FR-4, FR-16, FR-17
**NFRs addressed:** NFR-1, NFR-2, NFR-3, NFR-4, NFR-5, NFR-6, NFR-7, NFR-8, NFR-9
**UX-DRs addressed:** UX-DR1, UX-DR2, UX-DR3, UX-DR4, UX-DR5, UX-DR6, UX-DR10, UX-DR12 (hero/nav/home section states), UX-DR13, UX-DR14, UX-DR15, UX-DR17

### Epic 2: Gatherings Page
A visitor can find the meeting time, address, get directions via Google Maps, see the building layout and classroom assignments, and read practical attendance information — all from a fully static page.
**FRs covered:** FR-5, FR-6, FR-7, FR-8
**UX-DRs addressed:** UX-DR5, UX-DR6, UX-DR16

### Epic 3: About Us Page
A member can look up any ward leader's phone number or email and call/email them directly. The Content Manager can update the leadership directory in Sanity when callings change. Visitors can find missionary contact information.
**FRs covered:** FR-9, FR-10, FR-11
**UX-DRs addressed:** UX-DR7, UX-DR11, UX-DR12 (leadership empty state, optional field reflow)

### Epic 4: Let's Connect Page
A member can browse upcoming ward events, access LDS digital tools, and find ward social media links. The Content Manager can add and manage events in Sanity.
**FRs covered:** FR-12, FR-13, FR-14, FR-15
**UX-DRs addressed:** UX-DR8, UX-DR9, UX-DR12 (events empty state)

---

## Epic 1: Project Foundation & Home Page

A visitor can land on the site, see the hero image with the ward tagline, read the two Sanity-driven content sections, get directions to the chapel, and navigate to any page via the site nav and footer.

### Story 1.1: Project Scaffold & Design System Tokens

As a developer,
I want the Next.js App Router project scaffolded with Tailwind v4 CSS-first configuration and all DESIGN.md tokens implemented,
So that all subsequent pages and components build on a consistent, production-ready foundation.

**Acceptance Criteria:**

**Given** a fresh project directory
**When** the scaffold is complete
**Then** the following are in place:
**And** Next.js App Router project initialized with TypeScript strict mode
**And** `globals.css` contains `@import "tailwindcss"` and a `@theme {}` block with all 15 DESIGN.md colors, 8 typography roles, spacing scale, and zero border-radius defaults
**And** Montserrat loaded in weights 400, 700, 800, 900 only via `next/font/google`
**And** Root `layout.tsx` applies font and globals.css
**And** `.env.example` committed with all 4 required env var names (`SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_STUDIO_URL`)
**And** `tsconfig.json` has `"strict": true`
**And** Project runs with `pnpm dev` without errors

### Story 1.2: Sanity Studio & CMS Infrastructure

As a Content Manager,
I want Sanity Studio embedded in the site and all Home page content schemas created,
So that I can manage hero images and content sections through the CMS.

**Acceptance Criteria:**

**Given** the scaffolded project from Story 1.1
**When** Sanity integration is complete
**Then** Sanity Studio is accessible at `/studio` with Sanity-native authentication
**And** `lib/sanity/client.ts` exports a singleton client with fixed apiVersion, `useCdn: true`, `perspective: 'published'`
**And** `lib/sanity/queries.ts` exists with named GROQ query exports
**And** `lib/sanity/image.ts` exports the `@sanity/image-url` builder instance
**And** `components/sanity-image.tsx` wrapper component created with WebP format and quality(80)
**And** Three Sanity schema types created: `heroImage` (image with hotspot, title), `homeSectionTop` (background image with hotspot, eyebrow string, heading string, body text), `homeSectionBottom` (same shape as homeSectionTop)
**And** Schema field labels use plain language (e.g., "Background Image", "Section Heading")
**And** `sanity-typegen` generates types to `lib/types.ts`
**And** GROQ queries defined: `heroImageQuery`, `homeSectionTopQuery`, `homeSectionBottomQuery`
**And** `leaderCard` schema created (name, title, phone optional, email optional, displayOrder)
**And** `wardEvent` schema created (title, dateTime as Sanity `datetime`, description optional, location optional)
**And** GROQ queries defined: `leaderCardsQuery`, `upcomingEventsQuery`

### Story 1.3: Site Navigation & Footer Shell

As a visitor,
I want a persistent navigation bar and footer on every page,
So that I can move between pages and always know I'm on the Tooele YSA Ward website.

**Acceptance Criteria:**

**Given** a visitor on any page at desktop width (≥768px)
**When** they view the nav
**Then** they see a sticky 72px dark teal bar with logo/wordmark left and four links right (Home, Gatherings, About Us, Let's Connect) in section-label style, with the active page link in accent-teal

**Given** a visitor on mobile (<768px)
**When** they tap the hamburger icon
**Then** a full-width drawer opens below the nav bar with all four links
**And** Escape key closes the drawer
**And** Focus is trapped inside the open drawer
**And** Tapping any link or the X button closes the drawer

**Given** a visitor on any page
**When** they scroll to the footer
**Then** they see the full-bleed dark primary footer with "Together in Christ" tagline in headline-mobile/accent-teal, four nav links in section-label style, and copyright line with current year
**And** Horizontal top border per DESIGN.md footer spec

**Given** a keyboard user on any page
**When** they press Tab
**Then** a skip-to-main-content link appears on focus (visually hidden otherwise)

**And** All nav links resolve to correct routes (`/`, `/gatherings`, `/about`, `/connect`)
**And** `app/(site)/layout.tsx` renders SiteNav and Footer on all pages
**And** Minimum 44×44px tap targets on all interactive elements
**And** Mobile nav height is 64px per DESIGN.md

### Story 1.4: Hero Section

As a visitor,
I want to see a striking full-screen hero with the ward's image and tagline when I land on the Home page,
So that I immediately understand this is the Tooele YSA Ward and feel welcomed.

**Acceptance Criteria:**

**Given** one heroImage document is published in Sanity
**When** a visitor loads the Home page
**Then** the hero renders full-bleed at 100vh desktop / 85vh mobile with the Sanity image, a dark overlay (primary at 0.45 opacity), the ward name eyebrow ("TOOELE YSA WARD" in section-label style), the tagline "TOGETHER IN CHRIST" in display typography, and two buttons side by side: "Get Directions" (primary/rust) and "Meet With Missionaries" (ghost-light)

**Given** zero heroImage documents in Sanity
**When** a visitor loads the Home page
**Then** the hero renders with a solid `{colors.primary}` background — no broken image, no placeholder
**And** Tagline and buttons still render normally

**Given** a visitor views the hero buttons
**When** they tap "Get Directions"
**Then** Google Maps opens in a new tab to `https://maps.app.goo.gl/s6kaRrALfUj1PGRU7` with `target="_blank" rel="noopener noreferrer"` and accessible label "Get Directions to the Chapel"

**Given** a visitor views the hero buttons
**When** they tap "Meet With Missionaries"
**Then** the Church missionary page opens in a new tab to `https://www.churchofjesuschrist.org/welcome/meet-with-missionaries?lang=eng` with `target="_blank" rel="noopener noreferrer"`

**And** Hero image delivered via `sanity-image.tsx` wrapper with WebP format and responsive srcset
**And** GROQ fetch wrapped in try/catch — on error returns empty, hero renders fallback state (AD-12)
**And** `export const revalidate = 60` on the Home page module (ISR)
**And** Page `<title>` is "Tooele YSA Ward"
**And** `<h1>` is the tagline "Together in Christ"

### Story 1.5: Home Page Content Sections

As a Content Manager,
I want to update the two featured content sections on the Home page through Sanity,
So that I can keep the ward's welcome messaging and imagery fresh without contacting the developer.

**Acceptance Criteria:**

**Given** a homeSectionTop document is published in Sanity with background image, eyebrow, heading, and body text
**When** a visitor loads the Home page
**Then** the first content section renders below the hero with the background image (via sanity-image.tsx, dark overlay for text contrast), and overlaid HTML text: eyebrow in section-label style, heading in headline style, body in body-lg

**Given** a homeSectionBottom document is published with the same fields
**When** a visitor loads the Home page
**Then** the second content section renders below the first with the same component pattern

**Given** no homeSectionTop or homeSectionBottom document is published
**When** a visitor loads the page
**Then** the section renders gracefully — either with a surface-warm background and placeholder text, or is omitted entirely without breaking the layout

**Given** a visitor views the Home page below the content sections
**When** they see the "join us" block
**Then** it displays "Sundays, 11:00 AM – 1:00 PM" with a working link to `/gatherings`

**And** Section eyebrow → headline → body rhythm follows UX-DR5 pattern
**And** Dark/light alternation: dark hero → light/warm content sections → dark footer (UX-DR14)
**And** Text is responsive (real HTML, not baked into images) and accessible
**And** GROQ fetches wrapped in try/catch per AD-12
**And** Content sections use the reusable Home Content Section component (UX-DR17)

---

## Epic 2: Gatherings Page

A visitor can find the meeting time, address, get directions via Google Maps, see the building layout and classroom assignments, and read practical attendance information — all from a fully static page.

### Story 2.1: Gatherings Page — Meeting Info, Map & Attendance Guide

As a visitor,
I want to see the meeting time, chapel address, directions, building layout, classroom assignments, and what to expect as a first-timer — all on one page,
So that I have everything I need to attend a Sunday meeting without asking anyone.

**Acceptance Criteria:**

**Given** a visitor navigates to `/gatherings`
**When** the page loads
**Then** they see a clearly labeled section displaying "Sundays, 11:00 AM – 1:00 PM" and "196 N Pinehurst Ave, Tooele, UT 84074" as rendered, search-engine-crawlable text

**Given** a visitor views the map section
**When** they tap/click the "Get Directions to the Chapel" button
**Then** Google Maps opens in a new tab to `https://maps.app.goo.gl/s6kaRrALfUj1PGRU7` with `target="_blank" rel="noopener noreferrer"` and an accessible label

**Given** a visitor scrolls to the building section
**When** they view the building layout
**Then** a static image from `public/images/floor-plan.*` renders with a descriptive `alt` attribute
**And** A classroom assignment list is present as readable, accessible text adjacent to or below the image

**Given** a first-time visitor
**When** they view the attendance section
**Then** they see practical notes including parking guidance and a brief expectation-setting paragraph about attending a YSA sacrament meeting

**And** Page uses SSG — no `revalidate` export, no GROQ call (AD-2)
**And** Page follows the section-band pattern: each section opens with eyebrow → headline → body content (UX-DR5)
**And** Primary button styled per UX-DR6 (accent-rust, zero radius, cta font)
**And** Ghost button variant used where appropriate on light background sections (button-ghost-dark)
**And** Page `<title>` is "Gatherings — Tooele YSA Ward"
**And** Semantic heading order maintained — one `<h1>`, section headings as `<h2>`
**And** All content renders correctly at 375px viewport and up (NFR-6)
**And** Minimum 44×44px tap targets on all interactive elements

---

## Epic 3: About Us Page

A member can look up any ward leader's phone number or email and call/email them directly. The Content Manager can update the leadership directory in Sanity when callings change. Visitors can find missionary contact information.

### Story 3.1: Leadership Directory & Leader Cards

As a member,
I want to see a directory of ward leaders with their phone numbers and emails,
So that I can quickly call or email the bishop or another leader without asking around.

**Acceptance Criteria:**

**Given** one or more `leaderCard` documents are published in Sanity
**When** a visitor loads `/about`
**Then** the Leadership Directory section renders with the heading "OUR LEADERSHIP" and a responsive grid of leader cards — 1 column mobile, 2 columns tablet, 3 columns desktop

**Given** a leader card has Name, Title, Phone, and Email
**When** it renders
**Then** Name displays in section-label style / primary color, Title in body-sm / muted, Phone as a tappable `tel:` link in accent-rust with `aria-label="Call [Name]: [number]"`, and Email as a tappable `mailto:` link in accent-rust with `aria-label="Email [Name]"`

**Given** a leader card has no Phone or Email (optional fields absent)
**When** it renders
**Then** the missing field line is omitted entirely — no gap, no "N/A", no placeholder text
**And** Card reflows cleanly with consistent padding

**Given** a leader card has Phone but no Email (or vice versa)
**When** it renders
**Then** only the present field renders with consistent padding

**Given** zero `leaderCard` documents in Sanity
**When** a visitor loads `/about`
**Then** the leader grid area shows "Leadership information will be added soon." in body style / on-surface-muted color

**And** Leader cards styled per UX-DR7: flat rectangular, surface background, 1px border in border color, 24px padding
**And** Full-line tap targets on phone/email links (minimum 44×44px)
**And** Link hover state transitions from accent-rust to accent-teal
**And** GROQ query `leaderCardsQuery` fetched in RSC, wrapped in try/catch — on error returns empty array, renders empty state (AD-12)
**And** `export const revalidate = 60` on the About Us page (ISR)
**And** Page follows section-band pattern with eyebrow → headline → content (UX-DR5)

### Story 3.2: Missionaries Section & Page Assembly

As a visitor,
I want to find missionary contact information on the About Us page,
So that I or a friend can reach out to meet with missionaries in the Tooele area.

**Acceptance Criteria:**

**Given** a visitor is on `/about`
**When** they scroll below the leadership directory
**Then** they see a Missionaries section with a heading ("OUR MISSIONARIES" or similar), a contact phone number rendered as a `tel:` link, and a primary button linking to `https://www.churchofjesuschrist.org/welcome/meet-with-missionaries?lang=eng` opening in a new tab

**And** Phone number `tel:` link has an accessible `aria-label` (e.g., "Call Tooele Missionaries: [number]")
**And** External link uses `target="_blank" rel="noopener noreferrer"`
**And** Missionaries section is fully static — hardcoded in Next.js, renders identically regardless of Sanity availability
**And** No individual missionary names displayed — only the shared phone number and Church contact link
**And** Section follows the eyebrow → headline → content rhythm (UX-DR5)
**And** Button styled per UX-DR6 (primary or ghost-dark as appropriate for the section background)
**And** Page `<title>` is "About Us — Tooele YSA Ward"
**And** Semantic heading order: one `<h1>` for the page, `<h2>` for Leadership and Missionaries sections
**And** About Us page ward identity paragraph present at top of page (placeholder text acceptable for launch)

---

## Epic 4: Let's Connect Page

A member can browse upcoming ward events, access LDS digital tools, and find ward social media links. The Content Manager can add and manage events in Sanity.

### Story 4.1: LDS App Link Tree & Social Media Cards

As a member,
I want quick access to LDS digital tools and ward social media from one place,
So that I don't have to search for each app or account separately.

**Acceptance Criteria:**

**Given** a visitor navigates to `/connect`
**When** the page loads
**Then** the link tree section displays four LDS app link cards in a responsive grid — 2 columns mobile, 4 columns desktop

**Given** a visitor views the app link cards
**When** they see each card
**Then** it displays the app name in section-label style / on-primary color, an icon in accent-teal, on a dark primary background with 20px 24px padding, zero border-radius

**Given** a visitor taps/clicks an app link card
**When** the link activates
**Then** it opens the correct URL in a new tab with `target="_blank" rel="noopener noreferrer"`:
- Gospel Library → `https://www.churchofjesuschrist.org/learn/mobile-applications/gospel-library?lang=eng`
- Gospel Living → `https://www.churchofjesuschrist.org/youth/childrenandyouth/gospel-living-app?lang=eng`
- Member Tools → `https://www.churchofjesuschrist.org/tools/help/about-member-tools?lang=eng`
- My Institute → `https://myinstitute.churchofjesuschrist.org/`

**And** Each card has an accessible `aria-label` (e.g., "Open Gospel Library") with visually-hidden "(opens in new tab)" suffix
**And** Card hover state shifts background to `#0d4549`

**Given** the ward social media handles are not yet confirmed
**When** a visitor views the Instagram and Facebook cards
**Then** the cards render with `href="#"` and a visible "Coming Soon" badge or muted state that is visually distinct from active link cards — not a broken or missing element

**And** Section follows the eyebrow → headline → content rhythm (UX-DR5)
**And** Minimum 44×44px tap targets on all cards

### Story 4.2: Ward Events Calendar

As a member,
I want to see upcoming ward activities listed on the Let's Connect page,
So that I know what events are coming up without having to ask in a group text.

**Acceptance Criteria:**

**Given** one or more `wardEvent` documents are published in Sanity with current or future dates
**When** a visitor loads `/connect`
**Then** the events section renders with heading "UPCOMING EVENTS" and a list of events sorted ascending by date

**Given** an event has Title and Date/Time (required fields)
**When** it renders
**Then** the date displays in section-label style / accent-rust color, the title in body-lg / on-surface color, with a 3px solid accent-rust left border on each item
**And** No card frame — list items are visually light (UX-DR8)

**Given** an event has optional Description and/or Location
**When** it renders
**Then** the description displays in body / on-surface-muted, and location displays similarly as secondary content

**Given** an event has a Date/Time value
**When** it renders
**Then** the date is formatted in human-readable form (e.g., "Monday, July 7 at 7:00 PM")

**Given** events exist with past dates
**When** the page renders
**Then** past events are filtered out — only events on or after the current date are shown

**Given** zero upcoming events exist in Sanity
**When** a visitor loads the page
**Then** the events section renders with "No upcoming events listed yet." in body style / on-surface-muted color
**And** App link cards still render normally above

**And** GROQ query `upcomingEventsQuery` fetches a maximum of 20 events, sorted ascending by dateTime, filtered to `dateTime >= now()` — fetched in RSC, wrapped in try/catch, returns empty array on error (AD-12)
**And** `export const revalidate = 60` on the Let's Connect page (ISR)
**And** Page `<title>` is "Let's Connect — Tooele YSA Ward"
**And** Semantic heading order: one `<h1>`, `<h2>` for each section
**And** Content Manager can create, edit, and remove events in Sanity Studio without developer involvement (NFR-7)

---
title: Tooele YSA Ward Website
status: draft
created: 2026-07-01
updated: 2026-07-01
---

# PRD: Tooele YSA Ward Website

## 0. Document Purpose

This PRD defines requirements for the Tooele Young Single Adult Ward's public-facing website. It is written for the developer (Todd), the non-technical ward Content Manager, and any downstream contributors. The site has four pages; content ownership is split by change frequency — frequently-changed content (hero images, leadership directory, events) is managed through Sanity CMS, while stable content (gathering times, chapel info, building layout, missionaries contact) is statically built in Next.js. FRs are numbered globally (FR-1 through FR-N); assumptions are tagged inline with `[ASSUMPTION: ...]` and indexed in §8.

---

## 1. Vision

The Tooele YSA Ward website is the ward's public-facing front door — a welcoming, clean, and low-maintenance site modeled on The Local Church Sydney (thelocalchurchsydney.com) in layout style and tone. It exists to help visitors find where and when the ward meets, help members quickly reach ward leaders, and give everyone in the congregation a hub for LDS digital tools and upcoming events.

The site is intentionally narrow in scope: four pages, a single-column layout with strong typographic hierarchy, mobile-first, and designed to stay low-maintenance for years. A non-technical ward member manages all dynamic content through Sanity CMS without requiring developer involvement. Everything else is static and version-controlled.

The ward's tagline — _Together in Christ_ — anchors both the visual identity and the editorial tone across all pages.

---

## 2. Target User

### 2.1 Jobs To Be Done

- **Visitor (prospective attendee):** Find out when and where the ward meets; decide whether to come.
- **Member:** Quickly look up a ward leader's phone number or email.
- **Member:** Access LDS digital tools (Gospel Library, Gospel Living, Member Tools, My Institute) and ward social channels from one place.
- **Member:** Check what ward activities are coming up this month.
- **Content Manager (non-technical):** Publish a new hero image (designed in Canva) without contacting the developer.
- **Content Manager:** Add, edit, or remove an upcoming ward event from the calendar.
- **Content Manager:** Update a leader's contact info when a calling changes.

### 2.2 Non-Users (v1)

- External organizations seeking formal institutional partnerships.
- Users looking for sermon recordings, podcasts, or a media library (no media archive in v1).
- Families with children (YSA ward; single-adult audience; no children's program content needed).

### 2.3 Key User Journeys

**UJ-1. A visitor finds out when and where to show up.**

- **Persona + context:** Someone new to Tooele searching for a local YSA ward, on mobile.
- **Entry state:** Arrives at Home page from a search engine link or a shared URL.
- **Path:** Reads hero tagline → notices "Gatherings" nav item or inline CTA → lands on Gatherings page → reads "Sundays, 11:00 AM – 1:00 PM" and "196 N Pinehurst Ave" → taps Google Maps link.
- **Climax:** Address is open in Google Maps; the visitor knows exactly when and where to go.
- **Resolution:** Visitor navigates away with zero friction; no account or form required.

**UJ-2. A member finds the bishop's phone number.**

- **Persona + context:** Ward member needing to schedule a temple recommend interview, on mobile.
- **Entry state:** Opens the site directly, taps About Us.
- **Path:** Lands on About Us → scans leadership cards → sees Bishop's card with name and phone.
- **Climax:** Taps the `tel:` link to call directly.
- **Resolution:** Call placed without the member needing to ask anyone for the number.

**UJ-3. The Content Manager publishes a new hero image.**

- **Persona + context:** Ward Content Manager; designed a Sunday announcement graphic in Canva.
- **Entry state:** Logged into Sanity Studio on desktop.
- **Path:** Opens "Hero Images" document list → clicks "Add new" → uploads Canva export → sets display order → clicks Publish.
- **Climax:** Image appears in the Home page carousel on next load, Sanity-optimized (WebP, responsive sizes).
- **Resolution:** Content Manager confirms image is live; no Slack message to Todd needed.

**UJ-4. A member checks upcoming ward activities.**

- **Persona + context:** Active ward member curious what's on after church, on mobile.
- **Entry state:** Let's Connect page.
- **Path:** Scrolls past app link cards → views events list → reads event titles and dates.
- **Climax:** Sees FHE, ward temple trip, and activity night at a glance.
- **Resolution:** Member leaves informed; no group text needed to ask "what's coming up?"

---

## 3. Glossary

- **Ward** — A congregation unit of The Church of Jesus Christ of Latter-day Saints. The Tooele YSA Ward is the specific congregation this site serves.
- **YSA** — Young Single Adults; the Church's program and congregation type for single members roughly ages 18–30.
- **Bishop** — The presiding ecclesiastical leader of the ward.
- **Elders Quorum President (EQP)** — Leader of the Elders Quorum, the priesthood organization for adult male members.
- **Relief Society President (RSP)** — Leader of the Relief Society, the women's organization of the ward.
- **Building Coordinator** — The ward member responsible for chapel scheduling, facility access, and maintenance coordination.
- **Missionaries** — Full-time Church representatives assigned to the Tooele area; represented on the site as a fixed contact phone number and Church website link, not as named individuals.
- **Content Manager** — The designated non-technical ward member authorized to manage Sanity CMS content: hero images, leadership directory, and events calendar.
- **Hero Carousel** — The rotating full-width banner image(s) at the top of the Home page, sourced from Sanity CMS.
- **Sanity CMS** — The headless content management system used for all dynamic content on the site.
- **Leader Card** — A display unit on the About Us page showing a ward leader's Name, Title, and optional Phone and Email contact fields.
- **Event** — A ward activity entry in the Let's Connect calendar; has a Title, Date/Time, and optional Description and Location fields.
- **LDS Apps** — The suite of Church-published digital tools linked from the Let's Connect page: Gospel Library, Gospel Living, Member Tools (LDS Tools), and My Institute.

---

## 4. Features

### 4.1 Home Page

**Description:** The Home page is the site's primary entry point. It opens with a full-width Hero Carousel of rotating images sourced from Sanity CMS, followed by the ward tagline (_Together in Christ_), two static content blocks (a welcoming ward identity paragraph and a concise "join us" section with meeting time), and a Google Maps call-to-action directing visitors to the chapel. Overall structure and visual rhythm mirror the reference site (thelocalchurchsydney.com homepage): large visual first, short declarative copy, single action per section. Hero images are designed in Canva by the Content Manager, uploaded to Sanity, and delivered via Sanity's image CDN with automatic format and size optimization.

**Functional Requirements:**

#### FR-1: Hero Carousel — Sanity-driven image rotation

The Home page shall render a full-width Hero Carousel whose images are fetched from the `heroImage` Sanity document type. The Content Manager can add, reorder, and remove images without developer involvement.

**Consequences (testable):**

- Publishing a new `heroImage` document in Sanity causes the image to appear in the carousel on the next page load (or within CDN cache TTL).
- Removing a `heroImage` document removes it from the carousel within the same window.
- Images are delivered via Sanity's image CDN with automatic WebP conversion and a responsive `srcset`.
- Carousel renders when at least 1 image is published; if 0 images are published, the Hero section renders with a solid CSS background color (`#002735`) — no broken layout, no missing image placeholder required.

**Out of Scope:** Scheduled future publish dates for images (images go live on Publish — v1 only).

#### FR-2: Tagline display

The Home page shall display the ward tagline "Together in Christ" as a prominent typographic element, positioned below or overlaid on the Hero Carousel.

**Consequences (testable):**

- Tagline text is hardcoded in the Next.js component (not CMS-driven) and visible on page load without JavaScript.

#### FR-3: Static content blocks

The Home page shall display two static content sections: (a) a welcoming ward identity paragraph, and (b) a "join us" block that names the meeting time (Sundays, 11:00 AM – 1:00 PM) and links to the Gatherings page.

**Consequences (testable):**

- Both sections render as static Next.js content.
- The "join us" section contains the correct meeting time and a working link to `/gatherings`.

#### FR-4: Google Maps CTA

The Home page shall include a call-to-action button or link pointing to the chapel's Google Maps entry (`https://maps.app.goo.gl/s6kaRrALfUj1PGRU7`), opening in a new tab.

**Consequences (testable):**

- Link opens the correct Google Maps destination in a new browser tab.
- Link has an accessible label (e.g., "Get Directions").

---

### 4.2 Gatherings Page

**Description:** The Gatherings page gives a visitor or member every practical detail needed to attend a Sunday meeting. All content is static — no CMS. Sections include: a brief welcome and purpose statement, meeting time and chapel address, an embedded or linked Google Map, practical attendance notes (parking, what to expect), a static building layout image (floor plan or labeled photo), and a classroom assignment list. Layout mirrors the reference site's Gatherings page: intro section followed by discrete, clearly labeled content blocks.

**Functional Requirements:**

#### FR-5: Meeting time and address display

The Gatherings page shall display the Sunday sacrament meeting schedule (11:00 AM – 1:00 PM) and the chapel address (196 N Pinehurst Ave, Tooele, UT 84074) in a clearly labeled, visually prominent section.

**Consequences (testable):**

- Meeting time, day of week, and address are present as rendered text (search-engine crawlable).

#### FR-6: Google Maps integration

The Gatherings page shall include a Google Maps link (and optionally an embedded `<iframe>` map) for 196 N Pinehurst Ave, Tooele, UT 84074 using the provided short link (`https://maps.app.goo.gl/s6kaRrALfUj1PGRU7`).

**Consequences (testable):**

- Maps link/embed resolves to the correct chapel location.
- Link opens in a new tab; embedded iframe, if used, has a title attribute for accessibility.

#### FR-7: Building layout and classroom assignments

The Gatherings page shall display a static building layout image and an adjacent or below-positioned list of classrooms with their current meeting-group assignments.

**Consequences (testable):**

- Building layout image renders with a descriptive `alt` attribute.
- Classroom assignment list is present as readable, accessible text.
- Both image and list are sourced as static assets/content in the Next.js project. [ASSUMPTION: A-2 — floor plan image is supplied by Todd at build time. A-3 — classroom assignments change infrequently; static content is acceptable for v1.]

**Out of Scope:** CMS management of classroom assignments (escalate to v2 if assignments change more than quarterly).

#### FR-8: Practical attendance information

The Gatherings page shall include a section with practical notes for first-time attendees: what to expect at a YSA sacrament meeting, parking notes relevant to 196 N Pinehurst Ave, and any building access information.

**Consequences (testable):**

- Section contains at minimum parking guidance and a brief expectation-setting paragraph.

---

### 4.3 About Us Page

**Description:** The About Us page communicates ward identity and provides a directory of key ward contacts. It opens with a brief ward identity paragraph (lorem ipsum placeholder at build time, to be replaced with final copy before launch). It then presents two content areas: (a) a **Leadership Directory** managed entirely in Sanity CMS — so calling changes require no developer involvement — and (b) a **Missionaries section** that is fully static (a fixed phone number and a confirmed link to the Church's missionary contact page). The reference site's "Our Leadership" section is the structural model.

**Functional Requirements:**

#### FR-9: Leadership Directory — Sanity-managed

The About Us page shall render a Leadership Directory fetched from the `leaderCard` Sanity document type. Each card displays: Name, Title, Phone (optional), and Email (optional). The Content Manager can add, edit, and remove leader records without developer involvement.

Minimum roles represented at launch: Bishop, Elders Quorum President, Relief Society President, Building Coordinator.

**Consequences (testable):**

- Publishing a new `leaderCard` in Sanity causes a new card to appear on the page within CDN cache TTL.
- Updating a phone number or email in Sanity is reflected on the page within cache TTL.
- Removing a `leaderCard` removes it from the page.
- Cards with no phone or email render gracefully — the missing field is simply omitted with no broken layout or empty placeholder text.

#### FR-10: Leader card display

Each Leader Card shall present: Name and Title as primary text; Phone as a tappable `tel:` link (if present); Email as a tappable `mailto:` link (if present). Cards are styled consistently as a component across all leadership roles.

**Consequences (testable):**

- Phone numbers render as `tel:` links; email addresses render as `mailto:` links.
- Visual layout is consistent whether a card has both fields, one field, or neither.

#### FR-11: Missionaries section — static

The About Us page shall include a static Missionaries section displaying a fixed contact phone number (as a `tel:` link) and a link to `https://www.churchofjesuschrist.org/welcome/meet-with-missionaries?lang=eng`. Content is hardcoded in Next.js; it does not go through Sanity. [ASSUMPTION: A-5 — Todd to supply the Tooele-area missionary phone number at build time; the link target is confirmed.]

**Consequences (testable):**

- Section is present with phone rendered as a `tel:` link and external link to the Church missionary page.
- Section renders identically regardless of Sanity availability.

---

### 4.4 Let's Connect Page

**Description:** The Let's Connect page replaces the reference site's bare `mailto:` link with a full hub page organized in two sections: (a) a **Link Tree** of LDS digital tools and ward social media channels, and (b) a **Ward Events Calendar** managed through Sanity CMS. The tone matches the reference site — welcoming, direct, zero friction. Social media links (Instagram, Facebook) are built as cards now and will be pointed to `#` with a "Coming Soon" state until ward handles are confirmed. [ASSUMPTION: A-6 — social handles will be provided by Todd before the page goes live.]

**Functional Requirements:**

#### FR-12: LDS app link tree

The Let's Connect page shall display a link card for each of the following LDS digital tools, each opening in a new tab:

| Label          | Target                                                                                  |
| -------------- | --------------------------------------------------------------------------------------- |
| Gospel Library | `https://www.churchofjesuschrist.org/learn/mobile-applications/gospel-library?lang=eng` |
| Gospel Living  | `https://www.churchofjesuschrist.org/youth/childrenandyouth/gospel-living-app?lang=eng` |
| Member Tools   | `https://www.churchofjesuschrist.org/tools/help/about-member-tools?lang=eng`            |
| My Institute   | `https://myinstitute.churchofjesuschrist.org/`                                          |

**Consequences (testable):**

- All four app cards are present and each opens in a new tab.
- Each card has an accessible text label and, where available, an app icon or logo image with `alt` text.

#### FR-13: Ward social media links

The Let's Connect page shall display link cards for the ward's Instagram and Facebook pages. Before handles are confirmed, cards render with `href="#"` and a visible "Coming Soon" badge or muted state so the layout intent is preserved.

**Consequences (testable):**

- Instagram and Facebook cards are present in the link tree section.
- Links open in a new tab once handles are provided.
- "Coming Soon" state is visually distinct from active link cards; it is not a broken or missing element.

#### FR-14: Ward Events Calendar — Sanity-managed

The Let's Connect page shall render an event list fetched from the `wardEvent` Sanity document type. Events are displayed in chronological ascending order. Only events whose date is on or after the current date are shown (past events are filtered out).

Each `wardEvent` document has: Title (required), Date/Time (required), Description (optional), Location (optional).

**Consequences (testable):**

- Events published in Sanity appear in the list sorted by date ascending.
- Events whose date is in the past do not appear.
- If zero upcoming events exist, a graceful empty state renders (e.g., "Check back soon for upcoming events.").
- The Content Manager can create, edit, and remove events in Sanity Studio without developer involvement.

#### FR-15: Event display

Each event in the calendar shall display its Title and Date/Time as primary content, and optionally Description and Location as secondary content, inline on the Let's Connect page. No separate event detail route is required in v1. [ASSUMPTION: A-8 — inline card or accordion expansion is sufficient; dedicated `/events/[slug]` route is a v2 consideration.]

**Consequences (testable):**

- All event fields render as visible, accessible text.
- Date/Time is formatted in human-readable form (e.g., "Sunday, July 6 at 7:00 PM").

---

### 4.5 Navigation and Site Shell

**Description:** The site shell includes a top navigation bar, a footer, and consistent branding across all four pages. Navigation mirrors the reference site: four items (Home, Gatherings, About Us, Let's Connect), a logo or wordmark, and a mobile-responsive menu. The visual identity is anchored by the ward name, tagline, and a consistent color palette drawn from Tailwind CSS configuration.

**Functional Requirements:**

#### FR-16: Global navigation

All pages shall include a top navigation bar with links to: Home (`/`), Gatherings (`/gatherings`), About Us (`/about`), Let's Connect (`/connect`). The active page link shall be visually distinguished (e.g., underline, color change, or weight).

**Consequences (testable):**

- All four nav links are present on every page and resolve to the correct routes.
- Active route link has a visually distinct state at all viewport sizes.
- Navigation collapses to a mobile-friendly menu (hamburger or equivalent) at Tailwind's `md` breakpoint (768px).

#### FR-17: Footer

All pages shall include a footer displaying at minimum the ward name ("Tooele YSA Ward") and the current copyright year. [ASSUMPTION: No additional footer links or content required in v1.]

**Consequences (testable):**

- Footer is present on all four pages.
- Ward name and copyright year are rendered as visible text.

---

## 5. Non-Functional Requirements

### 5.1 Performance

- **NFR-1:** Core Web Vitals targets — LCP ≤ 2.5 s, CLS < 0.1, measured on a mobile (4G) connection. Sanity image CDN with responsive `srcset` and Next.js `<Image>` component is the delivery mechanism for Hero Carousel images.
- **NFR-2:** Hero Carousel images are delivered as WebP via Sanity's image transformation pipeline.
- **NFR-3:** Static pages (Gatherings, About Us Missionaries section) use Next.js Static Site Generation (SSG). CMS-driven sections (Home hero, About Us leadership, Let's Connect events) use Incremental Static Regeneration (ISR) with a revalidation interval of 60 seconds.

### 5.2 Accessibility

- **NFR-4:** All images have descriptive `alt` text. Interactive elements (links, buttons) have accessible labels. Color contrast meets WCAG 2.1 AA minimum.
- **NFR-5:** All four pages are keyboard-navigable; focus order is logical.

### 5.3 Mobile-First

- **NFR-6:** All pages render correctly on viewports 375px and above. Layout is single-column on mobile and expands at Tailwind's `md` breakpoint (768px+).

### 5.4 CMS Usability

- **NFR-7:** Sanity document type field labels and descriptions use plain language, avoiding developer jargon, so the Content Manager can complete all routine content operations without reference documentation or developer assistance.

### 5.5 Security

- **NFR-8:** The site has no user authentication, no server-side form submissions, and no user-generated content in v1. Contact interactions are `tel:` and `mailto:` links only — no contact form, no server-side handler.
- **NFR-9:** Sanity Studio is protected by Sanity's standard authentication; the project API token is stored as a server-side environment variable and never exposed to the client bundle.

---

## 6. Success Metrics

| Metric                                                            | Target                                             |
| ----------------------------------------------------------------- | -------------------------------------------------- |
| Content Manager publishes a new hero image without developer help | Completed in < 5 min; verified by live walkthrough |
| Content Manager adds an event and it appears on the site          | Completed in < 5 min; verified by live walkthrough |
| Content Manager updates a leader's phone number                   | Completed in < 3 min; verified by live walkthrough |
| All four pages render correctly on a 375px viewport (iPhone SE)   | QA pass before launch                              |
| Google Maps link resolves to correct chapel location              | QA pass before launch                              |
| All four pages pass Lighthouse accessibility score ≥ 90           | Automated check before launch                      |

**Counter-metric:** If the Content Manager contacts the developer for routine content updates more than once per month, the Sanity Studio document type UX needs revision before the site is considered done.

---

## 7. Open Questions

| #    | Question                                    | Owner | Condition to Resolve                |
| ---- | ------------------------------------------- | ----- | ----------------------------------- |
| OQ-1 | Ward Instagram handle and URL               | Todd  | Before Let's Connect page goes live |
| OQ-2 | Ward Facebook page URL                      | Todd  | Before Let's Connect page goes live |
| OQ-3 | Tooele-area missionary contact phone number | Todd  | Before About Us page build          |

---

## 8. Assumptions Index

| ID   | Assumption                                                                                                                                         |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| A-2  | Building layout image is a static file supplied by Todd at build time, not CMS-managed                                                             |
| A-3  | Classroom assignments change infrequently (< quarterly); static Next.js content is acceptable for v1                                               |
| A-5  | Missionary section uses a phone number placeholder at build time; Todd to supply the Tooele-area missionary phone number before About Us goes live |
| A-6  | Ward social media handles are TBD; cards built now, pointed to `#` with "Coming Soon" state until confirmed                                        |
| A-8  | Events display inline on Let's Connect (no dedicated event detail route in v1)                                                                     |
| A-10 | Deployment target is Vercel                                                                                                                        |

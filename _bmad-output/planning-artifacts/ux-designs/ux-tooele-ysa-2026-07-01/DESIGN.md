---
name: Tooele YSA Ward
description: Visual identity for the Tooele Young Single Adult Ward public website — warm, grounded, and welcoming; modeled on thelocalchurchsydney.com with a Utah landscape palette and a sharp, typographically bold aesthetic.
status: draft
created: 2026-07-01
updated: 2026-07-01
sources:
  - _bmad-output/planning-artifacts/prds/prd-tooele-ysa-2026-07-01/prd.md
  - _bmad-output/planning-artifacts/prds/prd-tooele-ysa-2026-07-01/addendum.md

colors:
  # ── Surfaces ──────────────────────────────────────
  surface: '#FAFAF8' # warm off-white — body backgrounds, content sections
  surface-warm: '#F3EDE3' # light sand wash — subtle section variation
  on-surface: '#111111' # near-black body text on light backgrounds
  on-surface-muted: '#5a5550' # secondary / supporting text
  border: '#d6cfc6' # dividers, card outlines

  # ── Primary identity ──────────────────────────────
  primary: '#092f33' # deep dark teal — nav, hero bg, footer, dark sections
  on-primary: '#FFFFFF' # text/icons on primary

  # ── Accent palette (Utah landscape) ───────────────
  accent-rust: '#af5031' # terracotta rust — primary CTA buttons
  on-accent-rust: '#FFFFFF'
  accent-teal: '#7fc7cc' # ocean teal — links, highlights, hover treatments
  on-accent-teal: '#092f33'
  accent-olive: '#4b5b34' # sage olive — secondary accent, tags
  on-accent-olive: '#FFFFFF'
  accent-amber: '#ed8913' # golden amber — warm event/alert accent
  on-accent-amber: '#092f33'
  accent-sand: '#e4cba9' # warm sand — decorative tints, section divider color
  on-accent-sand: '#092f33'
  accent-blush: '#fdaba5' # blush rose — gentle feminine accent, badges
  on-accent-blush: '#092f33'
  accent-crimson: '#980204' # deep crimson — strong emphasis, error state
  on-accent-crimson: '#FFFFFF'

typography:
  display:
    fontFamily: Montserrat
    fontSize: 56px
    fontWeight: '900'
    lineHeight: '1.0'
    letterSpacing: 0.02em
    textTransform: uppercase
  display-mobile:
    fontFamily: Montserrat
    fontSize: 34px
    fontWeight: '900'
    lineHeight: '1.05'
    letterSpacing: 0.02em
    textTransform: uppercase
  headline:
    fontFamily: Montserrat
    fontSize: 30px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: 0.01em
    textTransform: uppercase
  headline-mobile:
    fontFamily: Montserrat
    fontSize: 22px
    fontWeight: '800'
    lineHeight: '1.15'
    letterSpacing: 0.01em
    textTransform: uppercase
  section-label:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.14em
    textTransform: uppercase
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.75'
  body:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.7'
  body-sm:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  cta:
    fontFamily: Montserrat
    fontSize: 13px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
    textTransform: uppercase

rounded:
  DEFAULT: '0px'
  sm: '0px'
  md: '0px'
  lg: '0px'
  full: '9999px' # reserved for pill badges only; not used on buttons or cards

spacing:
  section-v: '88px'
  section-v-mobile: '56px'
  container-max: '1100px'
  container-px: '20px'
  container-px-lg: '48px'
  stack-sm: '16px'
  stack-md: '24px'
  stack-lg: '40px'
  stack-xl: '64px'

components:
  nav:
    background: '{colors.primary}'
    text: '{colors.on-primary}'
    text-active: '{colors.accent-teal}'
    height: '72px'
    height-mobile: '64px'
    logo-height: '44px'
  hero:
    background-fallback: '{colors.primary}'
    overlay-color: '{colors.primary}'
    overlay-opacity: '0.45'
    text: '{colors.on-primary}'
    min-height: '100vh'
    min-height-mobile: '85vh'
    tagline-role: display
  button-primary:
    background: '{colors.accent-rust}'
    text: '{colors.on-accent-rust}'
    hover-background: '#8f3f23'
    padding: '14px 32px'
    font: '{typography.cta}'
  button-ghost-light:
    background: 'transparent'
    border: '2px solid {colors.on-primary}'
    text: '{colors.on-primary}'
    hover-background: 'rgba(255,255,255,0.08)'
    padding: '12px 30px'
    font: '{typography.cta}'
  button-ghost-dark:
    background: 'transparent'
    border: '2px solid {colors.primary}'
    text: '{colors.primary}'
    hover-background: 'rgba(9,47,51,0.06)'
    padding: '12px 30px'
    font: '{typography.cta}'
  leader-card:
    background: '{colors.surface}'
    border: '1px solid {colors.border}'
    name-font: '{typography.section-label}'
    name-color: '{colors.primary}'
    title-color: '{colors.on-surface-muted}'
    link-color: '{colors.accent-rust}'
    link-hover: '{colors.accent-teal}'
    padding: '24px'
  event-item:
    date-accent: '{colors.accent-rust}'
    date-font: '{typography.section-label}'
    title-color: '{colors.on-surface}'
    title-font: '{typography.body-lg}'
    meta-color: '{colors.on-surface-muted}'
    border-left: '3px solid {colors.accent-rust}'
  app-link-card:
    background: '{colors.primary}'
    text: '{colors.on-primary}'
    hover-background: '#0d4549'
    icon-color: '{colors.accent-teal}'
    padding: '20px 24px'
  footer:
    background: '{colors.primary}'
    tagline-color: '{colors.accent-teal}'
    text: 'rgba(255,255,255,0.65)'
    text-bright: '{colors.on-primary}'
    border-top: '1px solid rgba(255,255,255,0.12)'
---

# Tooele YSA Ward — Design Spine

## Brand & Style

The Tooele YSA Ward website is a sincere, low-key welcome mat for a faith community rooted in the high desert. The aesthetic borrows its structure from The Local Church Sydney — large, authoritative all-caps typography, clean single-column sections, a dark anchoring shell (nav + hero + footer) set against light open content areas — and adapts it with a Utah landscape palette: terracotta, sage, ocean teal, warm sand, and golden amber drawn from the geography and spirit of the region.

The tone is **warm without being folksy, confident without being corporate**. This is not a marketing site. It is a door left open. Visitors should feel oriented in ten seconds. Members should feel at home. The ward's tagline — _Together in Christ_ — is the quiet center of gravity; every visual decision should reinforce community, belonging, and clarity.

Design principles:

- **Typographic authority** — headlines are big, bold, and uppercase. They do the work so images don't have to.
- **Restraint in the palette** — the 8-color palette is rich; not every color appears on every page. `{colors.primary}`, `{colors.surface}`, and `{colors.accent-rust}` carry 90% of the interface. The remaining accents (teal, olive, amber, sand, blush, crimson) serve specific functional moments.
- **Square everything** — zero border radius on all interactive elements and cards. The reference site is architecturally sharp; we match it.
- **Section breathing room** — generous vertical section padding (`{spacing.section-v}`) prevents visual crowding without reducing information density.

## Colors

### Primary (`{colors.primary}` — `#092f33`)

Deep dark teal, nearly black with the faintest blue-green cast. This is the structural color: navigation bar, hero overlay, footer, any full-bleed dark section. On all dark surfaces, text and icons use `{colors.on-primary}` (`#FFFFFF`).

### Surface (`{colors.surface}` — `#FAFAF8`)

The default page background — warm off-white, not a cold paper white. Every content section that sits between dark panels lives here. `{colors.surface-warm}` (`#F6F2EB`) is a one-step deeper sand tint for subtle visual rhythm (e.g., alternating section backgrounds).

### Terracotta Rust (`{colors.accent-rust}` — `#af5031`)

The primary action color. Used **only** on interactive CTAs: primary buttons, active link underlines in light sections, event date accents. Its opacity variant is never used — it is always full-saturation or not present. Hover darkens to `#8f3f23`.

### Ocean Teal (`{colors.accent-teal}` — `#7fc7cc`)

The breath of the palette. Active nav link state, footer tagline rendering, icon highlights on app link cards, hover transitions on ghost buttons within dark sections. It complements `{colors.primary}` because they share hue lineage; it adds life without fighting for attention.

### Sage Olive (`{colors.accent-olive}` — `#4b5b34`)

Grounded, secondary. Used for category tags, contextual labels (e.g., building classroom assignment headers), or small decorative ink elements. Not a background color in content sections.

### Golden Amber (`{colors.accent-amber}` — `#ed8913`)

Warmth and urgency. Reserved for event-type callouts where a second accent is needed alongside rust, or for a seasonal section wash. Use sparingly — one instance per page maximum outside Let's Connect.

### Warm Sand (`{colors.accent-sand}` — `#e4cba9`)

A tonal complement to surface. Used as an illustrative band or a horizontal rule color on light sections. Not a text color. Not a button color.

### Blush Rose (`{colors.accent-blush}` — `#fdaba5`)

Gentle, soft. The most restrained color in the palette. If a badge or indicator needs a friendly, low-urgency signal, this is it. Not a structural color.

### Deep Crimson (`{colors.accent-crimson}` — `#980204`)

Strong emphasis. Semantically associated with alerts or important announcements. Not used for decorative purposes. If the hero carousel has zero images, the fallback background is `{colors.primary}`, not this color.

### Text scale

- `{colors.on-surface}` (`#111111`) — primary body text on light backgrounds.
- `{colors.on-surface-muted}` (`#5a5550`) — secondary text, captions, leader card titles.
- `{colors.border}` (`#d6cfc6`) — dividers and card borders; a desaturated warm gray.

## Typography

A single typeface family — **Montserrat** — spans all roles. This matches the reference site's commitment to one strong sans-serif voice, avoids font-loading complexity, and ensures cohesion across a small content team (the Content Manager designs hero images in Canva, where Montserrat is available by default).

| Role                     | Token                          | Treatment                                 |
| ------------------------ | ------------------------------ | ----------------------------------------- |
| Hero headline            | `{typography.display}`         | 56px / 900 / uppercase / tracking +0.02em |
| Hero headline (mobile)   | `{typography.display-mobile}`  | 34px / 900 / uppercase                    |
| Section heading          | `{typography.headline}`        | 30px / 800 / uppercase / tracking +0.01em |
| Section heading (mobile) | `{typography.headline-mobile}` | 22px / 800 / uppercase                    |
| Section eyebrow / label  | `{typography.section-label}`   | 12px / 700 / uppercase / tracking +0.14em |
| Body text                | `{typography.body}`            | 16px / 400 / 1.7 line-height              |
| Body text large          | `{typography.body-lg}`         | 18px / 400 / 1.75 line-height             |
| Body text small          | `{typography.body-sm}`         | 14px / 400 / 1.6 line-height              |
| Button / CTA             | `{typography.cta}`             | 13px / 700 / uppercase / tracking +0.1em  |

**Rules:**

- Every section opens with a `section-label` eyebrow (e.g., "GATHERINGS", "OUR LEADERS") followed by a `headline` or `display` heading. This two-tier pattern is the primary visual rhythm device inherited from the reference site.
- Body text is **never** uppercase.
- `textTransform: uppercase` is applied via CSS, not by typing capitals in content — so the CMS can feed normally-cased text and headings render correctly.

## Layout & Spacing

The site is single-column on all breakpoints. No sidebar. No grid-based content layout at the page level — all sections are full-width bands.

**Breakpoints (Tailwind defaults):**

- Mobile: `< 640px`
- Tablet: `640px – 1023px`
- Desktop: `≥ 1024px`

**Container:** `{spacing.container-max}` (1100px) max-width, centered, with `{spacing.container-px}` (20px) horizontal padding on mobile and `{spacing.container-px-lg}` (48px) on desktop. The container holds all content; section backgrounds bleed full-width.

**Section vertical rhythm:** `{spacing.section-v}` (88px) top and bottom padding on desktop; `{spacing.section-v-mobile}` (56px) on mobile. Applied consistently to every named section band.

**Dark/light alternation:** The structural pattern is: dark nav → dark hero → light content → [optional light-warm tint] → dark footer. Interior pages may introduce additional light-warm (`{colors.surface-warm}`) bands for visual rhythm without introducing new dark bands mid-page.

## Elevation & Depth

Flat design. No drop shadows on interactive elements or content sections. The visual separation between sections is achieved by color changes (dark/light alternation) and spacing, not elevation.

The single exception: **leader cards** on the About Us page use a `1px solid {colors.border}` border. This is a structural separator, not an elevation signal.

No box-shadow utility classes used in the Tailwind build.

## Shapes

Zero border radius everywhere — buttons, cards, inputs, nav, hero, footer. This matches the reference site exactly and reinforces the architectural authority of the typography.

The one reserved exception is `{rounded.full}` (`9999px`) for pill-shaped badges only (e.g., a "NEW" tag on an event if ever needed). No other element receives rounded treatment.

## Components

### Navigation

The site nav (`{components.nav}`) is `{components.nav.background}` (`{colors.primary}`) with `{components.nav.height}` (72px) on desktop. Left: logo (`{components.nav.logo-height}`, 44px tall). Right: four navigation links in `{typography.section-label}` style — Home, Gatherings, About Us, Let's Connect. Active link renders in `{components.nav.text-active}` (`{colors.accent-teal}`). On mobile (`< 768px`): hamburger icon; links drop into a full-width drawer below the bar, same dark background.

### Hero Carousel

`{components.hero}` spans 100vh on desktop, 85vh on mobile. Images fetched from Sanity are rendered full-bleed with a `{components.hero.overlay-color}` / `{components.hero.overlay-opacity}` overlay darkening treatment to ensure text contrast. When 0 images are published, the section renders as a solid `{components.hero.background-fallback}` band — no broken image, no placeholder. Overlaid: the ward name in `{typography.section-label}` (eyebrow), the tagline "TOGETHER IN CHRIST" in `{typography.display}`, and two buttons side by side: a `button-primary` (Get Directions) and a `button-ghost-light` (Meet With Missionaries).

### Section Labels + Headings

Every content section follows this pattern:

1. A `{typography.section-label}` eyebrow in `{colors.on-surface-muted}` (on light) or `{colors.accent-teal}` (on dark) — e.g., "TOOELE YSA WARD" or "GATHERINGS"
2. A `{typography.headline}` heading below — e.g., "GATHER WITH US ON SUNDAYS"
3. Body text at `{typography.body-lg}` for the introductory paragraph

### Primary Button (`button-primary`)

`{colors.accent-rust}` background, `{colors.on-accent-rust}` text, 14px 32px padding, `{typography.cta}` font. Hover: `#8f3f23`. Zero radius. Used for all primary page actions (Get Directions, Learn More on Home, etc.).

### Ghost Buttons

Two variants: `button-ghost-light` for use on dark (`{colors.primary}`) backgrounds; `button-ghost-dark` for use on light (`{colors.surface}`) backgrounds. Never mix the wrong variant for the background.

### Leader Card (`leader-card`)

A flat rectangular card: `{colors.surface}` background, `{colors.border}` 1px border. Name: `{typography.section-label}`, `{colors.primary}`. Title: `{typography.body-sm}`, `{colors.on-surface-muted}`. Phone/email links: `{typography.body-sm}`, `{colors.accent-rust}` — tap/click target includes the full line. If phone or email is absent (optional fields), the line is omitted; the card reflows without a gap or placeholder.

### Event Item (`event-item`)

Left-bordered list item: `{components.event-item.border-left}` (3px solid `{colors.accent-rust}`). Date in `{typography.section-label}` style, `{colors.accent-rust}`. Title in `{typography.body-lg}`. Optional description in `{typography.body}`, `{colors.on-surface-muted}`. No card frame — list items are visually light.

### App Link Card (`app-link-card`)

Dark card (`{colors.primary}` background). App icon in `{colors.accent-teal}`. App name in `{typography.section-label}` style, `{colors.on-primary}`. Hover: `{components.app-link-card.hover-background}`. External link — opens in new tab. No rounded corners.

### Footer

Full-bleed `{components.footer.background}`. Top: ward tagline — "Together in Christ" — in `{typography.headline-mobile}`, `{components.footer.tagline-color}`. Below: four nav links in `{typography.section-label}`, `{components.footer.text}`. Bottom: copyright line. Horizontal top border `{components.footer.border-top}`.

## Do's and Don'ts

**Do:** Use `{colors.primary}` only for structural shell elements — nav, hero, footer, full-bleed dark bands. Not for buttons, not for inline text links.

**Do:** Reserve `{colors.accent-rust}` for primary interactive actions only. One button per section maximum is rust-colored.

**Do:** Load Montserrat in weights 400 and 700/800/900 only. Intermediate weights (500, 600) are not used — load discipline matters for performance.

**Do:** Keep section eyebrows (section-label) short — 2–4 words maximum. They are orientation tags, not headlines.

**Don't:** Use `{colors.accent-crimson}` or `{colors.accent-blush}` for decorative purposes. Each has a reserved semantic function.

**Don't:** Mix button variants. Never put a `button-ghost-dark` inside a `{colors.primary}` dark section — use `button-ghost-light`.

**Don't:** Add rounded corners to any element that is not explicitly a pill badge.

**Don't:** Stack two uppercase headings without a body paragraph or section-label eyebrow between them. Every section needs the eyebrow → heading → body rhythm.

**Don't:** Use more than three colors from the accent palette on a single page. The accent palette is a library; any given page draws from a subset.

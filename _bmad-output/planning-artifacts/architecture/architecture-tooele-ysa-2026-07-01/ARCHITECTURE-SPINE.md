---
name: Tooele YSA Ward Website
type: architecture-spine
purpose: build-substrate
altitude: feature
paradigm: Headless CMS Jamstack — strict content-boundary layering
scope: Full 4-page public site (/, /gatherings, /about, /connect) plus embedded Sanity Studio
status: draft
created: 2026-07-01
updated: 2026-07-01
binds:
  - FR-1
  - FR-2
  - FR-3
  - FR-4
  - FR-5
  - FR-6
  - FR-7
  - FR-8
  - FR-9
  - FR-10
  - FR-11
  - FR-12
  - FR-13
  - FR-14
  - FR-15
  - FR-16
  - FR-17
  - NFR-1
  - NFR-2
  - NFR-3
  - NFR-6
  - NFR-8
  - NFR-9
sources:
  - _bmad-output/planning-artifacts/prds/prd-tooele-ysa-2026-07-01/prd.md
  - _bmad-output/planning-artifacts/prds/prd-tooele-ysa-2026-07-01/addendum.md
  - _bmad-output/planning-artifacts/ux-designs/ux-tooele-ysa-2026-07-01/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-tooele-ysa-2026-07-01/EXPERIENCE.md
companions: []
---

# Architecture Spine — Tooele YSA Ward Website

## Design Paradigm

**Headless CMS Jamstack** with strict content-boundary layering. Three layers; dependency flows in one direction only.

```mermaid
graph LR
  P["Presentation\nNext.js App Router + RSC\nISR / SSG"]
  C["Content\nSanity CMS — GROQ API"]
  I["Images\nSanity Image CDN"]
  D["Delivery\nVercel Edge Network"]

  P -->|"GROQ queries\n(server-only, ISR/build)"| C
  P -->|"@sanity/image-url params"| I
  D -->|"serves pre-rendered HTML"| P
```

Layers map to directories:

| Layer                      | Directory                 |
| -------------------------- | ------------------------- |
| Presentation — pages       | `app/(site)/`             |
| Presentation — components  | `components/`             |
| Presentation — data access | `lib/sanity/`             |
| Content — schemas          | `sanity/schema-types/`    |
| Content — studio config    | `sanity/sanity.config.ts` |
| Static assets              | `public/`                 |

## Invariants & Rules

### AD-1 — Headless CMS Jamstack layer boundary

- **Binds:** all
- **Prevents:** Sanity schema changes coupling to Next.js routing; Next.js writing to Sanity outside Studio; CMS data fetched client-side
- **Rule:** Presentation depends on Content API (GROQ); Content has zero knowledge of Presentation. No component issues mutations to Sanity; all writes go through Sanity Studio exclusively.

### AD-2 — Per-route rendering strategy

- **Binds:** FR-1, FR-3, FR-5 through FR-17, NFR-3
- **Prevents:** a CMS-dependent page being frozen static forever; Gatherings pulling a runtime CMS call it doesn't need
- **Rule:** `/gatherings` is SSG — no `revalidate` export, no GROQ call. `/`, `/about`, `/connect` are ISR — each page module exports `export const revalidate = 60`. No page uses dynamic `(force-dynamic)` rendering. `/studio` is excluded from the static/ISR contract.

```mermaid
graph LR
  subgraph ISR["ISR — export const revalidate = 60"]
    H["/"]
    A["/about"]
    C["/connect"]
  end
  subgraph SSG["SSG — no revalidate"]
    G["/gatherings"]
  end
  H & A & C -->|"GROQ server-fetch"| SA["Sanity Content API"]
  G -.->|"no Sanity call"| static["Static HTML at build"]
```

### AD-3 — Server-only CMS data fetching

- **Binds:** FR-1, FR-9, FR-14, NFR-9
- **Prevents:** `SANITY_API_READ_TOKEN` leaking to the client bundle; client-side CMS polling adding latency
- **Rule:** All GROQ queries execute in React Server Components or at build time only. `SANITY_API_READ_TOKEN` is a server-side env var — never prefixed `NEXT_PUBLIC_`. Only `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are client-safe.

### AD-4 — next-sanity is the sole Sanity integration layer

- **Binds:** FR-1, FR-9, FR-14
- **Prevents:** two implementation paths hitting the Sanity API with divergent caching, error handling, or token usage
- **Rule:** All GROQ queries and client configuration go through `next-sanity`. No raw `fetch()` to `https://PROJECT.api.sanity.io`. All queries are named exports from `lib/sanity/queries.ts`; no inline query strings in page files.

### AD-5 — Sanity CDN owns all image transformation

- **Binds:** FR-1 (hero carousel), FR-9 (leader card images), NFR-1, NFR-2
- **Prevents:** Vercel Image Optimization chained after Sanity CDN (double-processing cost and format conflict); inconsistent WebP/srcset output across components
- **Rule:** Sanity-sourced images are delivered via `@sanity/image-url` builder pointed at the Sanity CDN, with explicit `width`, `format('webp')`, and `quality` params. `next/image` is configured with a [Sanity image loader](https://www.sanity.io/docs/image-url) so Vercel's optimizer is bypassed for Sanity URLs. Static assets in `public/` (floor plan, app icons) use `next/image` with the default Vercel optimizer.

### AD-6 — No auth surface in Next.js

- **Binds:** all routes, NFR-8
- **Prevents:** auth middleware accidentally blocking public pages; a second session system layered on Sanity Studio
- **Rule:** All Next.js routes are public. `/studio` uses Sanity's built-in auth exclusively — no `middleware.ts` auth check, no JWT/session handling in the Next.js layer.

### AD-7 — Vercel auto-deploy; secrets in dashboard only

- **Binds:** all, A-10, NFR-8, NFR-9
- **Prevents:** secrets committed to the repo; manual deploy steps; divergent deployment targets
- **Rule:** `main` branch auto-deploys to Vercel production. PR branches deploy to Vercel preview. The four required env vars (`SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_STUDIO_URL`) are set in the Vercel project dashboard only — never in `.env.local` committed to the repo.

### AD-8 — Tailwind CSS only; tokens from DESIGN.md

- **Binds:** all UI components, NFR-6
- **Prevents:** a second design system (shadcn, MUI, Radix) introducing tokens that conflict with DESIGN.md; inconsistent color or typography across components
- **Rule:** All styling is Tailwind utility classes. No component library is installed. Every color, typography, and spacing token from `DESIGN.md` is implemented as a Tailwind config extension in `tailwind.config.ts` (or `tailwind.css` under Tailwind v4 CSS-first config). DESIGN.md wins on any visual conflict.

## Consistency Conventions

| Concern          | Convention                                                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| File naming      | Components: `kebab-case.tsx`. Directories: `kebab-case/`. Route segments follow Next.js App Router conventions.                    |
| Component naming | PascalCase exports. One component per file.                                                                                        |
| GROQ queries     | Named exports from `lib/sanity/queries.ts` only. Prefixed by domain: `heroImagesQuery`, `leaderCardsQuery`, `upcomingEventsQuery`. |
| TypeScript types | Sanity document types defined in `lib/types.ts`; derived from schema by hand or `sanity-typegen`. No `any`; strict mode on.        |
| Env vars         | Server-only: no `NEXT_PUBLIC_` prefix. Client-safe: `NEXT_PUBLIC_` prefix. No secrets in source.                                   |
| External links   | `target="_blank" rel="noopener noreferrer"` on every external link — no exceptions (enforced in components, not inline JSX).       |
| ISR declaration  | `export const revalidate = 60` at the top of each ISR page module. Never use `force-dynamic`.                                      |
| Image alt text   | All images have non-empty `alt`; decorative images use `alt=""` and `role="presentation"`.                                         |
| Tap targets      | Minimum 44×44 CSS px for all interactive elements (WCAG 2.1 AA, NFR-4).                                                            |
| Empty states     | CMS-driven sections always render a graceful empty state (specified in EXPERIENCE.md) when Sanity returns an empty array.          |

## Stack

[ASSUMPTION] Verify pinned versions before scaffolding — these are current as of architecture authoring.

| Name                     | Version                      |
| ------------------------ | ---------------------------- |
| Next.js                  | 15.x                         |
| TypeScript               | 5.x                          |
| Tailwind CSS             | 4.x                          |
| Sanity Studio (embedded) | 3.x                          |
| next-sanity              | 9.x [ASSUMPTION — verify]    |
| @sanity/image-url        | 1.x [ASSUMPTION — verify]    |
| Node.js (Vercel runtime) | 22 LTS [ASSUMPTION — verify] |
| Vercel                   | platform (no version)        |

**Developer tooling (not runtime):** Sanity MCP — configured to allow Copilot/Claude to interact with Sanity schemas and Content API during development. No effect on production.

## Structural Seed

```text
tooele-ysa/
  app/
    (site)/                       # Public route group — shares SiteNav + Footer shell
      layout.tsx                  # Site nav + footer; font + color vars
      page.tsx                    # Home /  (ISR revalidate=60)
      gatherings/
        page.tsx                  # Gatherings /gatherings  (SSG)
      about/
        page.tsx                  # About Us /about  (ISR revalidate=60)
      connect/
        page.tsx                  # Let's Connect /connect  (ISR revalidate=60)
    studio/
      [[...tool]]/
        page.tsx                  # Embedded Sanity Studio — Sanity auth only
    layout.tsx                    # Root layout: <html>, globals.css, font loading
    globals.css
  components/
    site-nav.tsx                  # Sticky top nav + mobile hamburger drawer
    footer.tsx                    # Dark footer band
    hero-carousel.tsx             # Auto-advancing carousel; 0/1/2+ image states
    leader-card.tsx               # CMS-driven; optional phone/email; graceful empty
    event-item.tsx                # CMS-driven; date + title required; optional desc/loc
    app-link-card.tsx             # Static LDS app + social link cards
    missionaries-block.tsx        # Fully static; tel: + Church link
    sanity-image.tsx              # next/image + Sanity CDN loader wrapper
  lib/
    sanity/
      client.ts                   # next-sanity createClient (project ID, dataset, token)
      queries.ts                  # All GROQ named exports
      image.ts                    # @sanity/image-url builder instance
    types.ts                      # TypeScript types for Sanity document shapes
  sanity/
    schema-types/
      hero-image.ts               # { _type, image, order }
      leader-card.ts              # { _type, name, title, phone?, email? }
      ward-event.ts               # { _type, title, dateTime, description?, location? }
      index.ts                    # schemaTypes array export
    sanity.config.ts              # Sanity Studio config (project ID, dataset, plugins)
  public/
    images/
      floor-plan.*                # Static building layout (supplied by Todd at build)
      app-icons/                  # LDS app icon PNGs/SVGs
  tailwind.config.ts              # Token extensions from DESIGN.md
  next.config.ts                  # Sanity image remote pattern; no other dynamic config
  .env.local                      # Local dev only — NOT committed
  .env.example                    # Template listing required env var names (committed)
```

**System view:**

```mermaid
graph TB
  Visitor(["Visitor / Member"])
  CM(["Content Manager"])
  Todd(["Developer — Todd"])

  subgraph "Vercel Edge"
    App["Next.js 15 App\n4 pages + /studio"]
  end

  subgraph "Sanity Cloud"
    Studio["Sanity Studio\n/studio — Sanity auth"]
    API["Content API\nGROQ"]
    CDN["Image CDN\n@sanity/image-url"]
    Schema["Schemas\nheroImage · leaderCard · wardEvent"]
  end

  Visitor -->|HTTPS| App
  CM -->|manage content| Studio
  Todd -->|"git push → auto-deploy"| App
  Studio -->|writes| API
  API --- Schema
  App -->|"GROQ queries (ISR/SSG)"| API
  App -->|"image URL params"| CDN
```

## Capability → Architecture Map

| Capability / FR                  | Lives in                                                    | Governed by                                            |
| -------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| FR-1 Hero Carousel               | `app/(site)/page.tsx` + `components/hero-carousel.tsx`      | AD-2 (ISR), AD-3 (RSC), AD-4 (next-sanity), AD-5 (CDN) |
| FR-2 Tagline                     | `app/(site)/page.tsx` (static JSX)                          | AD-2 (SSG-within-ISR)                                  |
| FR-3 Static content blocks       | `app/(site)/page.tsx`                                       | AD-2                                                   |
| FR-4 Google Maps CTA             | `app/(site)/page.tsx`                                       | Convention: external link rule                         |
| FR-5–8 Gatherings content        | `app/(site)/gatherings/page.tsx`                            | AD-2 (SSG)                                             |
| FR-9–10 Leadership Directory     | `app/(site)/about/page.tsx` + `components/leader-card.tsx`  | AD-2 (ISR), AD-3 (RSC), AD-4, AD-5                     |
| FR-11 Missionaries block         | `components/missionaries-block.tsx`                         | AD-6 (no auth); fully static                           |
| FR-12 LDS App links              | `components/app-link-card.tsx`                              | Convention: external link rule                         |
| FR-13 Social links (Coming Soon) | `components/app-link-card.tsx`                              | AD-8 (Tailwind state); OQ-1, OQ-2                      |
| FR-14–15 Events Calendar         | `app/(site)/connect/page.tsx` + `components/event-item.tsx` | AD-2 (ISR), AD-3 (RSC), AD-4                           |
| FR-16 Global navigation          | `components/site-nav.tsx`                                   | AD-8 (Tailwind); Convention: active link               |
| FR-17 Footer                     | `components/footer.tsx`                                     | AD-8 (Tailwind)                                        |
| Sanity content schemas           | `sanity/schema-types/`                                      | AD-1 (boundary)                                        |
| Sanity Studio                    | `app/studio/[[...tool]]/page.tsx`                           | AD-6 (Sanity auth only)                                |
| Image delivery                   | `components/sanity-image.tsx` + `lib/sanity/image.ts`       | AD-5 (CDN)                                             |
| GROQ data access                 | `lib/sanity/client.ts` + `lib/sanity/queries.ts`            | AD-3 (server-only), AD-4 (next-sanity)                 |
| Environment / secrets            | Vercel dashboard + `.env.example`                           | AD-3 (token boundary), AD-7 (no secrets in repo)       |

## Deferred

| What                                    | Why it can wait                                                                                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| On-demand ISR via Sanity webhooks       | Upgrades 60s polling to near-instant revalidation. Adds a webhook handler route and Vercel secret. Deferred until 60s lag is a real user complaint. |
| Social media handles (OQ-1, OQ-2)       | Cards are built with "Coming Soon" state; activate when handles are confirmed.                                                                      |
| Missionary phone number (OQ-3)          | Placeholder at build; Todd to supply before About Us ships.                                                                                         |
| `/events/[slug]` event detail routes    | PRD A-8 — inline display is sufficient for v1. Deferred to v2.                                                                                      |
| CMS-managed classroom assignments       | PRD FR-7 — static for v1; escalate if assignments change more than quarterly.                                                                       |
| Hero image scheduled publish            | PRD out of scope — images go live on Publish in Sanity.                                                                                             |
| Sanity live preview / Presentation Tool | No editor preview requirement in v1; add when Content Manager requests it.                                                                          |
| Pagination / infinite scroll for events | EXPERIENCE.md — Content Manager keeps list trim; 20-event cap in GROQ query.                                                                        |
| Media archive / sermon recordings       | PRD non-user — out of scope for this site entirely.                                                                                                 |

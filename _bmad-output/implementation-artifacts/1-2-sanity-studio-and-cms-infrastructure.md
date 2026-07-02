---
baseline_commit: a1a4e8d2175169875046c31558e044578a576f5f
---

# Story 1.2: Sanity Studio & CMS Infrastructure

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Content Manager,
I want Sanity Studio embedded in the site and all content schemas created,
so that I can manage hero images, content sections, leadership, and events through the CMS.

## Acceptance Criteria

1. **Given** the scaffolded project from Story 1.1 **When** Sanity integration is complete **Then** Sanity Studio is accessible at `/studio` with Sanity-native authentication
2. **And** `lib/sanity/client.ts` exports a singleton client with fixed apiVersion, `useCdn: true`, `perspective: 'published'`
3. **And** `lib/sanity/queries.ts` exists with named GROQ query exports
4. **And** `lib/sanity/image.ts` exports the `@sanity/image-url` builder instance
5. **And** `components/sanity-image.tsx` wrapper component created with WebP format and quality(80)
6. **And** Three Sanity schema types created: `heroImage` (image with hotspot, title), `homeSectionTop` (background image with hotspot, eyebrow string, heading string, body text), `homeSectionBottom` (same shape as homeSectionTop)
7. **And** Schema field labels use plain language (e.g., "Background Image", "Section Heading")
8. **And** `sanity-typegen` generates types to `lib/types.ts`
9. **And** GROQ queries defined: `heroImageQuery`, `homeSectionTopQuery`, `homeSectionBottomQuery`
10. **And** `leaderCard` schema created (name, title, phone optional, email optional, displayOrder)
11. **And** `wardEvent` schema created (title, dateTime as Sanity `datetime`, description optional, location optional)
12. **And** GROQ queries defined: `leaderCardsQuery`, `upcomingEventsQuery`

## Tasks / Subtasks

- [x] Task 1: Install Sanity dependencies (AC: #1)
  - [x] Install `next-sanity` v13.x (NOT v9.x — see version notes)
  - [x] Install `@sanity/image-url` v2.x (NOT v1.x)
  - [x] Install `sanity` (Studio core)
  - [x] Install `@sanity/vision` (GROQ query tool for Studio)
  - [x] Read next-sanity v13 migration docs before configuring — API surface may differ from v9
- [x] Task 2: Configure Sanity Studio (AC: #1)
  - [x] Create `sanity.config.ts` at project root (or `sanity/sanity.config.ts` per structural seed) with projectId, dataset from env vars
  - [x] Create `app/studio/[[...tool]]/page.tsx` for embedded Studio route
  - [x] Studio uses Sanity's built-in auth — NO middleware.ts auth check (AD-6)
  - [x] Verify Studio loads at `http://localhost:3000/studio`
- [x] Task 3: Create Sanity client singleton (AC: #2)
  - [x] Create `lib/sanity/client.ts` exporting ONE client instance
  - [x] Config: `apiVersion` set to scaffold date (e.g., `'2026-07-01'`), `useCdn: true`, `perspective: 'published'`
  - [x] `dataset` and `projectId` from env vars
  - [x] No other file may call `createClient()` — all imports come from this singleton (AD-9)
- [x] Task 4: Create image utilities (AC: #4, #5)
  - [x] Create `lib/sanity/image.ts` — export `@sanity/image-url` v2 builder instance
  - [x] Confirm `createImageUrlBuilder` import path and constructor against v2 API
  - [x] Create `components/sanity-image.tsx` — wrapper component using the builder
  - [x] Wrapper must apply `.format('webp')` and `.quality(80)` by default
  - [x] Use `next/image` with Sanity CDN loader — Vercel optimizer bypassed for Sanity images (AD-5)
  - [x] Support `hotspot` and `crop` metadata from Sanity
  - [x] Static assets in `public/` use standard `next/image` (not this wrapper)
- [x] Task 5: Create all Sanity schemas (AC: #6, #7, #10, #11)
  - [x] `sanity/schema-types/hero-image.ts` — `heroImage` type: image (hotspot: true), title (string)
  - [x] `sanity/schema-types/home-section-top.ts` — `homeSectionTop` type: background image (hotspot: true), eyebrow (string), heading (string), body (text)
  - [x] `sanity/schema-types/home-section-bottom.ts` — `homeSectionBottom` type: same shape as homeSectionTop
  - [x] `sanity/schema-types/leader-card.ts` — `leaderCard` type: name (string, required), title (string, required), phone (string, optional), email (string, optional), displayOrder (number)
  - [x] `sanity/schema-types/ward-event.ts` — `wardEvent` type: title (string, required), dateTime (datetime, required), description (text, optional), location (string, optional)
  - [x] `sanity/schema-types/index.ts` — export `schemaTypes` array with all types
  - [x] ALL field labels must use plain language (NFR-7): "Background Image", "Section Heading", "Body Text", "Display Order", etc.
- [x] Task 6: Create GROQ queries (AC: #3, #9, #12)
  - [x] Create `lib/sanity/queries.ts` with ALL named exports:
    - `heroImageQuery` — fetch the heroImage document (single image, not carousel)
    - `homeSectionTopQuery` — fetch homeSectionTop singleton
    - `homeSectionBottomQuery` — fetch homeSectionBottom singleton
    - `leaderCardsQuery` — fetch all leaderCard documents ordered by displayOrder
    - `upcomingEventsQuery` — fetch max 20 wardEvent documents where `dateTime >= now()`, sorted ascending by dateTime
  - [x] NO inline GROQ strings in page files — all queries live here (AD-4)
- [x] Task 7: Generate TypeScript types (AC: #8)
  - [x] Configure `sanity-typegen` to output to `lib/types.ts`
  - [x] Run type generation and verify output
  - [x] No `any` types — strict mode (AD-11)
- [x] Task 8: Verify integration
  - [x] `pnpm dev` runs without errors
  - [x] Studio loads at `/studio`
  - [x] Schemas visible in Studio with plain-language labels

### Review Findings

- [x] [Review][Patch] Required Sanity env vars silently fell back to fake values [lib/sanity/client.ts:4] — fixed by centralizing Sanity env validation and failing fast when `NEXT_PUBLIC_SANITY_PROJECT_ID` or `NEXT_PUBLIC_SANITY_DATASET` is missing.

## Dev Notes

### Critical Version Information

**next-sanity is v13.x, NOT v9.x.** Four major versions have shipped since the architecture was written. Read the v13 API reference before writing client code.

**@sanity/image-url is v2.x, NOT v1.x.** The builder pattern persists but constructor/import path may differ. Check the v2 migration guide.

[Source: architecture/reviews/review-version-verifier.md — F-2, F-3]

### Sanity Client Singleton Pattern (AD-9)

```typescript
// lib/sanity/client.ts — the ONLY place createClient is called
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-07-01',
  useCdn: true,
  perspective: 'published',
})
```

Verify this call shape against next-sanity v13 docs. The `createClient` import and config object may have changed.

### Schema Field Type Contracts (AD-10)

These field type choices are architectural contracts — do not deviate:

| Schema | Field | Sanity Type | Notes |
|--------|-------|-------------|-------|
| `wardEvent` | `dateTime` | `datetime` | Full ISO timestamp, NOT `date` (YYYY-MM-DD) |
| `heroImage` | `image` | `image` | Must have `options: { hotspot: true }` |
| `leaderCard` | `phone` | `string` | Optional — `validation: Rule => Rule.optional()` |
| `leaderCard` | `email` | `string` | Optional — `validation: Rule => Rule.optional()` |
| `homeSectionTop/Bottom` | `image` | `image` | Must have `options: { hotspot: true }` |

[Source: ARCHITECTURE-SPINE.md — AD-10]

### sanity-image.tsx Mandatory Wrapper (AD-5)

Every Sanity-sourced image MUST render through `components/sanity-image.tsx`. This wrapper:
- Uses `@sanity/image-url` v2 builder with explicit `width`, `.format('webp')`, `.quality(80)`
- Configures `next/image` with a Sanity CDN loader so Vercel optimizer is bypassed
- Supports hotspot/crop metadata
- Static assets in `public/` (floor plan, app icons) use standard `next/image` — NOT this wrapper

### No Auth in Next.js (AD-6)

All Next.js routes are public. `/studio` uses Sanity's built-in auth exclusively. Do NOT create `middleware.ts` for auth. Do NOT add JWT/session handling.

### Project Structure

```
lib/
  sanity/
    client.ts         # Singleton client (AD-9)
    queries.ts         # All GROQ named exports (AD-4)
    image.ts           # @sanity/image-url builder
  types.ts             # sanity-typegen output (AD-11)
sanity/
  schema-types/
    hero-image.ts
    home-section-top.ts
    home-section-bottom.ts
    leader-card.ts
    ward-event.ts
    index.ts           # schemaTypes array
  sanity.config.ts     # Studio config
components/
  sanity-image.tsx     # Mandatory image wrapper (AD-5)
app/
  studio/
    [[...tool]]/
      page.tsx         # Embedded Studio
```

[Source: ARCHITECTURE-SPINE.md — Structural Seed, AD-1 through AD-12]

### Anti-Pattern Prevention

- **DO NOT** use raw `fetch()` to Sanity API — use `next-sanity` exclusively (AD-4)
- **DO NOT** put inline GROQ strings in page files — all queries in `lib/sanity/queries.ts` (AD-4)
- **DO NOT** render Sanity images with raw `<img>` or un-wrapped `next/image` — use `sanity-image.tsx` (AD-5)
- **DO NOT** call `createClient()` in any file except `lib/sanity/client.ts` (AD-9)
- **DO NOT** add `NEXT_PUBLIC_` prefix to `SANITY_API_READ_TOKEN` (AD-3)
- **DO NOT** use `any` types — strict mode, use `sanity-typegen` (AD-11)
- **DO NOT** use Sanity `date` type for `wardEvent.dateTime` — must be `datetime` (AD-10)

### References

- [Source: ARCHITECTURE-SPINE.md — AD-1, AD-3, AD-4, AD-5, AD-6, AD-9, AD-10, AD-11]
- [Source: architecture/reviews/review-version-verifier.md — F-2 (next-sanity v13), F-3 (@sanity/image-url v2)]
- [Source: PRD addendum — Sanity Document Type Sketches]
- [Source: epics.md — Story 1.2 acceptance criteria]

## Dev Agent Record

### Agent Model Used

github-copilot/gpt-5.5

### Debug Log References

- `pnpm test` first failed after adding guardrail tests, confirming missing Sanity infrastructure before implementation.
- `pnpm add next-sanity@^13 @sanity/image-url@^2 sanity @sanity/vision` installed the story-specified dependencies.
- `pnpm typegen` initially failed because schema files imported `@sanity/icons`; removed unapproved icon dependency and regenerated successfully.
- `pnpm build` initially failed when the server Studio route imported Studio config directly; moved Studio rendering into a client component.
- `pnpm build` next failed on an internal `@sanity/image-url` type import; switched to the public `SanityImageSource` export.
- `pnpm build` next failed because TypeGen client overloads augmented missing `@sanity/client`; disabled overloads to avoid adding dependencies beyond the story.
- Final validation passed: `pnpm typegen`, `pnpm test`, `pnpm lint`, `pnpm build`, and a local `pnpm dev` smoke check returning HTTP 200 for `/studio`.

### Implementation Plan

- Keep the story-required embedded Studio while isolating Studio rendering in a client component for Next App Router compatibility.
- Centralize Sanity runtime access through `lib/sanity/client.ts`, `lib/sanity/queries.ts`, and `lib/sanity/image.ts`.
- Use Sanity v6 schema helpers and `defineQuery` so type generation can produce `lib/types.ts`.
- Add node:test guardrails to verify the CMS infrastructure contract and prevent accidental drift.

### Completion Notes List

- Installed `next-sanity` v13, `@sanity/image-url` v2, `sanity`, and `@sanity/vision`.
- Added embedded Studio configuration and `/studio` route using Sanity-native authentication only; no `middleware.ts` auth was added.
- Added the singleton Sanity client with fixed `apiVersion: "2026-07-01"`, `useCdn: true`, and `perspective: "published"`.
- Added centralized GROQ query exports for hero image, home top/bottom sections, leader cards, and upcoming events.
- Added Sanity image URL builder and `SanityImage` wrapper that applies WebP, quality 80, crop fitting, and a direct CDN loader with `unoptimized`.
- Added all required schema types with plain-language field labels and required field validation where specified.
- Configured and ran Sanity TypeGen to generate `lib/types.ts` from schema and queries.
- Added CMS infrastructure tests covering dependencies, Studio route/config, singleton client, image wrapper, queries, schemas, and type generation output.

### File List

- `app/studio/[[...tool]]/page.tsx`
- `app/studio/[[...tool]]/studio.tsx`
- `components/sanity-image.tsx`
- `lib/sanity/client.ts`
- `lib/sanity/env.ts`
- `lib/sanity/image.ts`
- `lib/sanity/queries.ts`
- `lib/types.ts`
- `package.json`
- `pnpm-lock.yaml`
- `sanity.cli.ts`
- `sanity.config.ts`
- `sanity/schema-types/hero-image.ts`
- `sanity/schema-types/home-section-bottom.ts`
- `sanity/schema-types/home-section-top.ts`
- `sanity/schema-types/index.ts`
- `sanity/schema-types/leader-card.ts`
- `sanity/schema-types/ward-event.ts`
- `schema.json`
- `tests/sanity-infrastructure.test.mjs`
- `_bmad-output/implementation-artifacts/1-2-sanity-studio-and-cms-infrastructure.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-07-02: Implemented Sanity Studio and CMS infrastructure; added schemas, queries, image utilities, type generation, guardrail tests, and validation.

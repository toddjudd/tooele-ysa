---
type: architecture-review
reviewer: version-verifier
reviewed: 2026-07-01
target: ARCHITECTURE-SPINE.md
method: live npm registry + GitHub releases lookup
---

# Version Verifier Review — Architecture Spine

## Sources

| Package             | Source checked                                       | Retrieved  |
| ------------------- | ---------------------------------------------------- | ---------- |
| `next`              | https://www.npmjs.com/package/next                   | 2026-07-01 |
| `next-sanity`       | https://www.npmjs.com/package/next-sanity            | 2026-07-01 |
| `@sanity/image-url` | https://www.npmjs.com/package/@sanity/image-url      | 2026-07-01 |
| `tailwindcss`       | https://github.com/tailwindlabs/tailwindcss/releases | 2026-07-01 |

---

## Findings

### F-1 — Next.js version pinned two major versions behind (CRITICAL)

**Architecture states:** `Next.js 15.x`
**Live registry:** `16.2.10` (published ~4 hours before this review; actively shipping)

This is a greenfield project. Running `npx create-next-app@latest` today scaffolds Next.js **16**, not 15. The architecture's rendering strategy assumptions (ISR via `export const revalidate`, App Router conventions, RSC patterns) were authored against Next.js 15 semantics. Next.js 16 may ship breaking changes or different defaults for those APIs. The stack table must be updated to `16.x` and any Next.js-version-specific API patterns (especially around `revalidate` export, route segment config, and `next.config.ts` shape) should be re-verified against Next.js 16 docs before scaffolding.

**Action required:** Update Stack table to `16.x`. Verify `revalidate` segment config export API, `next/image` remote pattern config shape, and `next.config.ts` module format in Next.js 16 release notes before scaffolding.

---

### F-2 — next-sanity version off by four major versions (CRITICAL)

**Architecture states:** `next-sanity 9.x [ASSUMPTION — verify]`
**Live registry:** `13.1.1` (published 14 days ago)

The architecture's `[ASSUMPTION — verify]` flag was correct — but the gap is severe. Four major versions have shipped since 9.x (v10, v11, v12, v13), each with a documented migration guide. AD-4 is built entirely around `next-sanity` as the sole Sanity integration layer. The API surface of next-sanity 13.x (client configuration shape, `defineLive`, `<VisualEditing />`, caching/revalidation helpers) may differ materially from what was assumed in the architecture.

The npm page confirms the package is actively maintained (359K weekly downloads, last publish 14 days ago). The v9→v10, v10→v11, v11→v12, v12→v13 migration guides are all available at `github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/`. The `createClient` and GROQ fetch patterns likely persist but should be confirmed.

**Action required:** Update Stack table to `13.x`. Read the v9→v13 migration chain before writing `lib/sanity/client.ts`. Confirm that the `createClient` call shape and server-fetch pattern in AD-3/AD-4 match the v13 API reference at `reference.sanity.io/next-sanity/`.

---

### F-3 — @sanity/image-url version off by one major (HIGH)

**Architecture states:** `@sanity/image-url 1.x [ASSUMPTION — verify]`
**Live registry:** `2.1.1` (published 3 months ago)

A v1→v2 migration guide exists (`github.com/sanity-io/image-url/blob/HEAD/MIGRATE-v1-to-v2.md`). The core builder pattern (`createImageUrlBuilder(client).image(source).width().format('webp').quality().url()`) is confirmed present in v2 based on the current npm readme — the API surface shown in AD-5 and `lib/sanity/image.ts` is largely consistent with v2. However, v2 introduced the `withClient()` method and the signed URL submodule, which indicates internal refactoring that may carry breaking changes in the constructor or client injection path.

**Action required:** Update Stack table to `2.x`. Confirm the `createImageUrlBuilder` import path and constructor signature against the v2 migration guide before writing `lib/sanity/image.ts`.

---

### F-4 — Tailwind CSS config format conflict in structural seed (HIGH)

**Architecture states (Stack table):** `Tailwind CSS 4.x` ✓ (version range confirmed — latest is 4.3.2)
**Architecture states (Structural seed):** `tailwind.config.ts` as a listed project file
**Architecture states (AD-8):** `tailwind.config.ts` primary, with hedge "(or `tailwind.css` under Tailwind v4 CSS-first config)"

**Reality:** Tailwind v4's defining feature is **CSS-first configuration** — there is no `tailwind.config.js/ts` in a fresh v4 project. The v4 blog post and all v4 docs show that tokens are defined in `@theme {}` blocks inside `globals.css` (or a dedicated CSS file), not in a TypeScript config. `create-next-app` with Tailwind enabled today scaffolds a v4 CSS-first config.

The structural seed file listing `tailwind.config.ts` is the **v3 pattern**. A developer following the structural seed literally would scaffold an extra file that Tailwind v4 does not use and may actively warn about. The real file for Tailwind v4 token extensions is `globals.css` (or a dedicated `tailwind.css`) with `@theme {}` blocks.

**Action required:** Remove `tailwind.config.ts` from the structural seed. Update AD-8 to make CSS-first the primary pattern (remove the parenthetical hedge and invert it). Update the Consistency Conventions table reference from `tailwind.config.ts` to `globals.css @theme {}`. Confirm whether `@tailwindcss/postcss` or `@tailwindcss/vite` is the integration path for Next.js 16 + Tailwind 4.

---

### F-5 — Node.js runtime version on Vercel unverified (MEDIUM)

**Architecture states:** `Node.js 22 LTS [ASSUMPTION — verify]`
**Verification status:** Not directly confirmed (Vercel dashboard/docs not checked in this pass)

Node.js 22 became LTS in October 2024 and is plausible as Vercel's current default, but this was not verified against Vercel's runtime documentation. This assumption is flagged in the architecture itself and was not independently confirmed in this review pass. Vercel's default Node.js runtime for new projects should be checked at vercel.com/docs/functions/runtimes/node-js before deployment.

**Action required:** Check Vercel docs for the current default Node.js runtime. Update the Stack table with the confirmed version. Low-risk for this stack (no custom Node.js runtime features are used), but worth confirming before first deploy.

---

### F-6 — Sanity Studio 3.x — confirmed correct (PASS)

The embedded Studio uses `next-sanity` v13's Studio embedding mechanism. Sanity Studio v3 is the current generation and confirmed active. No version concern.

---

## Summary Table

| Finding | Item                   | Architecture states          | Live reality                        | Severity     |
| ------- | ---------------------- | ---------------------------- | ----------------------------------- | ------------ |
| F-1     | Next.js                | 15.x                         | 16.2.10                             | **CRITICAL** |
| F-2     | next-sanity            | 9.x                          | 13.1.1                              | **CRITICAL** |
| F-3     | @sanity/image-url      | 1.x                          | 2.1.1                               | **HIGH**     |
| F-4     | Tailwind config format | `tailwind.config.ts` in seed | CSS-first (`globals.css @theme {}`) | **HIGH**     |
| F-5     | Node.js on Vercel      | 22 LTS (unverified)          | Unconfirmed                         | MEDIUM       |
| F-6     | Sanity Studio          | 3.x                          | 3.x (current)                       | PASS         |

---

## Verdict

The architecture's version assumptions are **materially out of date on four items** — two critically (Next.js 15→16, next-sanity 9→13) and two significantly (image-url 1→2, Tailwind config format) — all correctly self-flagged as `[ASSUMPTION — verify]` in the spine, confirming the flag discipline worked, but requiring resolution before any scaffolding begins.

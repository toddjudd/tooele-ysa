# Adversarial Architecture Review

**Target:** ARCHITECTURE-SPINE.md — Tooele YSA Ward Website
**Date:** 2026-07-01
**Method:** Construct pairs of compliant-but-incompatible implementation units; every conflict is a spine hole.

---

## Verdict

The spine has a solid structural skeleton but contains five actionable holes — two of them critical — where two developers each obeying every AD to the letter would produce incompatible artifacts at integration time.

---

## Finding 1 — `wardEvent.dateTime` field type ambiguity (CRITICAL)

**Conflicting pair:** Developer A builds `sanity/schema-types/ward-event.ts` using Sanity's `date` type (stores `"YYYY-MM-DD"` string). Developer B builds `components/event-item.tsx` expecting a `datetime` type (ISO 8601 with time, `"YYYY-MM-DDTHH:mm:ssZ"`). Both obey AD-1 (schema in `sanity/schema-types/`), AD-4 (GROQ in `queries.ts`), and every convention.

**Why it happens:** The structural seed shows `{ _type, title, dateTime, description?, location? }` but never specifies whether `dateTime` is a Sanity `date` field (date-only) or a `datetime` field (full timestamp). These are distinct Sanity field types with different stored shapes and different Sanity Studio input widgets. A component that calls `new Date(event.dateTime)` parses both, but a component that formats with `.toLocaleTimeString()` produces nonsense from a date-only string.

**Hole to close:** Add a new AD (or tighten the structural seed) that specifies every Sanity schema field's exact primitive type — `date` vs. `datetime`, `string` vs. `text`, `number` vs. `slug`. At minimum add a type table for all three document schemas with Sanity type names and required/optional status for every field.

---

## Finding 2 — `heroImage.image` asset reference shape unspecified (CRITICAL)

**Conflicting pair:** Developer A building `sanity/schema-types/hero-image.ts` declares `image` as a Sanity `image` type with `hotspot: true` (stores `{ asset: { _ref, _type }, hotspot, crop }`). Developer B building `components/sanity-image.tsx` assumes `image` is just `{ asset: Reference }` without hotspot fields and omits the `hotspot`/`crop` pass-through to `@sanity/image-url`. Both comply with AD-5 (use `@sanity/image-url`).

**Additional variant:** Developer C building `components/hero-carousel.tsx` passes `image.asset._ref` directly to the URL builder while Developer D's `sanity-image.tsx` passes the full image object. `urlFor(image)` vs. `urlFor(image.asset._ref)` produce the same result today but break if the builder's input contract changes.

**Why it happens:** AD-5 mandates `@sanity/image-url` and `format('webp')` but says nothing about:

- Whether hotspot/crop must be preserved (only matters if schema declares `hotspot: true`)
- Whether `sanity-image.tsx` is the _required_ wrapper for all Sanity image rendering (the AD says it "is configured with a Sanity image loader" but doesn't prohibit inline usage)
- What shape the `image` prop passed to any image component must have

**Hole to close:** (a) Mandate that all Sanity image rendering goes through `components/sanity-image.tsx` with no exceptions — add to AD-5 or create AD-9. (b) Specify in the structural seed that `heroImage.image` is `type: 'image', options: { hotspot: true }` and that `sanity-image.tsx` receives the full image object (not just the asset ref) and forwards hotspot/crop to the URL builder.

---

## Finding 3 — Sanity client `apiVersion`, `useCdn`, and `perspective` unspecified (HIGH)

**Conflicting pair:** Developer A builds `lib/sanity/client.ts` with `useCdn: false, apiVersion: "2024-01-01", perspective: "published"`. Developer B, writing a new ISR page and impatient with the single `client.ts`, imports `createClient` directly from `next-sanity` with `useCdn: true, apiVersion: "2023-06-01"`. Both obey AD-3 (server-only), AD-4 (next-sanity, not raw fetch), and all conventions.

**Why it happens:** AD-4 says "all GROQ queries and client configuration go through `next-sanity`" but only prohibits raw `fetch()` to the Sanity API. It does not:

- Require that all pages import the client singleton from `lib/sanity/client.ts` (vs. calling `createClient` themselves)
- Specify the `apiVersion` date string (a mismatch causes query behavior differences across the application)
- Specify `useCdn: true/false` (CDN-cached responses can be up to 60 seconds stale independent of ISR revalidation, creating compounding staleness)
- Specify `perspective: "published"` (without this, draft documents can leak into production queries)

**Hole to close:** Tighten AD-4: "All page modules and components import the Sanity client exclusively from `lib/sanity/client.ts`. No module calls `createClient` directly. `lib/sanity/client.ts` exports one singleton. Specify `apiVersion: "2024-01-01"` (or current), `useCdn: true`, `perspective: "published"` as the singleton's required values."

---

## Finding 4 — TypeScript type generation strategy creates divergent optionality (HIGH)

**Conflicting pair:** Developer A writes `lib/types.ts` by hand, marking `leaderCard.phone` and `leaderCard.email` as `string | undefined`. Developer B runs `sanity-typegen` which, depending on the schema validation rules set in the Sanity schema file, may emit `string | null` (Sanity's codegen can output `null` for optional references). Developer C building `components/leader-card.tsx` writes `if (leader.phone)` (works for both). Developer D building a hypothetical contact aggregation later writes `leader.phone ?? ''` which is fine for `undefined` but throws a TS strict-null error if the type is `null` depending on compiler settings.

**More dangerous variant:** The conventions say "No `any`; strict mode on." `strict mode on` in TypeScript enables `strictNullChecks`, `strictFunctionTypes`, `noImplicitAny`, and five other flags. Two developers could each interpret "strict mode on" as "I set `strict: true` in tsconfig" (correct) vs. "I don't write `any`" (incomplete). If `tsconfig.json` is not committed with `strict: true` from the start, one developer might scaffold with a looser config.

**Hole to close:** (a) State explicitly in conventions: "TypeScript type generation method is `sanity-typegen` exclusively — no hand-written Sanity document types. Types are regenerated from schema after every schema change." (b) Add to conventions or AD-8 equivalent: "`tsconfig.json` must include `strict: true` and `noUncheckedIndexedAccess: true` as invariants — not to be relaxed."

---

## Finding 5 — Error handling and null-safety contract is entirely absent (HIGH)

**Conflicting pair:** Developer A builds `app/(site)/about/page.tsx`, wraps the `leaderCardsQuery` call in `try/catch`, and renders an error boundary component on failure. Developer B builds `app/(site)/connect/page.tsx`, calls the query with no error handling (trusting ISR to never re-render on a failed fetch), and the component crashes Next.js rendering if Sanity returns a network error during revalidation — an uncaught error in an RSC during ISR causes the stale page to be served silently, masking the failure.

**Additional variant:** Developer A returns `[]` from a failed query and renders the empty-state UI. Developer B lets the error propagate to Next.js error boundary. The site has two different failure modes for the same type of event on different pages.

**Why it happens:** The conventions table has "Empty states: CMS-driven sections always render a graceful empty state when Sanity returns an empty array" but this covers only the data-present/empty distinction. There is no AD or convention for:

- What to do when the GROQ query itself throws (network error, invalid token)
- Whether page-level `error.tsx` files are required for each route
- Whether query functions should return typed `Result<T>` or throw
- Whether Suspense boundaries are required around any async component

**Hole to close:** Add AD-9 (or Error Handling Convention section): "All GROQ query calls in RSC page modules must be wrapped in try/catch. On error, the query function returns its zero-value (`[]` for arrays, `null` for single documents). Pages must have a co-located `error.tsx`. The empty-state convention applies equally to null document and empty array returns."

---

## Finding 6 — GROQ query centralization in `queries.ts` is ambiguous about file count (MEDIUM)

**Conflicting pair:** Developer A puts all queries in `lib/sanity/queries.ts` (one file, as implied by the singular noun). Developer B, finding the file unwieldy, creates `lib/sanity/home-queries.ts` and `lib/sanity/about-queries.ts`, reasoning that they are "named exports from `lib/sanity/`." Both can claim AD-4 compliance since the AD says "named exports from `lib/sanity/queries.ts`" but the structural seed lists only `queries.ts` and the AD wording is easy to misread as "queries file in lib/sanity."

**Secondary issue:** A developer building `/about` page could import from `lib/sanity/about-queries.ts` which exports an inline GROQ string, since AD-4's prohibition of "inline query strings in page files" does not extend to non-`queries.ts` files within `lib/sanity/`.

**Hole to close:** Tighten AD-4: "All GROQ query strings live in `lib/sanity/queries.ts` — one file. No additional query files may be created under `lib/sanity/`. A page may not import a GROQ string from any other location."

---

## Finding 7 — `heroImage.order` sort semantics unspecified (MEDIUM)

**Conflicting pair:** Developer A writes the GROQ query for the hero carousel as `*[_type == "heroImage"] | order(order asc)`. Developer B writes `*[_type == "heroImage"] | order(_createdAt asc)` (using creation time as a fallback, since "order" is not mentioned in the query conventions). Developer C sorts client-side after fetching. All three comply with AD-4 (named GROQ export) and AD-2 (ISR).

**Secondary:** No AD specifies what happens when two hero images have the same `order` value — a tie-breaking rule is needed (e.g., secondary sort by `_createdAt`) or the carousel ordering becomes non-deterministic across re-renders.

**Hole to close:** Add to the structural seed or query conventions: "The `heroImage` GROQ query sorts by `order asc, _createdAt asc`. If the Content Manager assigns duplicate order values, earlier-created image appears first."

---

## Finding 8 — Accessibility enforcement is conventions-only with no tooling mandate (LOW)

**Conflicting pair:** Developer A installs `eslint-plugin-jsx-a11y` and enforces WCAG programmatically. Developer B reads the tap-target and alt-text conventions as editorial guidance and doesn't configure any linting. Both comply with every AD. Violations only surface in manual QA — or not at all.

**Why it matters:** The conventions state WCAG 2.1 AA tap targets (44×44 px) and non-empty `alt` text, but there is no AD that mandates accessibility linting tooling. One developer building components can silently skip these rules.

**Hole to close:** Add to conventions (or new AD): "`eslint-plugin-jsx-a11y` is installed and configured with `recommended` ruleset. CI fails on accessibility lint errors. This is the enforcement mechanism for alt text and tap target rules."

---

## Summary Table

| #   | Finding                                                                                                 | Severity     | AD Action                                                    |
| --- | ------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------ |
| 1   | `wardEvent.dateTime` Sanity field type (`date` vs `datetime`) unspecified                               | **CRITICAL** | Add schema type table to spine or new AD                     |
| 2   | `heroImage.image` asset shape + hotspot unspecified; `sanity-image.tsx` wrapper not mandatory           | **CRITICAL** | Tighten AD-5 + structural seed                               |
| 3   | Sanity client `apiVersion`, `useCdn`, `perspective` unspecified; `createClient` not prohibited in pages | **HIGH**     | Tighten AD-4 to mandate singleton import                     |
| 4   | TypeScript type generation method (`hand` vs `sanity-typegen`) and `strict` config unspecified          | **HIGH**     | Add to conventions: sanity-typegen only; tsconfig invariants |
| 5   | Error handling contract (GROQ throw vs. empty return, error.tsx requirement) completely absent          | **HIGH**     | Add AD-9: error handling convention                          |
| 6   | `queries.ts` (singular) ambiguous — additional query files not prohibited                               | **MEDIUM**   | Tighten AD-4 wording                                         |
| 7   | `heroImage.order` sort direction and tie-breaking unspecified                                           | **MEDIUM**   | Add sort rule to query conventions                           |
| 8   | Accessibility enforcement is convention-only; no linting tooling mandate                                | **LOW**      | Add eslint-plugin-jsx-a11y to conventions                    |

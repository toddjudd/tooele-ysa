# Addendum: Tooele YSA Ward Website

_Technical depth and implementation context that belongs downstream (architecture, scaffolding) rather than in the PRD's requirement narrative. Captured here so it is not lost._

---

## Tech Stack Decisions

### Next.js

- **App Router vs Pages Router:** App Router (Next.js 13+) is the current default and aligns with ISR and Server Components. Recommended unless Todd has a specific Pages Router preference.
- **Rendering strategy per route:**
  - `/` (Home) — ISR; hero carousel images fetched from Sanity at build + revalidated on interval.
  - `/gatherings` — SSG; fully static, no Sanity dependency.
  - `/about` — ISR; leadership directory fetched from Sanity; missionaries section statically embedded.
  - `/connect` — ISR; events calendar fetched from Sanity; link tree statically embedded.

### Tailwind CSS

- Use Tailwind v3 (or v4 if Todd's setup is current). All layout, spacing, color, and typography via utility classes.
- Custom color palette should be defined in `tailwind.config.js` to reflect ward branding. Confirmed brand color: `#002735` (dark teal/navy — used as Hero Carousel fallback background).

### Sanity CMS

- **Sanity v3** (current). Studio co-located in the Next.js repo (`/sanity` or `/studio` folder) for single-repo simplicity.
- **API token:** Read-only public token for the front end; full-access token restricted to Studio and server-side environment.
- **GROQ queries:** Used server-side only (RSC or `getStaticProps`/`generateStaticParams`). Never expose the token in client components.

---

## Sanity Document Type Sketches

These are implementation guidance for the developer — not PRD requirements.

### `heroImage`

```ts
{
  _type: 'heroImage',
  title: string,          // Content Manager's label, e.g. "July 4th Announcement"
  image: SanityImageAsset, // uploaded from Canva export
  displayOrder: number,   // integer; lower = earlier in carousel
  isActive: boolean,      // toggle to show/hide without deleting
}
```

### `leaderCard`

```ts
{
  _type: 'leaderCard',
  name: string,           // required
  title: string,          // required, e.g. "Bishop"
  phone: string,          // optional, e.g. "+1 (435) 555-0100"
  email: string,          // optional
  displayOrder: number,   // controls card order on page
}
```

### `wardEvent`

```ts
{
  _type: 'wardEvent',
  title: string,          // required
  dateTime: datetime,     // required; Sanity datetime field
  description: text,      // optional
  location: string,       // optional, e.g. "Chapel Cultural Hall"
}
```

---

## Image Optimization Pipeline

1. Content Manager exports image from Canva (PNG or JPG).
2. Uploads to Sanity Studio via the `heroImage` document's image field.
3. Sanity stores the original in Sanity's asset pipeline.
4. Front end requests the image via Sanity's image URL builder with `?auto=format&fit=crop&w=1920` (or similar) parameters.
5. Next.js `<Image>` component wraps the Sanity URL: further optimization (lazy load, blur placeholder) applied at the Next.js layer.
6. Browser receives WebP at appropriate size; LCP target (≤ 2.5 s) met without developer intervention per upload.

---

## Deployment (Vercel — confirmed)

- Connect GitHub repo to Vercel; main branch = production.
- Environment variables needed:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `SANITY_API_READ_TOKEN` (server-only; not prefixed `NEXT_PUBLIC_`)
- Vercel's Edge Network handles CDN caching; ISR revalidation at 60 s (confirmed) flushes stale pages on next request after interval.

---

## Options Considered

### Why not use a website builder (Squarespace, Wix, TheCo)?

The reference site (thelocalchurchsydney.com) runs on The Church Co platform. That platform is purpose-built for churches but involves per-month SaaS costs and limits developer control. Todd explicitly chose Next.js + Tailwind + Sanity to own the stack, keep costs near zero (Vercel free tier, Sanity free tier), and have full layout control.

### Why Sanity and not a simpler CMS (e.g., Contentful, Notion API)?

Sanity's Studio can be fully co-located in the repo, customized with plain-language field labels for non-technical users, and its image pipeline eliminates a separate image optimization step. Free tier is generous for this site's volume.

### Why not a full Sanity-managed site?

Minimal CMS footprint was a stated goal. Static pages (Gatherings, missionaries, link tree) have content that almost never changes and benefit from zero-latency SSG delivery. Keeping Sanity scoped to three document types (hero images, leader cards, events) minimizes Content Manager cognitive load.

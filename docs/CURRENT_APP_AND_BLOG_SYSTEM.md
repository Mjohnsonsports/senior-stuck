# Current Application and Blog System

This is a Next.js App Router application for SeniorsStuck. The public site contains marketing/product pages, pricing/checkout flows, customer dashboard routes, and a Sanity-backed blog.

## Primary Stack

- Next.js `16.2.6`
- React `19.2.3`
- Tailwind CSS v4
- Sanity Studio and Sanity Content Lake for blog content
- Supabase for auth/customer data
- Stripe Checkout and webhooks
- Google Sheets webhook integration

## Local Development

```bash
npm run dev
```

The dev server runs at `http://localhost:3030`.

## Deployment

The production build command is:

```bash
npm run build
```

Vercel should use `.next` as the output directory. This is set in the repo-level `vercel.json`; if the Vercel dashboard still has `dist` configured, remove that stale project setting.

## Active Routes

Public site routes:

- `/`
- `/blog`
- `/blog/[slug]`
- `/blog/category/[slug]`
- `/pricing`
- `/checkout`
- `/success`
- `/dashboard`
- `/product`
- `/enough-is-enough`
- `/freelancer-detector-kit`
- `/implementation-masters-program`

Blog editor route:

- `/studio`

There is no custom `/admin` blog CMS anymore. The old Supabase/Payload admin implementation and `/api/admin/*` routes were removed so clients edit posts only in Sanity Studio.

## Blog Read Path

```text
app/(site)/blog/* pages
  -> lib/sanity/queries.ts
  -> lib/sanity/client.ts
  -> Sanity Content Lake
  -> components/blog/SanityPortableTextRenderer.tsx
```

The public blog only shows Sanity posts where:

- `status` is `published`
- `publishedAt` is set
- `publishedAt` is not in the future

## Blog Editing

Sanity Studio is embedded at `/studio`.

Relevant files:

- `sanity.config.ts`
- `sanity/schemas/post.ts`
- `sanity/schemas/blocks.ts`
- `sanity/schemas/author.ts`
- `sanity/schemas/category.ts`
- `components/blog/SanityPortableTextRenderer.tsx`

Supported editorial blocks include text, images, YouTube video embeds, uploaded video, CTA buttons, quotes, FAQ, divider, and product cards.

## Seed Content

The long-form SeniorsStuck seed posts live in:

```bash
scripts/seed-sanity-blog.ts
```

Run:

```bash
npm run seed:sanity-blog
```

The seed uses deterministic document IDs and `createOrReplace`, so rerunning it updates the same seeded posts instead of creating duplicates.

## Environment

Sanity variables:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=
```

`SANITY_API_WRITE_TOKEN` is only required for seed/import scripts and should never be exposed with `NEXT_PUBLIC_`.

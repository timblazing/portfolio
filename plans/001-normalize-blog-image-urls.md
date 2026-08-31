# Plan 001: Normalize blog image URLs in metadata

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8d017a6..HEAD -- src/app/blog/[slug]/page.tsx src/lib/blog-metadata.ts src/lib/blog-metadata.test.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/004-test-baseline.md
- **Category**: bug
- **Planned at**: commit `8d017a6`, 2026-08-31

## Why this matters

Each blog post supplies an absolute Unsplash image URL in its frontmatter, but
the article metadata currently prepends the site origin to every image value.
That produces invalid Open Graph and Twitter image URLs, so social previews do
not reliably use the configured post image. The fix must preserve absolute URLs
and correctly resolve site-relative paths without changing the content model or
the generated fallback image route.

## Current state

- `src/app/blog/[slug]/page.tsx` generates article metadata and JSON-LD for
  static blog routes.
- `content-collections.ts:17` defines `image` as an optional string.
- Current metadata concatenates the origin:

  ```tsx
  // src/app/blog/[slug]/page.tsx:56-61
  ...(image && {
    images: [
      {
        url: `${DATA.url}${image}`,
      },
    ],
  })
  ```

- The Twitter metadata at `src/app/blog/[slug]/page.tsx:68-70` uses the same
  concatenation, and JSON-LD at `src/app/blog/[slug]/page.tsx:106-108` repeats
  it before falling back to `/blog/${slug}/opengraph-image` when no image is
  present.
- Current content uses absolute image URLs, for example
  `content/api-design-principles.mdx:7`.
- Site-wide URL configuration is stored in `DATA.url` in
  `src/data/resume.tsx:17`. Existing utility code uses standard platform APIs
  such as `new URL` in the Open Graph image routes; use the same URL semantics
  rather than manual string concatenation.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Tests | `bun run test` | Vitest exits 0; URL helper regression tests pass |
| Typecheck | `bun run typecheck` | `tsc --noEmit` exits 0 with no errors |
| Lint | `bun run lint` | ESLint exits 0; existing generated-file warning may remain |
| Build | `bun run build` | Next production build exits 0 |

These `test` and `typecheck` scripts are established by plan 004. If plan 004
has not landed, stop and execute it first.

## Scope

**In scope** (the only files you should modify):

- `src/app/blog/[slug]/page.tsx`
- `src/lib/blog-metadata.ts` (create)
- `src/lib/blog-metadata.test.ts` (create)

**Out of scope**:

- `content/*.mdx` — the existing absolute and relative content values are
  inputs to support, not data to rewrite.
- `src/app/opengraph-image.tsx`, `src/app/blog/opengraph-image.tsx`, and
  `src/app/blog/[slug]/opengraph-image.tsx` — their avatar/font handling is not
  part of this defect.
- `next.config.mjs` — do not add image-domain configuration; these metadata
  URLs are not rendered through `next/image`.
- Any visual redesign, content copy change, or route change.

## Steps

### Step 1: Add a pure image URL resolver

Create `src/lib/blog-metadata.ts` with an exported function named
`resolveArticleImageUrl(image: string | undefined, siteUrl: string): string | undefined`.
It must return `undefined` for an absent image and otherwise return
`new URL(image, siteUrl).toString()`. This preserves an absolute `https://...`
URL and resolves `/images/post.png` against the configured site origin.

**Verify**: `bun run typecheck` → exits 0.

### Step 2: Use the resolver in all article metadata outputs

In `src/app/blog/[slug]/page.tsx`, import the helper and replace both manual
`${DATA.url}${image}` expressions: the Open Graph image URL, the Twitter image
URL, and the JSON-LD image value must all use the resolved URL. Preserve the
existing fallback `${DATA.url}/blog/${slug}/opengraph-image` when `post.image`
is absent.

**Verify**: `rg -n '\$\{DATA\.url\}\$\{(image|post\.image)\}' 'src/app/blog/[slug]/page.tsx'` → no matches.

### Step 3: Add regression tests for URL behavior

Create `src/lib/blog-metadata.test.ts` using the Vitest conventions introduced
by plan 004. Test at minimum:

- an absolute Unsplash-style URL is returned unchanged;
- a site-relative path resolves to the site origin;
- an undefined image returns undefined.

Do not test by making a network request.

**Verify**: `bun run test -- src/lib/blog-metadata.test.ts` → all three cases pass.

## Test plan

The new pure-helper tests cover the exact regression without requiring a Next
server or external network. The existing pagination tests from plan 004 remain
part of the full suite. The build is also required because the affected module
is an App Router route with generated metadata and JSON-LD.

## Done criteria

- [ ] `bun run test` exits 0 and includes the image URL regression tests.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run lint` exits 0.
- [ ] `bun run build` exits 0.
- [ ] Absolute image URLs are not prefixed with `DATA.url`.
- [ ] Site-relative image paths resolve against `DATA.url`.
- [ ] The no-image JSON-LD fallback route is unchanged.
- [ ] `git status --short` shows changes only to the three in-scope files plus
      the executor's permitted `plans/README.md` status update.

## STOP conditions

Stop and report back if:

- the metadata route no longer contains the expressions described above;
- the content collection changes `image` to a non-string or required field;
- resolving a relative image requires changing Next image configuration;
- a test requires network access or modifying MDX content;
- any verification command fails twice after a reasonable fix attempt.

## Maintenance notes

Keep this resolver as the single boundary for article image URLs. If future
frontmatter supports remote image transformation, signed URLs, or provider
allowlists, extend the helper and its tests rather than reintroducing string
concatenation in route metadata. Reviewers should check absolute URLs, root-
relative URLs, and the generated fallback independently.

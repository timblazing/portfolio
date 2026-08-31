# Plan 002: Publish accurate article modification dates

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
- **Depends on**: plans/001-normalize-blog-image-urls.md
- **Category**: bug
- **Planned at**: commit `8d017a6`, 2026-08-31

## Why this matters

The content schema and every current post expose `updatedAt`, but the article
route discards it and reports `publishedAt` as `dateModified`. Search engines
and consumers of the JSON-LD therefore receive stale modification metadata after
an edited post. This plan uses `updatedAt` when present and safely falls back to
`publishedAt` for older content.

## Current state

- `content-collections.ts:13-14` defines both `publishedAt` and optional
  `updatedAt` as strings.
- Current posts populate both fields; for example
  `content/api-design-principles.mdx:3-5` has publication and update dates.
- `src/app/blog/[slug]/page.tsx:40-45` currently destructures `publishedAt` but
  not `updatedAt`.
- Open Graph metadata currently supplies `publishedTime` only at
  `src/app/blog/[slug]/page.tsx:50-55`; JSON-LD currently hardcodes
  `dateModified: post.publishedAt` at `src/app/blog/[slug]/page.tsx:99-105`.
- The project uses plain ISO date strings (`YYYY-MM-DD`) in frontmatter and
  already formats dates with UTC semantics in `src/lib/utils.ts:9-17`. Preserve
  the source strings; do not convert them to local-time display strings.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Tests | `bun run test` | Vitest exits 0, including date helper regression tests |
| Typecheck | `bun run typecheck` | `tsc --noEmit` exits 0 with no errors |
| Lint | `bun run lint` | ESLint exits 0; existing generated-file warning may remain |
| Build | `bun run build` | Next production build exits 0 |

## Scope

**In scope** (the only files you should modify):

- `src/app/blog/[slug]/page.tsx`
- `src/lib/blog-metadata.ts`
- `src/lib/blog-metadata.test.ts`

**Out of scope**:

- `content/*.mdx` — do not rewrite dates or content.
- Blog sorting and pagination — they are unrelated to modification metadata.
- The Open Graph image route files — image generation is not changing here.
- Any change to the visible date displayed in the article body.

## Steps

### Step 1: Add a tested date fallback helper

In `src/lib/blog-metadata.ts`, add an exported pure function named
`resolveArticleModifiedDate(publishedAt: string, updatedAt?: string): string`
that returns `updatedAt` when it is a non-empty value and otherwise returns
`publishedAt`. Keep the function string-based so the original ISO value reaches
metadata unchanged.

**Verify**: `bun run typecheck` → exits 0.

### Step 2: Apply the helper to Open Graph and JSON-LD

In `src/app/blog/[slug]/page.tsx`, read `updatedAt` from `post` and compute the
resolved modification date using the helper. Keep `publishedTime`/`datePublished`
bound to `post.publishedAt`. Add Open Graph `modifiedTime` using the resolved
date, and set JSON-LD `dateModified` to the same resolved date. Do not remove
`publishedTime` or change the article URL.

**Verify**: `rg -n 'updatedAt|modifiedTime|dateModified' 'src/app/blog/[slug]/page.tsx'` → all three concepts are present, and `rg -n 'dateModified: post\.publishedAt' 'src/app/blog/[slug]/page.tsx'` → no matches.

### Step 3: Test both date paths

Extend `src/lib/blog-metadata.test.ts` with tests proving that an explicit
`updatedAt` wins and an absent or empty `updatedAt` falls back to
`publishedAt`.

**Verify**: `bun run test -- src/lib/blog-metadata.test.ts` → all URL and date cases pass.

## Test plan

The pure helper tests cover the explicit-update and fallback cases without
depending on Next metadata internals. The full build confirms the route still
compiles and statically generates all seven current post pages.

## Done criteria

- [ ] `bun run test` exits 0.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run lint` exits 0.
- [ ] `bun run build` exits 0.
- [ ] Open Graph exposes both publication and modification dates.
- [ ] JSON-LD uses `updatedAt` when supplied and `publishedAt` otherwise.
- [ ] The visible article date remains based on `publishedAt`.
- [ ] Only the three in-scope files plus the permitted plan-index status update
      are modified.

## STOP conditions

Stop and report back if:

- `updatedAt` is no longer optional or is not a string in the live schema;
- the Next metadata type rejects `modifiedTime` and resolving that requires a
  dependency upgrade;
- current content contains non-ISO date formats that require a product choice;
- the route has been refactored so the cited metadata blocks no longer exist;
- any verification command fails twice after a reasonable fix attempt.

## Maintenance notes

Future article metadata fields should use the same source-of-truth date helper.
Reviewers should verify that `datePublished` never changes when an article is
edited and that the fallback remains valid for posts without `updatedAt`.

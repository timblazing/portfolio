# Plan 004: Establish a minimal automated test baseline

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8d017a6..HEAD -- package.json bun.lock src/lib/pagination.test.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `8d017a6`, 2026-08-31

## Why this matters

The repository has no test files and `package.json` exposes no test or
standalone typecheck script. The blog’s pagination utility is pure, shared, and
already has edge cases around invalid and out-of-range page values, making it a
safe first characterization target. A small deterministic Vitest baseline gives
future fixes a repeatable gate without introducing browser or network-test
complexity.

## Current state

- `package.json:8-13` currently defines only `dev`, `build`, `start`, `lint`,
  and `lint:fix`; there is no `test` or `typecheck` script.
- No `*.test.*` or `*.spec.*` files exist in the repository.
- `src/lib/pagination.ts` contains pure functions:
  - `paginate` computes `totalPages`, slices a page, and returns navigation
    flags (`:25-48`).
  - `getPaginationMeta` computes the same metadata without slicing (`:53-67`).
  - `normalizePage` maps undefined, invalid, below-one, and above-maximum
    values into a page number (`:73-84`).
- The project uses Bun and has a committed `bun.lock`. Add the test runner as a
  dev dependency through Bun so the lockfile remains authoritative. In the
  executor's Bun 1.4 resolution, adding Vitest may also re-resolve the existing
  `lightningcss` package family from 1.32.0 to 1.33.0 even though
  `package.json` does not request that change. This exact lockfile-only side
  effect is acceptable if it is the only pre-existing package-family change;
  any broader unrelated change remains a STOP condition.
- TypeScript is strict (`tsconfig.json:1-22`) and uses `noEmit`; add a direct
  typecheck script rather than relying only on `next build`’s internal check.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Add test runner | `bun add --dev vitest` | Vitest is added to `devDependencies` and `bun.lock` updates successfully |
| Tests | `bun run test` | All pagination tests pass |
| Focused tests | `bun run test -- src/lib/pagination.test.ts` | The pagination test file passes |
| Typecheck | `bun run typecheck` | `tsc --noEmit` exits 0 with no errors |
| Lint | `bun run lint` | ESLint exits 0; existing generated-file warning may remain |
| Build | `bun run build` | Next production build exits 0 |

## Scope

**In scope** (the only files you should modify):

- `package.json`
- `bun.lock`
- `src/lib/pagination.test.ts` (create)

**Out of scope**:

- Production source behavior in `src/lib/pagination.ts`; this plan establishes
  characterization tests and must not silently change semantics.
- React Testing Library, Playwright, browser automation, network calls, or
  snapshot tests.
- Blog route implementation, content files, CI workflow, or UI components.
- Intentional dependency upgrades unrelated to adding Vitest. The exact
  Bun-generated lockfile re-resolution of the existing `lightningcss` family
  described in Current state may remain, but must be reported in NOTES.

## Steps

### Step 1: Add Vitest and explicit scripts

Run `bun add --dev vitest`. Add these scripts to `package.json` while
preserving the existing scripts and their commands:

```json
"test": "vitest run",
"typecheck": "tsc --noEmit"
```

Do not add watch mode as the default `test` command; CI and plan executors need
a terminating command.

**Verify**: `bun run test -- --help` → Vitest starts successfully and exits 0;
`bun run typecheck` → exits 0.

### Step 2: Add focused pagination tests

Create `src/lib/pagination.test.ts` and import `paginate`,
`getPaginationMeta`, and `normalizePage` from `./pagination`. Use Vitest’s
`describe`, `expect`, and `it` APIs. Cover these cases with explicit assertions:

- `paginate` returns items 1–5 and correct metadata for page 1 of a 7-item list;
- page 2 of the same list returns items 6–7, has no next page, and has a
  previous page;
- `paginate` reports zero total pages and an empty item list for an empty array
  when called with page 1 and page size 5;
- `getPaginationMeta(12, { page: 2, pageSize: 5 })` reports 3 total pages and
  both navigation flags correctly;
- `normalizePage` maps undefined, nonnumeric text, and values below 1 to 1;
- `normalizePage` caps a value above the maximum page.

Do not add assertions for behavior not represented by the current function
contract, such as zero or negative page sizes. If a desired behavior is unclear,
stop rather than changing production code to satisfy the test.

**Verify**: `bun run test -- src/lib/pagination.test.ts` → all cases pass.

### Step 3: Run the complete baseline gates

Run the test, typecheck, lint, and build commands. The build may regenerate
ignored `.next` or content-collection output; do not commit generated files
unless they are already tracked.

**Verify**: `bun run test && bun run typecheck && bun run lint && bun run build` → exit 0.

## Test plan

The new tests are deterministic unit tests for the pure pagination module. They
intentionally avoid rendering, external APIs, filesystem fixtures, and timing.
Plans 001 and 002 should extend the same test file or its neighboring pure
metadata test with regression cases for article metadata after this baseline is
in place.

## Done criteria

- [ ] `vitest` is present in `devDependencies` and `bun.lock` is consistent.
- [ ] `bun run test` exits 0 with all pagination cases passing.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run lint` exits 0.
- [ ] `bun run build` exits 0.
- [ ] No production function in `src/lib/pagination.ts` was changed.
- [ ] No browser, network, snapshot, or unrelated dependency test was added.
- [ ] Only the three in-scope files plus the permitted plan-index status update
      are modified.

## STOP conditions

Stop and report back if:

- `bun add --dev vitest` changes any pre-existing dependency family other than
  the exact `lightningcss` re-resolution described in Current state, or requires
  replacing the committed Bun lockfile;
- the existing pagination implementation cannot satisfy the listed tests
  without changing production behavior;
- Vitest requires a custom configuration that would affect Next.js runtime
  behavior;
- the repository has gained a test framework or test convention not described
  here; inspect it and report before choosing a second framework;
- any verification command fails twice after a reasonable fix attempt.

## Maintenance notes

Keep pure utilities tested at the unit level and reserve browser tests for
route-level behavior that unit tests cannot observe. When changing pagination,
update tests for both item slicing and navigation metadata together. Keep the
terminating `test` script stable so CI and future executor plans can use it as a
reliable gate.

# Plan 003: Pin the image-publishing workflow actions

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8d017a6..HEAD -- .github/workflows/build-and-push.yml`
> If the workflow changed since this plan was written, compare the "Current
> state" excerpts against the live workflow before proceeding; on a mismatch,
> treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `8d017a6`, 2026-08-31

## Why this matters

The only CI workflow builds and pushes the production container image to GHCR,
and its jobs have `packages: write`. Every third-party GitHub Action is
referenced by a mutable major tag, so a tag retarget or compromised release can
change code executed with image-publishing privileges. Pinning each action to a
full commit SHA makes the workflow reproducible; release comments preserve the
human-readable version for maintenance.

## Current state

- `.github/workflows/build-and-push.yml:27-29` grants the build job
  `packages: write`; `.github/workflows/build-and-push.yml:75-77` grants the
  same permission to the merge job.
- The workflow currently uses mutable tags at:
  - `actions/checkout@v7` (`.github/workflows/build-and-push.yml:31`)
  - `docker/setup-buildx-action@v4` (`:38` and `:87`)
  - `docker/login-action@v4` (`:41` and `:90`)
  - `docker/build-push-action@v7` (`:49`)
  - `actions/upload-artifact@v7` (`:64`)
  - `actions/download-artifact@v8` (`:80`)
- The workflow publishes per-platform digests and then creates `latest` and a
  short-SHA image tag. Preserve that behavior exactly; this plan changes only
  action references.
- Existing workflow shell commands use quoted variables and GitHub-provided
  outputs. Do not rewrite those commands while pinning actions.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Inspect changes | `git diff --check` | no whitespace errors |
| Verify pins | `rg -n 'uses: .*@[0-9a-f]{40}' .github/workflows/build-and-push.yml` | every `uses:` line matches a 40-character lowercase SHA |
| Verify no mutable refs | `rg -n 'uses: .*@(v[0-9]+|main|master|latest)' .github/workflows/build-and-push.yml` | no matches |
| Lint | `bun run lint` | ESLint exits 0; existing generated-file warning may remain |
| Build | `bun run build` | Next production build exits 0 |

Resolving SHAs may use each action repository's canonical release tag and
`git ls-remote` or `gh api`. Do not invent a SHA, use a branch SHA, or copy a
SHA without confirming it belongs to the intended release.

## Scope

**In scope** (the only file you should modify):

- `.github/workflows/build-and-push.yml`

**Out of scope**:

- Dockerfile, image tags, permissions, cache settings, runner selection, and
  shell commands.
- Adding Dependabot, Scorecard, OIDC, signing, or a new workflow. Those may be
  follow-up hardening work but are not required for this finding.
- Any source, content, or plan file except the permitted status row in
  `plans/README.md`.

## Steps

### Step 1: Resolve immutable release SHAs

For each distinct action listed in Current state, resolve the commit SHA for
the exact major release currently named in the workflow. Confirm the resolved
commit is the release target from the action's canonical repository. Record a
short inline comment such as `# v7` beside the SHA so maintainers can identify
the intended release without dereferencing it.

**Verify**: for each action, the resolved SHA is a full 40-character commit
hash and the canonical repository reports it as the selected release tag.

### Step 2: Replace every mutable action reference

Change only the `uses:` values in `.github/workflows/build-and-push.yml` from
major tags to the verified full SHAs. Replace both occurrences of Buildx and
Docker Login, and leave the workflow structure and all `with:` values intact.

**Verify**: `rg -n '^\s*-?\s*uses:' .github/workflows/build-and-push.yml` → six distinct action names are present, and `rg -n 'uses: .*@(v[0-9]+|main|master|latest)' .github/workflows/build-and-push.yml` → no matches.

### Step 3: Run repository verification

Run the commands in the Commands table. Since this workflow is not executed
locally, static reference checks plus the existing lint/build gates are the
available verification; do not push an image as part of this plan.

**Verify**: `git diff --check && bun run lint && bun run build` → exit 0.

## Test plan

There is no local workflow runner in this repository. The regex checks verify
that every action reference is immutable and no mutable major/branch tag
remains. The existing application lint and build checks ensure the workflow-only
change did not affect application files or generated content.

## Done criteria

- [ ] All six action names are still present.
- [ ] Every `uses:` reference is pinned to a verified full commit SHA.
- [ ] No `uses:` reference uses a mutable version, branch, or `latest` tag.
- [ ] Workflow permissions, image tags, cache settings, and shell commands are
      unchanged.
- [ ] `git diff --check` exits 0.
- [ ] `bun run lint` exits 0.
- [ ] `bun run build` exits 0.
- [ ] No file outside `.github/workflows/build-and-push.yml` and the permitted
      plan-index status update is modified.

## STOP conditions

Stop and report back if:

- a release tag cannot be mapped unambiguously to a commit SHA;
- the workflow uses an action not listed in Current state;
- pinning requires changing permissions or workflow behavior;
- a proposed SHA is not from the action's canonical repository;
- any verification command fails twice after a reasonable fix attempt.

## Maintenance notes

When updating an action, resolve the new release tag to a verified full SHA and
update its adjacent version comment in the same change. Reviewers should check
that the SHA belongs to the intended upstream repository and that no mutable
reference was reintroduced. Dependency-update automation can be considered
later, but it is intentionally outside this plan.

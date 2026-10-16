# portfolio

Personal site built with Next.js and exported as static files for Cloudflare Pages.

## Local development

```sh
bun install --frozen-lockfile
bun run dev
```

Run `bun run lint`, `bun run test`, and `bun run typecheck` for local checks.
Run `bun run build` to generate the production site in `out/`.

## Deployment

Cloudflare Pages builds this repository through its Git integration:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `bun run build` |
| Build output directory | `out` |

Use the Next.js static HTML export preset if selecting a framework preset.
The build uses Webpack for compatibility with the site's font build. Keep
`package.json` and `bun.lock`: Pages needs them to install dependencies and build.
No GitHub Actions, container image, application server, or Pages Functions are needed.

Security headers are defined in `public/_headers`, which Next.js copies into
`out/_headers` for [Cloudflare Pages to apply](https://developers.cloudflare.com/pages/configuration/headers/).
Next.js exports the custom 404 page to `out/404.html`; Pages serves that for missing routes.

### HTTPS and redirects

Cloudflare terminates TLS and serves the static files directly. There is no
separate origin web server requiring an HTTP-to-HTTPS redirect or an origin
certificate. Both `http://portfolio-7nf.pages.dev/` and `http://blasingame.dev/`
already return a `301` redirect to HTTPS (verified October 16, 2026).

HTTPS availability and HTTP redirects are separate behaviors. For a custom
domain, verify that HTTP redirects to HTTPS; use Cloudflare's
[Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)
setting if necessary. Automatic HTTPS Rewrites updates links in content and
does not replace that redirect. No application redirect or `_redirects` file
is needed for the current routes.

Fork of [dillionverma/portfolio](https://github.com/dillionverma/portfolio).

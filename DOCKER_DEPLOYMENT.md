# Docker Deployment

This app is packaged as a Next.js standalone server image and published to GitHub Container Registry.

## Build and Publish

Pushing to `main` automatically builds and publishes a multi-platform image with GitHub Actions:

```text
ghcr.io/timblazing/portfolio:latest
ghcr.io/timblazing/portfolio:<git-sha>
```

The workflow can also be run manually from the repository's Actions tab.

For local publishing, authenticate once from your development machine:

```bash
echo "$GITHUB_TOKEN" | docker login ghcr.io -u timblazing --password-stdin
```

Then build and publish a multi-platform image:

```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

The script publishes the same tags:

```text
ghcr.io/timblazing/portfolio:latest
ghcr.io/timblazing/portfolio:<git-sha>
```

## VPS Compose File

Drop this into `compose.yaml` on the VPS:

```yaml
services:
  portfolio:
    image: ghcr.io/timblazing/portfolio:latest
    container_name: portfolio
    restart: unless-stopped
    ports:
      - "127.0.0.1:3000:3000"
    environment:
      NODE_ENV: production
```

Deploy or update:

```bash
docker compose pull
docker compose up -d --force-recreate
```

## Caddy

If Caddy is running directly on the VPS host:

```caddyfile
yourdomain.com {
  reverse_proxy 127.0.0.1:3000
}
```

If Caddy is running in the same Docker Compose project as this service, put both services on the same network and proxy by service name instead:

```caddyfile
yourdomain.com {
  reverse_proxy portfolio:3000
}
```

## Local Smoke Test

```bash
docker build -t portfolio:local .
docker run --rm -p 3000:3000 portfolio:local
```

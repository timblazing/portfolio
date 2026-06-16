#!/usr/bin/env bash
set -euo pipefail

REGISTRY="${REGISTRY:-ghcr.io}"
GITHUB_USERNAME="${GITHUB_USERNAME:-timblazing}"
IMAGE_NAME="${IMAGE_NAME:-portfolio}"
IMAGE="${REGISTRY}/${GITHUB_USERNAME}/${IMAGE_NAME}"
PLATFORMS="${PLATFORMS:-linux/amd64,linux/arm64}"
BUILDER_NAME="${BUILDER_NAME:-portfolio-builder}"

if ! docker buildx inspect "${BUILDER_NAME}" >/dev/null 2>&1; then
  docker buildx create --name "${BUILDER_NAME}" --use >/dev/null
else
  docker buildx use "${BUILDER_NAME}" >/dev/null
fi

GIT_SHA="$(git rev-parse --short HEAD 2>/dev/null || true)"

TAGS=(-t "${IMAGE}:latest")
if [ -n "${GIT_SHA}" ]; then
  TAGS+=(-t "${IMAGE}:${GIT_SHA}")
fi

echo "Building and pushing ${IMAGE}"
echo "Platforms: ${PLATFORMS}"
echo "Tags:"
printf '  %s\n' "${TAGS[@]}"

docker buildx build \
  --platform "${PLATFORMS}" \
  "${TAGS[@]}" \
  --push \
  .

echo
echo "Published ${IMAGE}:latest"
if [ -n "${GIT_SHA}" ]; then
  echo "Published ${IMAGE}:${GIT_SHA}"
fi

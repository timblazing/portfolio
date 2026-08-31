export function resolveArticleImageUrl(
  image: string | undefined,
  siteUrl: string
): string | undefined {
  if (!image) {
    return undefined;
  }

  return new URL(image, siteUrl).toString();
}

export function resolveArticleModifiedDate(
  publishedAt: string,
  updatedAt?: string
): string {
  return updatedAt || publishedAt;
}

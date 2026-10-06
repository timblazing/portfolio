import { BlogList, getBlogPageCount } from "@/components/blog-list";

export const dynamicParams = false;

export function generateStaticParams() {
  const pageCount = getBlogPageCount();
  return Array.from({ length: pageCount - 1 }, (_, index) => ({
    page: String(index + 2),
  }));
}

export default async function BlogPageNumber({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  return <BlogList page={Number(page)} />;
}

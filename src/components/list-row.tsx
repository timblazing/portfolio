import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type ListRowProps = {
  href: string;
  title: string;
  description: string;
} & Record<`data-${string}`, string>;

export function ListRow({ href, title, description, ...dataProps }: ListRowProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-md px-2 py-2.5 text-[15px] transition-colors duration-150 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
      {...dataProps}
    >
      <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:gap-4">
        <span className="truncate text-foreground sm:w-52 sm:shrink-0">
          {title}
        </span>
        <span className="truncate text-sm text-muted-foreground sm:text-[15px]">
          {description}
        </span>
      </div>
      <ArrowUpRight
        className="size-4 shrink-0 text-muted-foreground transition-[color,transform] duration-150 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-foreground"
        aria-hidden
      />
    </Link>
  );
}

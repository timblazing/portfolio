import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type ListRowProps = {
  href?: string;
  title: string;
  description?: string;
  meta?: string;
  className?: string;
} & Record<`data-${string}`, string>;

export function ListRow({
  href,
  title,
  description,
  meta,
  className,
  ...dataProps
}: ListRowProps) {
  const isExternal = href?.startsWith("http") ?? false;

  const content = (
    <>
      <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:gap-4">
        <span
          className={cn(
            "truncate text-foreground",
            description && "sm:w-52 sm:shrink-0",
          )}
        >
          {title}
        </span>
        {description && (
          <span className="truncate text-sm text-muted-foreground sm:text-[15px]">
            {description}
          </span>
        )}
      </div>
      {meta && (
        <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
          {meta}
        </span>
      )}
      {isExternal && (
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground transition-[color,transform] duration-150 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-foreground"
          aria-hidden
        />
      )}
    </>
  );

  const rowClassName = cn(
    "group flex items-center gap-3 rounded-md px-2 py-2.5 text-[15px]",
    href &&
      "transition-colors duration-150 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none",
    className,
  );

  if (!href) {
    return (
      <div className={rowClassName} {...dataProps}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={rowClassName}
      {...dataProps}
    >
      {content}
    </Link>
  );
}

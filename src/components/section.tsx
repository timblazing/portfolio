import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  className,
  children,
}: {
  id: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("flex flex-col", className)}>
      <h2 className="text-sm text-muted-foreground">{title}</h2>
      <div className="-mx-2 mt-2 flex flex-col">{children}</div>
    </section>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col">
      <h2 className="text-sm text-muted-foreground">{title}</h2>
      <div className="-mx-2 mt-2 flex flex-col">{children}</div>
    </section>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col gap-3">
      <h1 className="font-display text-xl font-medium tracking-tight">
        Page not found
      </h1>
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        This page doesn&apos;t exist.{" "}
        <Link
          href="/"
          className="text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"
        >
          Go home
        </Link>
        .
      </p>
    </main>
  );
}

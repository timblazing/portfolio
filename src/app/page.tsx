import BlurFade from "@/components/magicui/blur-fade";
import { ListRow } from "@/components/list-row";
import { Section } from "@/components/section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

type Social = (typeof DATA.contact.social)[keyof typeof DATA.contact.social];

function ContactLink({ social }: { social: Social }) {
  const isExternal = social.url.startsWith("http");

  return (
    <Link
      href={social.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      data-umami-event="contact-link-click"
      data-umami-event-name={social.name}
      data-umami-event-url={social.url}
      className="text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"
    >
      {social.name === "Email" ? "email" : social.name}
    </Link>
  );
}

export default function Page() {
  return (
    <main className="flex flex-col gap-10">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <section id="hero" className="flex flex-col gap-3 border-b pb-10">
          <Avatar className="mb-3 size-12 border">
            <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
            <AvatarFallback>{DATA.initials}</AvatarFallback>
          </Avatar>
          <h1 className="font-display text-xl font-medium tracking-tight">
            {DATA.name}
          </h1>
          <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">
            {DATA.description}
          </p>
          <p id="contact" className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            Contact me by <ContactLink social={DATA.contact.social.Email} />, or
            find me on <ContactLink social={DATA.contact.social.LinkedIn} /> and{" "}
            <ContactLink social={DATA.contact.social.GitHub} />.
          </p>
        </section>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <Section id="projects" title="Projects">
          {DATA.projects.map((project) => (
            <ListRow
              key={project.title}
              href={project.href}
              title={project.title}
              description={project.description}
              data-umami-event="project-click"
              data-umami-event-name={project.title}
            />
          ))}
        </Section>
      </BlurFade>
    </main>
  );
}

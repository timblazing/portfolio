/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DATA } from "@/data/resume";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function LogoImage({
  src,
  darkSrc,
  alt,
}: {
  src: string;
  darkSrc?: string;
  alt: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none" />
    );
  }

  const imageClassName =
    "size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none";

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={cn(imageClassName, darkSrc && "dark:hidden")}
        onError={() => setImageError(true)}
      />
      {darkSrc && (
        <img
          src={darkSrc}
          alt={alt}
          className={cn(imageClassName, "hidden dark:block")}
          onError={() => setImageError(true)}
        />
      )}
    </>
  );
}

export default function WorkSection() {
  const defaultCompany: string = DATA.work[0]?.company ?? "";
  const [openCompany, setOpenCompany] = useState<string>(defaultCompany);

  return (
    <Accordion
      type="single"
      collapsible
      value={openCompany}
      onValueChange={setOpenCompany}
      className="w-full grid gap-6"
    >
      {DATA.work.map((work) => {
        const isOpen = openCompany === work.company;

        return (
          <AccordionItem
            key={work.company}
            value={work.company}
            className="w-full border-b-0 grid gap-2"
          >
            <AccordionTrigger
              className="hover:no-underline p-0 cursor-pointer transition-colors rounded-none group [&>svg]:hidden"
              data-umami-event="experience-toggle"
              data-umami-event-company={work.company}
              data-umami-event-title={work.title}
              data-umami-event-action={isOpen ? "collapse" : "expand"}
            >
              {/* Existing trigger content */}
            </AccordionTrigger>

            <AccordionContent className="p-0 ml-13 text-xs sm:text-sm text-muted-foreground">
              {work.description}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

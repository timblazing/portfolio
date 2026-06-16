import { Icons } from "@/components/icons";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Python } from "@/components/ui/svgs/python";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";
import { Linux } from "@/components/ui/svgs/linux";
import { Microsoft365 } from "@/components/ui/svgs/microsoft365";
import { Caddy } from "@/components/ui/svgs/caddy";
import { Nginx } from "@/components/ui/svgs/nginx";
import { SQLite } from "@/components/ui/svgs/sqlite";

export const DATA = {
  name: "Clay Blasingame",
  initials: "CB",
  url: "https://blasingame.dev",
  location: "Oklahoma City, OK",
  locationLink: "https://www.google.com/maps/place/oklahoma+city",
  description:
    "Systems administrator who also ships software. I keep infrastructure reliable, automate the manual stuff, and build the internal tools a business actually runs on.",
  summary:
    "I run IT operations and systems administration day to day, but I also like building the tools that make the work faster. My experience covers network infrastructure, Microsoft 365 and Exchange administration, self-hosted Linux services, and full-stack development. I lean toward practical solutions that solve the actual problem instead of over-engineered ones that just look good on paper.",
  avatarUrl: "/me.png",
  skills: [
    { name: "Linux", icon: Linux },
    { name: "Docker", icon: Docker },
    { name: "Microsoft 365", icon: Microsoft365 },
    { name: "Caddy", icon: Caddy },
    { name: "Nginx", icon: Nginx },
    { name: "React", icon: ReactLight },
    { name: "Typescript", icon: Typescript },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "Python", icon: Python },
    { name: "Postgres", icon: Postgresql },
    { name: "SQLite", icon: SQLite },
  ],
  contact: {
    email: "clay@blasingame.dev",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/timblazing",
        icon: Icons.github,
      },

      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/clay-blasingame/",
        icon: Icons.linkedin,
      },
      Email: {
        name: "Email",
        url: "mailto:clay@blasingame.dev",
        icon: Icons.email,
      },
    },
  },

  work: [
    {
      company: "Graco Roofing & Construction",
      href: "https://gracoroofing.com",
      badges: [],
      location: "Edmond, OK",
      title: "IT & Systems Administrator",
      logoUrl: "/graco.png",
      darkLogoUrl: "/graco-light.png",
      start: "October 2024",
      end: "Present",
      description:
        "Run all IT operations and systems administration for a growing roofing & construction company. Built an internal CRM and admin dashboard that pulls the company's roofing-CRM and fleet platforms (AccuLynx, Samsara) into one place, deployed on self-hosted infrastructure. Administer Microsoft 365 and Exchange Online for the org, automate manual workflows, and maintain the network, servers, and day-to-day systems the business depends on.",
    },
    {
      company: "Cox Communications",
      badges: [],
      href: "https://cox.com",
      location: "Remote",
      title: "Technical Support Representative",
      logoUrl: "/cox.png",
      start: "January 2021",
      end: "April 2021",
      description:
        "Diagnosed internet and cable service issues across phone and chat support channels. Documented customer cases, escalated trending issues through ticketing workflows, and worked against support KPIs including first-call resolution, customer sentiment, and average handle time.",
    },
    {
      company: "Costco",
      href: "https://costco.com/",
      badges: [],
      location: "Oklahoma City, OK",
      title: "Customer Support Representative",
      logoUrl: "/costco.png",
      start: "January 2020",
      end: "April 2020",
      description:
        "Supported customers across ecommerce orders, warranty questions, account concerns, and technical website issues. Used CRM tools to document interactions, guide customers through resolutions, and escalate product listing, promotion, and discount issues when needed.",
    },
  ],
  education: [
    {
      school: "Oklahoma State University Institute of Technology",
      href: "https://osuit.edu",
      degree: "Associate of Science in Information Technology",
      logoUrl: "/osu.png",
      start: "2020",
      end: "2022",
    },
  ],
  projects: [
    {
      title: "Chat Collect",
      href: "https://chatcollect.com",
      dates: "Jan 2024 - Feb 2024",
      active: true,
      description:
        "With the release of the [OpenAI GPT Store](https://openai.com/blog/introducing-the-gpt-store), I decided to build a SaaS which allows users to collect email addresses from their GPT users. This is a great way to build an audience and monetize your GPT API usage.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
        "Magic UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://chatcollect.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/chat-collect.mp4",
    },
    {
      title: "Magic UI",
      href: "https://magicui.design",
      dates: "June 2023 - Present",
      active: true,
      description:
        "Designed, developed and sold animated UI components for developers.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
        "Magic UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://magicui.design",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/magicuidesign/magicui",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "https://cdn.magicui.design/bento-grid.mp4",
    },
    {
      title: "llm.report",
      href: "https://llm.report",
      dates: "April 2023 - September 2023",
      active: true,
      description:
        "Developed an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Shadcn UI",
        "Magic UI",
        "Stripe",
        "Cloudflare Workers",
      ],
      links: [
        {
          type: "Website",
          href: "https://llm.report",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/dillionverma/llm.report",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "https://cdn.llm.report/openai-demo.mp4",
    },
    {
      title: "Automatic Chat",
      href: "https://automatic.chat",
      dates: "April 2023 - March 2024",
      active: true,
      description:
        "Developed an AI Customer Support Chatbot which automatically responds to customer support tickets using the latest GPT models.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Shadcn UI",
        "Magic UI",
        "Stripe",
        "Cloudflare Workers",
      ],
      links: [
        {
          type: "Website",
          href: "https://automatic.chat",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/automatic-chat.mp4",
    },
  ],
} as const;

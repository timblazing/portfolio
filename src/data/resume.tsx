import { Icons } from "@/components/icons";

export const DATA = {
  name: "Clay Blasingame",
  initials: "CB",
  url: "https://blasingame.dev",
  location: "Oklahoma City, OK",
  description:
    "Builder at heart, with a background in IT and keeping things running. These days I'm pulled toward agentic development, clean interfaces, and tools that just work.",
  avatarUrl: "/me.png",
  contact: {
    email: "clay@blasingame.dev",
    tel: "",
    social: {
      Email: {
        name: "Email",
        url: "mailto:clay@blasingame.dev",
        icon: Icons.email,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/clay-blasingame/",
        icon: Icons.linkedin,
      },
      GitHub: {
        name: "GitHub",
        url: "https://github.com/timblazing",
        icon: Icons.github,
      },
    },
  },

  projects: [
    {
      title: "Fillrate",
      description: "Truckload planning optimizer",
      href: "https://fillrate.blasingame.dev",
    },
    {
      title: "SportsCal",
      description: "Sports calendars from ESPN data",
      href: "https://sportscal.site",
    },
    {
      title: "Components",
      description: "My personal design system",
      href: "https://components.blasingame.dev",
    },
  ],
} as const;

import { ExternalLink } from "lucide-react";

type Credit = { name: string; note: string; href: string };

const groups: { id: string; title: string; description: string; items: Credit[] }[] = [
  {
    id: "photography",
    title: "Photography",
    description:
      "Where a story uses a photograph, the photographer is credited with it. Placeholder images used during development come from the services below.",
    items: [
      {
        name: "Unsplash",
        note: "Free-to-use photography from photographers around the world.",
        href: "https://unsplash.com",
      },
      {
        name: "Lorem Picsum",
        note: "Placeholder images for layouts and sample content.",
        href: "https://picsum.photos",
      },
    ],
  },
  {
    id: "typefaces",
    title: "Typefaces",
    description:
      "Both families are open source under the SIL Open Font License, served through Google Fonts.",
    items: [
      {
        name: "Playfair Display",
        note: "Our headline serif, giving the pages their editorial voice.",
        href: "https://fonts.google.com/specimen/Playfair+Display",
      },
      {
        name: "Inter",
        note: "Our interface and body sans-serif, designed for screens.",
        href: "https://fonts.google.com/specimen/Inter",
      },
    ],
  },
  {
    id: "software",
    title: "Open-source software",
    description:
      "NewsPulse stands on the work of many maintainers. Our thanks to them.",
    items: [
      { name: "Next.js", note: "The React framework behind every page.", href: "https://nextjs.org" },
      { name: "React", note: "The interface library.", href: "https://react.dev" },
      { name: "Tailwind CSS", note: "Utility-first styling.", href: "https://tailwindcss.com" },
      { name: "shadcn/ui", note: "Accessible, customisable components.", href: "https://ui.shadcn.com" },
      { name: "Radix UI", note: "Accessible primitives underneath our menus and dialogs.", href: "https://www.radix-ui.com" },
      { name: "Framer Motion", note: "Animation and transitions.", href: "https://www.framer.com/motion" },
      { name: "Lucide", note: "The icon set.", href: "https://lucide.dev" },
      { name: "Prisma", note: "Database access.", href: "https://www.prisma.io" },
      { name: "Auth.js", note: "Authentication.", href: "https://authjs.dev" },
      { name: "Recharts", note: "Charts in the admin dashboard.", href: "https://recharts.org" },
      { name: "react-markdown", note: "Rendering story text.", href: "https://github.com/remarkjs/react-markdown" },
      { name: "Upstash", note: "Rate limiting.", href: "https://upstash.com" },
    ],
  },
    {
    id: "data",
    title: "Data",
    description: "Live figures shown around the site.",
    items: [
      {
        name: "Open-Meteo",
        note: "Weather data in the top bar, licensed CC BY 4.0.",
        href: "https://open-meteo.com",
      },
    ],
  },
];

export function Credits() {
  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section
          key={group.id}
          aria-labelledby={`${group.id}-heading`}
          className="space-y-5"
        >
          <div className="space-y-2 border-b pb-3">
            <h2 id={`${group.id}-heading`} className="text-2xl font-semibold">
              {group.title}
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {group.description}
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col gap-1 rounded-xl border p-4 transition-colors hover:bg-muted/50"
                >
                  <span className="flex items-center justify-between gap-2 font-serif font-semibold">
                    {item.name}
                    <ExternalLink
                      className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground"
                      aria-hidden="true"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.note}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
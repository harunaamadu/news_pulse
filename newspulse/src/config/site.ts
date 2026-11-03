export const siteConfig = {
  name: "NewsPulse",
  description:
    "Personalized editorial news, real-time alerts, offline reading and community discussion.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  nav: [
    { label: "Home", href: "/" },
    { label: "Discussions", href: "/discussions" },
    { label: "Bookmarks", href: "/bookmarks" },
  ],
  categories: [
    { label: "World", slug: "world" },
    { label: "Technology", slug: "technology" },
    { label: "Business", slug: "business" },
    { label: "Culture", slug: "culture" },
    { label: "Science", slug: "science" },
    { label: "Sports", slug: "sports" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
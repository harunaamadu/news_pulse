export const siteConfig = {
  name: "NewsPulse",
  description:
    "Personalized editorial news, real-time alerts, offline reading and community discussion.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  nav: [
    { label: "Home", href: "/" },
    { label: "Topics", href: "/topics" },
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
  featuresAndExpeditions: [
    { label: "Travel & Landscapes", slug: "travel-landscapes" },
    { label: "Culture & Monographs", slug: "culture-monographs" },
    {
      label: "Documentary Photo Galleries",
      slug: "documentary-photo-galleries",
      disabled: true,
    },
    { label: "Audio Dispatches", slug: "audio-dispatches", disabled: true },
    { label: "Discoveries", slug: "discoveries" },
  ],
  standardsAndIntegrity: [
    {
      label: "Standard",
      paragraph:
        "We are committed to maintaining the highest standards of journalism and integrity in all our reporting.",
    },
    { label: "Editorial Independence", slug: "editorial-independence" },
    { label: "Fact-Checking", slug: "fact-checking" },
    { label: "Transparency", slug: "transparency" },
    { label: "Code of Ethics", slug: "code-of-ethics" },
    { label: "Corrections", slug: "corrections" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

// Hostnames allowed for article cover images
export const imageHosts: readonly string[] = [
  "images.unsplash.com",
  "picsum.photos",
  "fastly.picsum.photos",
];

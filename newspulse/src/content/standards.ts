import { siteConfig } from "@/config/site";

type StandardConfig = Extract<
  (typeof siteConfig.standardsAndIntegrity)[number],
  { slug: string }
>;
export type StandardSlug = StandardConfig["slug"];

export type StandardSection = {
  id: string;
  heading: string;
  body: string[];
  bullets?: string[];
};

export type StandardContent = {
  summary: string;
  /** ISO date (YYYY-MM-DD), shown as "Last updated" */
  updated: string;
  sections: StandardSection[];
};

export const editorialEmail =
  process.env.NEXT_PUBLIC_EDITORIAL_EMAIL ?? "editors@example.com";

const standardContent: Record<StandardSlug, StandardContent> = {
  "editorial-independence": {
    summary:
      "How we keep newsroom decisions separate from advertisers, owners and outside pressure.",
    updated: "2026-11-05",
    sections: [
      {
        id: "our-commitment",
        heading: "Our commitment",
        body: [
          "Editorial decisions at NewsPulse are made by editors, on journalistic grounds alone. What we cover, how we cover it and when we publish are never traded for money, access or favours.",
        ],
      },
      {
        id: "separation",
        heading: "Separation from commercial interests",
        body: [
          "The people who sell advertising and partnerships are separate from the people who decide what we report.",
        ],
        bullets: [
          "Advertisers, sponsors and partners have no say in our coverage and no advance sight of stories.",
          "Commercial staff do not assign, edit or remove editorial content.",
          "Paid or sponsored material is always labelled and kept visually distinct from our reporting.",
          "We do not accept payment, gifts or trips in exchange for coverage.",
        ],
      },
      {
        id: "conflicts",
        heading: "Conflicts of interest",
        body: [
          "Everyone who contributes to NewsPulse is expected to declare any financial, personal or professional tie that could affect, or appear to affect, their work.",
        ],
        bullets: [
          "Relevant ties are disclosed to editors before work begins.",
          "An editor may reassign a story when a conflict can’t be managed.",
          "Where a tie matters to readers, we say so in the story itself.",
        ],
      },
      {
        id: "outside-pressure",
        heading: "Outside pressure",
        body: [
          "If anyone tries to influence our coverage, we record the attempt. Where it is in the public interest, we will tell readers about it.",
        ],
      },
    ],
  },

  "fact-checking": {
    summary:
      "How claims, figures, quotes and images are checked before and after we publish.",
    updated: "2026-11-05",
    sections: [
      {
        id: "before-publication",
        heading: "Before publication",
        body: [
          "Every factual claim in a story must be supported by a source an editor can examine.",
        ],
        bullets: [
          "Names, dates, figures and quotes are checked against primary sources wherever possible.",
          "Calculations are re-done, and statistics are given context such as the period, the sample and who produced them.",
          "Photographs and video are checked for origin, date and accurate captions.",
          "A second person reads each story before it goes live.",
        ],
      },
      {
        id: "sources",
        heading: "Sources",
        body: [
          "We name our sources whenever we can. We grant anonymity only when the information matters to the public, can’t reasonably be obtained another way, and an editor knows who the source is and why they need protection.",
          "For contested or high-impact claims, we look for independent confirmation before we publish.",
        ],
      },
      {
        id: "uncertainty",
        heading: "Saying what we don’t know",
        body: [
          "When facts are unsettled, we say so plainly instead of smoothing over the gaps. Reporting, analysis and opinion are labelled as such, so readers can tell what is established, what is interpretation and what is argument.",
        ],
      },
      {
        id: "after-publication",
        heading: "After publication",
        body: [
          "Checking doesn’t stop at publication. If a reader or a subject points out a possible error, we look into it promptly. Confirmed errors are handled under our Corrections standard.",
        ],
      },
    ],
  },

  transparency: {
    summary:
      "What we tell readers about who we are, how we work and what we do with your information.",
    updated: "2026-11-05",
    sections: [
      {
        id: "who-we-are",
        heading: "Who we are",
        body: [
          "Readers deserve to know who is producing the news they read and how it is funded. We will keep this information easy to find and up to date, and we will disclose changes that could affect our independence.",
        ],
      },
      {
        id: "how-we-label",
        heading: "How we label our work",
        body: ["Every piece on NewsPulse carries clear signals about what it is."],
        bullets: [
          "A byline naming the author or authors.",
          "The date it was first published, and a note when it has been materially updated.",
          "A label whenever a piece is analysis, opinion or sponsored content.",
        ],
      },
      {
        id: "your-information",
        heading: "Your information",
        body: [
          "Some features need to remember things about you. We store the details you give us when you create an account, plus your bookmarks, followed topics, comments and notifications, to provide those features. Stories you save for offline reading are kept on your own device.",
          "We don’t sell your personal information. You can ask us to delete your account and the data attached to it.",
        ],
      },
      {
        id: "how-we-are-funded",
        heading: "How we are funded",
        body: [
          "We will be open with readers about the money that supports NewsPulse, and we will say so when a funder has an interest in a subject we report on.",
        ],
      },
    ],
  },

  "code-of-ethics": {
    summary:
      "The principles that guide everyone who reports, edits and publishes on NewsPulse.",
    updated: "2026-11-05",
    sections: [
      {
        id: "principles",
        heading: "Our principles",
        body: ["Four commitments sit underneath everything else we do."],
        bullets: [
          "Seek the truth and report it as fully as we can.",
          "Minimise harm: treat the people in our stories as human beings, not only as sources.",
          "Act independently, free of obligation to anyone except the public.",
          "Be accountable: explain our work, and admit and correct our mistakes.",
        ],
      },
      {
        id: "sources-and-subjects",
        heading: "Sources and the people we write about",
        body: [
          "We treat sources and subjects with respect. We take extra care with children and with people who are vulnerable, grieving or in crisis.",
        ],
        bullets: [
          "We identify ourselves as journalists. Deception is a last resort, needs senior editorial approval and is disclosed.",
          "We don’t plagiarise. Work from others is credited.",
          "We never invent quotes, scenes or sources, and we don’t use composite characters in reporting.",
        ],
      },
      {
        id: "images",
        heading: "Images and graphics",
        body: [
          "We don’t stage or manipulate photographs to mislead. Routine adjustments such as cropping and tone correction are acceptable. Illustrations and composites are labelled.",
        ],
      },
      {
        id: "community",
        heading: "Our community",
        body: [
          "Discussion is part of NewsPulse. We may remove comments that are abusive, unlawful, spam or deliberately misleading, and we may restrict accounts that repeatedly break these rules.",
        ],
      },
    ],
  },

  corrections: {
    summary:
      "How we fix mistakes, how we tell readers, and how to report an error.",
    updated: "2026-11-05",
    sections: [
      {
        id: "our-approach",
        heading: "Our approach",
        body: [
          "We make mistakes. When we do, we correct them quickly and visibly, so that readers can trust what they see now and understand what changed.",
        ],
      },
      {
        id: "how-we-correct",
        heading: "How we correct",
        body: ["How a correction appears depends on how serious the error was."],
        bullets: [
          "Typos and style slips are fixed without a note.",
          "Factual errors are fixed, with a note at the end of the story saying what changed and when.",
          "Significant errors get a prominent note at the top of the story.",
          "In rare cases a story is withdrawn. We publish an explanation in its place.",
        ],
      },
      {
        id: "report-an-error",
        heading: "Report an error",
        body: [
          "If you think we have got something wrong, email the editors. Please include a link to the story, what you believe is wrong and, if you can, a source that shows it. We review every report.",
        ],
      },
      {
        id: "corrections-log",
        heading: "Corrections log",
        body: [
          "Significant corrections are recorded on this page. No significant corrections have been logged yet.",
        ],
      },
    ],
  },
};

export type Standard = StandardContent & {
  slug: StandardSlug;
  label: string;
};

function hasSlug(
  item: (typeof siteConfig.standardsAndIntegrity)[number],
): item is StandardConfig {
  return "slug" in item;
}

function toStandard(config: StandardConfig): Standard {
  return {
    slug: config.slug,
    label: config.label,
    ...standardContent[config.slug],
  };
}

export function listStandards(): Standard[] {
  return siteConfig.standardsAndIntegrity.filter(hasSlug).map(toStandard);
}

export function getStandard(slug: string): Standard | null {
  const config = siteConfig.standardsAndIntegrity
    .filter(hasSlug)
    .find((item) => item.slug === slug);
  return config ? toStandard(config) : null;
}
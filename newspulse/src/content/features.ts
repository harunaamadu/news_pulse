import { siteConfig } from "@/config/site";

type FeatureConfig = (typeof siteConfig.featuresAndExpeditions)[number];
export type FeatureSlug = FeatureConfig["slug"];

export type FeatureContent = {
  kicker: string;
  intro: string;
  /** Live story features show stories from this section */
  categorySlug?: string;
  /** Renders the static credits page */
  credits?: boolean;
};

// Record<FeatureSlug, …> makes TypeScript fail the build if a footer link
// has no content here
const featureContent: Record<FeatureSlug, FeatureContent> = {
  "travel-landscapes": {
    kicker: "Feature",
    intro:
      "Long-form dispatches from places worth the journey: coastlines, cities, borderlands and the people who call them home.",
    categorySlug: "world",
  },
  "culture-monographs": {
    kicker: "Feature",
    intro:
      "In-depth portraits of artists, movements and ideas, written to be read slowly and remembered.",
    categorySlug: "culture",
  },
  discoveries: {
    kicker: "Feature",
    intro:
      "Research, expeditions and curious findings that are changing what we know about the world.",
    categorySlug: "science",
  },
  "attributes-credits": {
    kicker: "About",
    intro:
      "The photographs, typefaces and open-source tools behind NewsPulse, and the people who made them.",
    credits: true,
  },
  "documentary-photo-galleries": {
    kicker: "Coming soon",
    intro:
      "Photo essays and visual reporting from the field, presented large and with the context they deserve.",
  },
  "audio-dispatches": {
    kicker: "Coming soon",
    intro:
      "Reported audio stories and field recordings you can listen to anywhere, even offline.",
  },
};

export type Feature = FeatureContent & {
  slug: FeatureSlug;
  label: string;
  soon: boolean;
};

function toFeature(config: FeatureConfig): Feature {
  return {
    slug: config.slug,
    label: config.label,
    soon: "disabled" in config && config.disabled === true,
    ...featureContent[config.slug],
  };
}

export function getFeature(slug: string): Feature | null {
  const config = siteConfig.featuresAndExpeditions.find(
    (feature) => feature.slug === slug,
  );
  return config ? toFeature(config) : null;
}

export function listFeatures(): Feature[] {
  return siteConfig.featuresAndExpeditions.map(toFeature);
}
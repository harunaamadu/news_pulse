import { createOgImage } from "@/lib/og-image";

export const alt = "NewsPulse: personalized editorial news";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage({ title: "Personalized editorial news" });
}
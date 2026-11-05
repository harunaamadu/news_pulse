import { z } from "zod";

import { siteConfig } from "@/config/site";

export type CityWeather = { name: string; temperature: number };

const REVALIDATE_SECONDS = 900; // 15 minutes

const itemSchema = z.object({
  current: z.object({ temperature_2m: z.number() }),
});

// Open-Meteo returns an array for several locations and an object for one
const responseSchema = z.union([z.array(itemSchema), itemSchema]);

// Never throws: the top bar just hides the weather if anything goes wrong
export async function getCityWeather(): Promise<CityWeather[]> {
  const cities = siteConfig.weatherCities;

  const params = new URLSearchParams({
    latitude: cities.map((city) => city.latitude).join(","),
    longitude: cities.map((city) => city.longitude).join(","),
    current: "temperature_2m",
    timezone: "auto",
  });

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      {
        next: { revalidate: REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!response.ok) return [];

    const parsed = responseSchema.safeParse(await response.json());
    if (!parsed.success) return [];

    const items = Array.isArray(parsed.data) ? parsed.data : [parsed.data];
    if (items.length !== cities.length) return [];

    return cities.map((city, index) => ({
      name: city.name,
      temperature: Math.round(items[index].current.temperature_2m),
    }));
  } catch {
    return [];
  }
}
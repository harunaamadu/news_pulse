// Fixed timezone so server-rendered dates are deterministic
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}

const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const relativeUnits: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

export function formatRelativeTime(date: Date | string): string {
  const diffSeconds = Math.round(
    (new Date(date).getTime() - Date.now()) / 1000,
  );

  for (const [unit, seconds] of relativeUnits) {
    if (Math.abs(diffSeconds) >= seconds) {
      return relativeFormatter.format(Math.round(diffSeconds / seconds), unit);
    }
  }

  return "just now";
}
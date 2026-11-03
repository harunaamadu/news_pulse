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
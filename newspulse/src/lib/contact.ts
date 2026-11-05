export const CONTACT_TOPICS = [
  { value: "GENERAL", label: "General question" },
  { value: "CORRECTION", label: "Report an error" },
  { value: "TIP", label: "Story tip or pitch" },
  { value: "PRESS", label: "Press and partnerships" },
  { value: "SUPPORT", label: "Account or technical help" },
] as const;

export type ContactTopicValue = (typeof CONTACT_TOPICS)[number]["value"];

export const CONTACT_TOPIC_VALUES = CONTACT_TOPICS.map(
  (topic) => topic.value,
) as [ContactTopicValue, ...ContactTopicValue[]];

export function topicLabel(value: string): string {
  return CONTACT_TOPICS.find((topic) => topic.value === value)?.label ?? value;
}
import {
  Briefcase,
  Cpu,
  FlaskConical,
  Globe,
  Hash,
  Palette,
  Trophy,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  world: Globe,
  technology: Cpu,
  business: Briefcase,
  culture: Palette,
  science: FlaskConical,
  sports: Trophy,
};

export function CategoryIcon({ slug, ...props }: { slug: string } & LucideProps) {
  const Icon = icons[slug] ?? Hash;
  return <Icon aria-hidden="true" {...props} />;
}
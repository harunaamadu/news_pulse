import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: "DRAFT" | "PUBLISHED" }) {
  return status === "PUBLISHED" ? (
    <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
      Published
    </Badge>
  ) : (
    <Badge variant="secondary">Draft</Badge>
  );
}
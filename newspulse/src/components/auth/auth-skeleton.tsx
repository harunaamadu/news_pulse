import { Skeleton } from "@/components/ui/skeleton";

// Deterministic placeholder that mirrors the auth card layouy
export function AuthSkeleton() {
  return (
    <div className="w-full max-w-sm space-y-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
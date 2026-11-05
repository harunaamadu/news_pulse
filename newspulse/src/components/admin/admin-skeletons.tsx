import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export function KpiSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-48 rounded-2xl" />
      ))}
    </div>
  );
}

export function ChartsSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3" aria-busy="true">
      <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
      <Skeleton className="h-96 rounded-2xl" />
      <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}

export function ListsSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3" aria-busy="true">
      <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}

// Shown while the access check runs
export function AdminPageSkeleton() {
  return (
    <Container className="space-y-8 py-8 sm:py-10" aria-busy="true">
      <div className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-12 w-64 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-10 w-56" />
      <KpiSkeleton />
    </Container>
  );
}
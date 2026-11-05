import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudioLoading() {
  return (
    <Container className="space-y-8 py-8 sm:py-10" aria-busy="true">
      <div className="space-y-3 border-b-2 border-foreground pb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-12 w-72 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </Container>
  );
}
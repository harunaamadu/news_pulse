import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopicsLoading() {
  return (
    <Container className="space-y-8 py-8 sm:py-10" aria-busy="true">
      <div className="space-y-3 border-b-2 border-foreground pb-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-80 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-52 rounded-2xl" />
        ))}
      </div>
    </Container>
  );
}
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <Container className="space-y-8 py-8 sm:py-10" aria-busy="true">
      <div className="space-y-3 border-b-2 border-foreground pb-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-xl border">
            <Skeleton className="aspect-[3/2] rounded-b-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
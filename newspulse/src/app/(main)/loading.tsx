import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <Container className="space-y-14 py-8 sm:py-10" aria-busy="true">
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="min-h-[26rem] rounded-2xl sm:min-h-[32rem] lg:col-span-2" />

        <div className="space-y-5 rounded-2xl border p-6">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-4">
              <Skeleton className="size-8 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-xl border p-0">
              <Skeleton className="aspect-[3/2] rounded-b-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleLoading() {
  return (
    <div aria-busy="true">
      <Container className="max-w-3xl space-y-6 pt-8 sm:pt-12">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-4/5" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-14 w-full" />
      </Container>

      <Container className="mt-8 max-w-5xl">
        <Skeleton className="aspect-video rounded-2xl" />
      </Container>

      <Container className="max-w-3xl space-y-3 py-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-2/3" />
      </Container>
    </div>
  );
}
import { Skeleton } from "@/components/ui/skeleton";

export function VacancyDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-56 w-full rounded-3xl" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Skeleton className="h-96 rounded-3xl" />
        <Skeleton className="h-60 rounded-3xl" />
      </div>
    </div>
  );
}

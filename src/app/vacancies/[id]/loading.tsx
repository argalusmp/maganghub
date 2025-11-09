import { VacancyDetailSkeleton } from "@/components/vacancy/vacancy-detail-skeleton";

export default function VacancyLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <VacancyDetailSkeleton />
    </div>
  );
}

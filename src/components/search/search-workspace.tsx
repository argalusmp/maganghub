"use client";

import { useMemo } from "react";

import { FilterPanel } from "@/components/search/filter-panel";
import { SearchResults } from "@/components/search/results-area";
import { computeJenjangPreview } from "@/lib/format";
import { buildProgramOptionsFromVacancies } from "@/lib/programs";
import { useFilterParams } from "@/hooks/use-filter-params";
import { useKabupatenQuery, useProvincesQuery, useSearchData } from "@/hooks/use-search-data";

export function SearchWorkspace() {
  const { filters, updateFilters, resetFilters } = useFilterParams();
  const searchQuery = useSearchData(filters);
  const provincesQuery = useProvincesQuery();
  const kabupatenQuery = useKabupatenQuery(filters.kode_provinsi);

  const jenjangPreview = useMemo(() => computeJenjangPreview(searchQuery.data?.data ?? []), [searchQuery.data]);

  const programOptions = useMemo(
    () => buildProgramOptionsFromVacancies(searchQuery.data?.data ?? []),
    [searchQuery.data]
  );

  return (
    <section id="cari" className="mx-auto mt-10 w-full max-w-7xl px-4 pb-16 md:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <FilterPanel
          filters={filters}
          provinces={provincesQuery.data ?? []}
          kabupatenList={kabupatenQuery.data ?? []}
          onChange={(updates) => updateFilters(updates)}
          onReset={resetFilters}
          jenjangPreview={jenjangPreview}
          programOptions={programOptions}
          provincesLoading={provincesQuery.isLoading}
          kabupatenLoading={kabupatenQuery.isLoading}
        />
        <SearchResults
          filters={filters}
          data={searchQuery.data}
          isLoading={searchQuery.isPending}
          isFetching={searchQuery.isFetching}
          provinces={provincesQuery.data ?? []}
          onFilterChange={updateFilters}
          onResetFilters={resetFilters}
        />
      </div>
    </section>
  );
}

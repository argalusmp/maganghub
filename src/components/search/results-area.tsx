import type { Province, SearchResponse } from "@/lib/api-types";
import type { SearchFilters } from "@/lib/filters";
import { defaultFilters } from "@/lib/filters";
import { SORT_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import { ReactNode } from "react";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import { VacancyCard } from "@/components/search/vacancy-card";
import { Pagination } from "@/components/search/pagination";
import type { UpdateFilters } from "@/hooks/use-filter-params";
import { Badge } from "@/components/ui/badge";

interface SearchResultsProps {
  filters: SearchFilters;
  data?: SearchResponse;
  isLoading: boolean;
  isFetching: boolean;
  provinces: Province[];
  onFilterChange: UpdateFilters;
  onResetFilters: () => void;
}

export function SearchResults({
  filters,
  data,
  isLoading,
  isFetching,
  provinces,
  onFilterChange,
  onResetFilters,
}: SearchResultsProps) {
  const total = data?.meta.total ?? 0;
  const start = total === 0 ? 0 : (filters.page - 1) * filters.limit + 1;
  const end = total === 0 ? 0 : Math.min(total, start + (data?.data.length ?? 0) - 1);
  const totalPages = total > 0 ? Math.ceil(total / filters.limit) : 1;

  const activeChips = buildActiveChips(filters, provinces, onFilterChange);

  return (
    <div className="space-y-4" aria-live="polite">
      <div className="sticky top-20 z-10 rounded-3xl border border-white/10 bg-zinc-900/80 px-5 py-4 shadow backdrop-blur">
        <p className="text-sm font-medium text-zinc-200">
          {isLoading ? "Memuat hasil..." : `Menampilkan ${start}-${end} dari ${total} lowongan`}
        </p>
        <p className="text-xs text-zinc-400">Pengaturan filter melekat pada URL sehingga mudah dibagikan.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {activeChips.length ? (
            activeChips
          ) : (
            <Badge variant="outline">Belum ada filter aktif</Badge>
          )}
        </div>
      </div>

      {isLoading ? <SkeletonList /> : null}

      {!isLoading && data?.data.length ? (
        <div className="relative">
          {isFetching ? (
            <div className="pointer-events-none absolute inset-0 z-10 rounded-3xl border border-dashed border-zinc-200 bg-white/70 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
              <SkeletonList compact />
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((vacancy) => (
              <VacancyCard key={vacancy.id_posisi} vacancy={vacancy} />
            ))}
          </div>
        </div>
      ) : null}

      {!isLoading && !data?.data.length ? <EmptyState onReset={onResetFilters} /> : null}

      <Pagination
        page={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => onFilterChange({ page }, { preservePage: true })}
      />
    </div>
  );
}

function buildActiveChips(filters: SearchFilters, provinces: Province[], onFilterChange: UpdateFilters) {
  const chips: ReactNode[] = [];
  if (filters.q) {
    chips.push(
      <Chip key="q" removable onClick={() => onFilterChange({ q: "" })}>
        Kata kunci: {filters.q}
      </Chip>
    );
  }
  if (filters.kode_provinsi) {
    const province = provinces.find((item) => item.kode_provinsi === filters.kode_provinsi);
    chips.push(
      <Chip key="prov" removable onClick={() => onFilterChange({ kode_provinsi: "", kabupaten: "" })}>
        Provinsi: {province?.nama_provinsi || filters.kode_provinsi}
      </Chip>
    );
  }
  if (filters.kabupaten) {
    chips.push(
      <Chip key="kab" removable onClick={() => onFilterChange({ kabupaten: "" })}>
        Kabupaten: {filters.kabupaten}
      </Chip>
    );
  }
  filters.jenjang.forEach((value) =>
    chips.push(
      <Chip key={`jenjang-${value}`} removable onClick={() => onFilterChange({ jenjang: filters.jenjang.filter((item) => item !== value) })}>
        Jenjang: {value}
      </Chip>
    )
  );
  filters.prodi.forEach((value) =>
    chips.push(
      <Chip key={`prodi-${value}`} removable onClick={() => onFilterChange({ prodi: filters.prodi.filter((item) => item !== value) })}>
        Prodi: {value}
      </Chip>
    )
  );
  if (filters.status !== defaultFilters.status) {
    const statusLabel = STATUS_OPTIONS.find((option) => option.value === filters.status)?.label ?? filters.status;
    chips.push(
      <Chip key="status" removable onClick={() => onFilterChange({ status: defaultFilters.status })}>
        Status: {statusLabel}
      </Chip>
    );
  }
  if (filters.onlyNew) {
    chips.push(
      <Chip key="onlyNew" removable onClick={() => onFilterChange({ onlyNew: false })}>
        Hanya baru
      </Chip>
    );
  }
  if (filters.sort !== defaultFilters.sort) {
    const sortLabel = SORT_OPTIONS.find((option) => option.value === filters.sort)?.label ?? filters.sort;
    chips.push(
      <Chip key="sort" removable onClick={() => onFilterChange({ sort: defaultFilters.sort })}>
        Urutkan: {sortLabel}
      </Chip>
    );
  }

  return chips;
}

function SkeletonList({ compact }: { compact?: boolean }) {
  const items = compact ? 3 : 6;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: items }).map((_, index) => (
        <Skeleton key={index} className="h-48 w-full rounded-2xl" />
      ))}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-200 bg-white/60 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900/70">
      <p className="text-lg font-semibold text-zinc-900 dark:text-white">Tidak ada hasil yang cocok</p>
      <p className="mt-2 text-sm text-zinc-500">
        Coba longgarkan filter, hilangkan kata kunci yang terlalu spesifik, atau pilih provinsi/kabupaten lain.
      </p>
      <button type="button" className="mt-4 text-sm font-medium text-emerald-600" onClick={onReset}>
        Reset semua filter
      </button>
    </div>
  );
}

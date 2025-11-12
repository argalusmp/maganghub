import { DEFAULT_LIMIT, JENJANG_OPTIONS, SORT_OPTIONS } from "@/lib/constants";
import { canonicalizeProgramLabel } from "@/lib/programs";

export type VacancyStatus = "all" | "open" | "closed";
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface SearchFilters {
  q: string;
  kode_provinsi: string;
  kabupaten: string;
  jenjang: string[];
  prodi: string[];
  status: VacancyStatus;
  onlyNew: boolean;
  sort: SortValue;
  page: number;
  limit: number;
}

export const defaultFilters: SearchFilters = {
  q: "",
  kode_provinsi: "",
  kabupaten: "",
  jenjang: [],
  prodi: [],
  status: "all",
  onlyNew: false,
  sort: "terbaru",
  page: 1,
  limit: DEFAULT_LIMIT,
};

const csvToArray = (value?: string | null) =>
  value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];

const parseBoolean = (value?: string | null) => value === "true" || value === "1";

export function parseSearchFilters(searchParams: URLSearchParams | Record<string, string | undefined>): SearchFilters {
  const params =
    searchParams instanceof URLSearchParams
      ? Object.fromEntries(searchParams.entries())
      : searchParams;

  const statusCandidate = params.status as VacancyStatus | undefined;
  const sortCandidate = params.sort as SortValue | undefined;

  return {
    ...defaultFilters,
    q: params.q?.toString() ?? defaultFilters.q,
    kode_provinsi: params.kode_provinsi ?? "",
    kabupaten: params.kabupaten ?? "",
    jenjang: csvToArray(params.jenjang),
    prodi: csvToArray(params.prodi),
    status: statusCandidate && ["all", "open", "closed"].includes(statusCandidate) ? statusCandidate : defaultFilters.status,
    onlyNew: parseBoolean(params.only_new),
    sort: sortCandidate && SORT_OPTIONS.some((option) => option.value === sortCandidate)
      ? sortCandidate
      : defaultFilters.sort,
    page: params.page ? Math.max(1, Number(params.page)) : defaultFilters.page,
    limit: params.limit ? Math.min(100, Number(params.limit)) : defaultFilters.limit,
  };
}

export function filtersToQueryString(filters: SearchFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.kode_provinsi) params.set("kode_provinsi", filters.kode_provinsi);
  if (filters.kabupaten) params.set("kabupaten", filters.kabupaten);
  if (filters.jenjang.length) params.set("jenjang", filters.jenjang.join(","));
  if (filters.prodi.length) params.set("prodi", filters.prodi.join(","));
  if (filters.status !== defaultFilters.status) params.set("status", filters.status);
  if (filters.onlyNew) params.set("only_new", String(filters.onlyNew));
  if (filters.sort !== defaultFilters.sort) params.set("sort", filters.sort);
  if (filters.page !== defaultFilters.page) params.set("page", String(filters.page));
  if (filters.limit !== defaultFilters.limit) params.set("limit", String(filters.limit));
  return params.toString();
}

export function filtersToApiParams(filters: SearchFilters) {
  const params = new URLSearchParams(filtersToQueryString(filters));
  return Object.fromEntries(params.entries());
}

export const isJenjangValue = (value: string) =>
  JENJANG_OPTIONS.some((option) => option.value === value);

export function sanitizeJenjang(values: string[]) {
  return values.filter(isJenjangValue);
}

export function normalizeFilters(filters: SearchFilters): SearchFilters {
  const normalizedProdi = filters.prodi.map(canonicalizeProgramLabel).filter(Boolean);

  return {
    ...filters,
    jenjang: sanitizeJenjang(filters.jenjang),
    prodi: Array.from(new Set(normalizedProdi)),
    page: Math.max(1, filters.page),
    limit: Math.min(100, Math.max(1, filters.limit)),
  };
}

export function hasActiveFilters(filters: SearchFilters) {
  return (
    !!filters.q ||
    !!filters.kode_provinsi ||
    !!filters.kabupaten ||
    filters.jenjang.length > 0 ||
    filters.prodi.length > 0 ||
    filters.status !== defaultFilters.status ||
    filters.onlyNew ||
    filters.sort !== defaultFilters.sort
  );
}

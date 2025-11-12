import {
  kabupatenSchema,
  provinceSchema,
  searchResponseSchema,
  vacancySchema,
  type Vacancy,
  type SearchResponse,
} from "@/lib/api-types";
import { getApiBaseUrl } from "@/lib/env";
import { filtersToApiParams, normalizeFilters, type SearchFilters } from "@/lib/filters";

const API_BASE_URL = getApiBaseUrl();

type FetchOptions = RequestInit & {
  cacheSeconds?: number;
};

async function apiFetch<T>(path: string, { cacheSeconds, ...init }: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const requestInit = {
    ...init,
  };

  const isServer = typeof window === "undefined";

  if (isServer) {
    if (cacheSeconds) {
      (requestInit as any).next = { revalidate: cacheSeconds };
    } else {
      requestInit.cache = "no-store";
    }
  }

  const response = await fetch(url, requestInit);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchSearch(filters: SearchFilters) {
  const normalized = normalizeFilters(filters);
  const primaryResult = await requestSearch(normalized);

  if (!normalized.q || primaryResult.meta.total > 0) {
    return primaryResult;
  }

  const fallbackResult = await fetchFallbackResults(normalized);
  return fallbackResult ?? primaryResult;
}

export async function fetchVacancyById(id: string) {
  const data = await apiFetch(`/vacancies/${id}`);
  return vacancySchema.parse(data);
}

export async function fetchProvinces() {
  const data = await apiFetch(`/facets/provinces`, { cacheSeconds: 60 * 60 * 12 });
  return provinceSchema.array().parse(data);
}

export async function fetchKabupaten(kode_provinsi: string) {
  if (!kode_provinsi) return [];
  const data = await apiFetch(`/facets/kabupaten?kode_provinsi=${kode_provinsi}`, {
    cacheSeconds: 60 * 60,
  });
  return kabupatenSchema.array().parse(data);
}

export async function fetchHeroMetrics() {
  const [all, fresh] = await Promise.all([
    apiFetch(`/search?limit=1&sort=terbaru`),
    apiFetch(`/search?limit=1&only_new=true`),
  ]);

  const total = searchResponseSchema.parse(all).meta.total;
  const newCount = searchResponseSchema.parse(fresh).meta.total;

  return { total, newCount };
}

async function requestSearch(filters: SearchFilters) {
  const query = new URLSearchParams(filtersToApiParams(filters)).toString();
  const data = await apiFetch(`/search?${query}`);
  return searchResponseSchema.parse(data);
}

async function fetchFallbackResults(originalFilters: SearchFilters) {
  const fallbackKeyword = buildLooserKeyword(originalFilters.q);

  const fallbackFilters = normalizeFilters({
    ...originalFilters,
    q: fallbackKeyword,
    page: 1,
    limit: Math.min(100, Math.max(originalFilters.limit, 40)),
  });

  const fallbackResponse = await requestSearch(fallbackFilters);
  const filtered = fallbackResponse.data.filter((vacancy) =>
    vacancyMatchesKeyword(vacancy, originalFilters.q)
  );

  if (filtered.length === 0) {
    return null;
  }

  const fallbackPayload: SearchResponse = {
    meta: {
      page: 1,
      limit: originalFilters.limit,
      total: filtered.length,
    },
    data: filtered.slice(0, originalFilters.limit),
  };

  return fallbackPayload;
}

function buildLooserKeyword(keyword: string) {
  const tokens = keyword
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length <= 1) {
    return "";
  }

  return tokens.slice(0, -1).join(" ");
}

function vacancyMatchesKeyword(vacancy: Vacancy, keyword: string) {
  const normalizedNeedle = normalizeSearchValue(keyword);
  if (!normalizedNeedle) return false;

  const haystacks = [
    vacancy.posisi,
    vacancy.deskripsi_posisi ?? "",
    vacancy.nama_perusahaan ?? "",
    vacancy.nama_kabupaten ?? "",
    vacancy.nama_provinsi ?? "",
    vacancy.program_studi.join(" "),
    vacancy.jenjang.join(" "),
  ];

  return haystacks.some((value) => normalizeSearchValue(value).includes(normalizedNeedle));
}

function normalizeSearchValue(value?: string | null) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

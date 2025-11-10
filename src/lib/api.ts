import { kabupatenSchema, provinceSchema, searchResponseSchema, vacancySchema } from "@/lib/api-types";
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
  const query = new URLSearchParams(filtersToApiParams(normalized)).toString();
  const data = await apiFetch(`/search?${query}`);
  return searchResponseSchema.parse(data);
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

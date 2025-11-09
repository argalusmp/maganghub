"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchKabupaten, fetchProvinces, fetchSearch } from "@/lib/api";
import type { SearchFilters } from "@/lib/filters";

export function useSearchData(filters: SearchFilters) {
  return useQuery({
    queryKey: ["search", filters],
    queryFn: () => fetchSearch(filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useProvincesQuery() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: () => fetchProvinces(),
    staleTime: 1000 * 60 * 60 * 12,
  });
}

export function useKabupatenQuery(kode_provinsi: string) {
  return useQuery({
    queryKey: ["kabupaten", kode_provinsi],
    queryFn: () => fetchKabupaten(kode_provinsi),
    enabled: Boolean(kode_provinsi),
    staleTime: 1000 * 60 * 60,
  });
}

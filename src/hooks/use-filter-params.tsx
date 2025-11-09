"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { defaultFilters, filtersToQueryString, parseSearchFilters, type SearchFilters } from "@/lib/filters";

interface UpdateOptions {
  preservePage?: boolean;
}

export function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    if (!searchParams) return defaultFilters;
    return parseSearchFilters(searchParams);
  }, [searchParams]);

  const updateFilters = useCallback(
    (updates: Partial<SearchFilters>, options?: UpdateOptions) => {
      // Parse filters fresh dari searchParams untuk menghindari stale closure
      const currentFilters = searchParams ? parseSearchFilters(searchParams) : defaultFilters;
      const nextFilters = { ...currentFilters, ...updates };
      if (!options?.preservePage) {
        nextFilters.page = 1;
      }

      const query = filtersToQueryString(nextFilters);
      const url = query ? `${pathname}?${query}` : pathname;
      router.push(url, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return { filters, updateFilters, resetFilters };
}

export type UpdateFilters = (updates: Partial<SearchFilters>, options?: UpdateOptions) => void;

"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useFilterParams } from "@/hooks/use-filter-params";
import { defaultFilters, filtersToQueryString } from "@/lib/filters";

export function SiteHeader() {
  const { filters, updateFilters } = useFilterParams();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [value, setValue] = useState(filters.q);
  // DISABLE debounced search untuk avoid conflict dengan filter panel
  // const debounced = useDebouncedValue(value, 350);

  useEffect(() => {
    if (!isHome) return;
    setValue(filters.q);
  }, [filters.q, isHome]);

  // DISABLE debounced search untuk avoid conflict dengan filter panel
  // useEffect(() => {
  //   if (!isHome) return;
  //   if (debounced === filters.q) return;
  //   updateFilters({ q: debounced });
  // }, [debounced, filters.q, isHome, updateFilters]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isHome) return;
    const query = filtersToQueryString({ ...defaultFilters, q: value.trim() });
    router.push(query ? `/?${query}` : "/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center gap-4 px-4 md:px-6 lg:px-8">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          MagangHub
        </Link>
        <form
          className="hidden flex-1 items-center gap-3 rounded-2xl border border-white/15 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-300 shadow-sm md:flex"
          onSubmit={handleSubmit}
        >
          <Search className="h-4 w-4 text-zinc-500" aria-hidden />
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="h-auto border-none bg-transparent px-0 text-sm text-white shadow-none focus-visible:ring-0"
            placeholder="Cari posisi, perusahaan, atau kata kunci"
            aria-label="Cari cepat"
          />
          {value ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setValue("");
                if (isHome) {
                  updateFilters({ q: "" });
                }
              }}
            >
              Bersihkan
            </Button>
          ) : null}
        </form>
        <div className="ml-auto">
          <Button asChild size="sm" variant="subtle" className="md:hidden">
            <Link href="/?focus=search">Cari</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

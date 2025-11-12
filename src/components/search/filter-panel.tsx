"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { FilterIcon, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { JENJANG_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import type { Kabupaten, Province } from "@/lib/api-types";
import type { SearchFilters } from "@/lib/filters";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface FilterPanelProps {
  filters: SearchFilters;
  provinces: Province[];
  kabupatenList: Kabupaten[];
  onChange: (updates: Partial<SearchFilters>) => void;
  onReset: () => void;
  jenjangPreview: Record<string, number>;
  programOptions: string[];
  provincesLoading?: boolean;
  kabupatenLoading?: boolean;
  onSubmit?: () => void;
}

export function FilterPanel(props: FilterPanelProps) {
  const { filters } = props;
  
  return (
    <div className="lg:sticky lg:top-28">
      <div className="hidden lg:block">
        <FiltersContent {...props} />
      </div>
      <MobileDrawer {...props} />
    </div>
  );
}

interface FiltersContentProps extends FilterPanelProps {}

function FiltersContent({
  filters,
  provinces,
  kabupatenList,
  onChange,
  onReset,
  jenjangPreview,
  programOptions,
  provincesLoading,
  kabupatenLoading,
  onSubmit,
}: FiltersContentProps) {
  // Local state HANYA untuk input yang sedang diketik
  const [searchInput, setSearchInput] = useState(filters.q);
  const [programSearch, setProgramSearch] = useState("");
  const debouncedKeyword = useDebouncedValue(searchInput, 400);
  const normalizedKeyword = debouncedKeyword.trim();
  
  const keywordId = useId();
  const provinceId = useId();
  const kabupatenId = useId();
  const programSearchId = useId();
  const onlyNewId = useId();
  
  // Sync input dengan URL HANYA saat URL berubah dari luar DAN berbeda dengan input
  useEffect(() => {
    if (filters.q !== searchInput) {
      setSearchInput(filters.q);
    }
  }, [filters.q]); // Sengaja tidak include searchInput untuk avoid loop

  useEffect(() => {
    if (normalizedKeyword === filters.q) return;
    onChange({ q: normalizedKeyword });
  }, [normalizedKeyword, filters.q, onChange]);
  
  const filteredPrograms = useMemo(() => {
    if (!programSearch) return programOptions;
    return programOptions.filter((option) => option.toLowerCase().includes(programSearch.toLowerCase()));
  }, [programOptions, programSearch]);

  const handleKeywordSubmit = () => {
    if (searchInput.trim() !== filters.q) {
      onChange({ q: searchInput.trim() });
    }
    onSubmit?.();
  };

  return (
    <aside className="space-y-5 rounded-3xl border border-white/10 bg-zinc-900/70 p-6 shadow-lg ring-1 ring-emerald-500/5 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-white">Filter</p>
          <p className="text-xs text-zinc-500">Persempit hasil agar lebih relevan</p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      <section className="space-y-3">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200" htmlFor={keywordId}>
          Kata kunci
        </label>
        <div className="space-y-2">
          <Input
            id={keywordId}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleKeywordSubmit();
              }
            }}
            placeholder="Contoh: data analyst"
            autoComplete="off"
          />
          <p className="text-xs text-zinc-500">
            Pencarian diperbarui otomatis setelah kamu berhenti mengetik
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full lg:hidden"
            onClick={handleKeywordSubmit}
          >
            Cari
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200" htmlFor={provinceId}>
          Provinsi
        </label>
        {provinces.length === 0 && provincesLoading ? (
          <Skeleton className="h-11 w-full" />
        ) : (
          <Select
            id={provinceId}
            value={filters.kode_provinsi}
            onChange={(event) =>
              onChange({ kode_provinsi: event.target.value, kabupaten: "" })
            }
          >
            <option value="">Semua provinsi</option>
            {provinces.map((province) => (
              <option key={province.kode_provinsi} value={province.kode_provinsi}>
                {province.nama_provinsi}
              </option>
            ))}
          </Select>
        )}
      </section>

      {filters.kode_provinsi ? (
        <section className="space-y-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200" htmlFor={kabupatenId}>
            Kabupaten/Kota
          </label>
          {kabupatenLoading && kabupatenList.length === 0 ? (
            <Skeleton className="h-11 w-full" />
          ) : (
            <Select
              id={kabupatenId}
              value={filters.kabupaten}
              onChange={(event) => onChange({ kabupaten: event.target.value })}
            >
              <option value="">Semua kabupaten</option>
              {kabupatenList.map((item) => (
                <option key={item.nama_kabupaten} value={item.nama_kabupaten ?? ""}>
                  {item.nama_kabupaten}
                </option>
              ))}
            </Select>
          )}
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-200">Jenjang</span>
          <span className="text-xs text-zinc-500">Preview realtime</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {JENJANG_OPTIONS.map((option) => {
            const active = filters.jenjang.includes(option.value);
            const preview = jenjangPreview[option.value];
            return (
              <Chip
                key={option.value}
                active={active}
                onClick={() =>
                  onChange({
                    jenjang: active
                      ? filters.jenjang.filter((value) => value !== option.value)
                      : [...filters.jenjang, option.value],
                  })
                }
              >
                {option.label}
                {typeof preview !== "undefined" ? ` (${preview})` : ""}
              </Chip>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-200">Program studi</span>
          {filters.prodi.length ? (
            <button
              type="button"
              className="text-xs text-emerald-600"
              onClick={() => onChange({ prodi: [] })}
            >
              Hapus semua
            </button>
          ) : null}
        </div>
        <Input
          id={programSearchId}
          placeholder="Cari program"
          value={programSearch}
          onChange={(event) => setProgramSearch(event.target.value)}
        />
        <div className="max-h-48 space-y-2 overflow-y-auto rounded-2xl border border-zinc-100 p-3 dark:border-zinc-800">
          {filteredPrograms.length === 0 ? (
            <p className="text-xs text-zinc-500">Belum ada data program dari hasil saat ini.</p>
          ) : (
            filteredPrograms.map((option) => {
              const checked = filters.prodi.includes(option);
              return (
                <label key={option} className="flex items-center gap-2 text-xs text-zinc-600">
                  <Checkbox
                    checked={checked}
                    onChange={(event) => {
                      const isChecked = event.target.checked;
                      onChange({
                        prodi: isChecked
                          ? [...filters.prodi, option]
                          : filters.prodi.filter((value) => value !== option),
                      });
                    }}
                  />
                  {option}
                </label>
              );
            })
          )}
        </div>
        {filters.prodi.length ? (
          <div className="flex flex-wrap gap-2">
            {filters.prodi.map((item) => (
              <Chip
                key={item}
                removable
                onClick={() =>
                  onChange({ prodi: filters.prodi.filter((value) => value !== item) })
                }
              >
                {item}
              </Chip>
            ))}
          </div>
        ) : null}
      </section>

      <section className="space-y-3">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Status</label>
        <div className="grid grid-cols-3 gap-2">
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={filters.status === option.value ? "default" : "outline"}
              size="sm"
              className="rounded-2xl"
              onClick={() => onChange({ status: option.value as SearchFilters["status"] })}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300" htmlFor={onlyNewId}>
          <Checkbox
            id={onlyNewId}
            checked={filters.onlyNew}
            onChange={(event) => onChange({ onlyNew: event.target.checked })}
          />
          Hanya tampilkan lowongan baru 72 jam terakhir
        </label>
      </section>

      <section className="space-y-3">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Urutkan</label>
        <Select value={filters.sort} onChange={(event) => onChange({ sort: event.target.value as SearchFilters["sort"] })}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </section>

      <p className="flex items-center gap-2 rounded-2xl bg-zinc-100/80 p-3 text-xs text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300">
        <MapPin className="h-4 w-4" />
        Filter lokasi memprioritaskan lowongan dengan alamat detail di sumber resmi.
      </p>
    </aside>
  );
}

function MobileDrawer(props: FiltersContentProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        variant="outline"
        className="mb-4 w-full rounded-3xl"
        onClick={() => setOpen(true)}
      >
        <FilterIcon className="mr-2 h-4 w-4" /> Filter pencarian
      </Button>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          aria-modal="true"
          role="dialog"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute inset-x-0 bottom-0 max-h-[90vh] rounded-t-3xl bg-zinc-950 p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between text-white">
              <p className="font-semibold">Filter</p>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Tutup
              </Button>
            </div>
            <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2">
              <FiltersContent {...props} onSubmit={() => setOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

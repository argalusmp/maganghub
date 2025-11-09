"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { Vacancy } from "@/lib/api-types";
import { fetchVacancyById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { VacancyDetail } from "@/components/vacancy/vacancy-detail";
import { VacancyDetailSkeleton } from "@/components/vacancy/vacancy-detail-skeleton";

type Status = "idle" | "loading" | "success" | "error";

export function VacancyDetailScreen({ id }: { id: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [error, setError] = useState<unknown>(null);

  const loadData = () => {
    if (!id) return;
    setStatus("loading");
    setError(null);
    fetchVacancyById(id)
      .then((data) => {
        setVacancy(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (status === "loading" || status === "idle") {
    return <VacancyDetailSkeleton />;
  }

  if (status === "error" || !vacancy) {
    return (
      <div className="space-y-4 rounded-3xl border border-dashed border-white/10 bg-zinc-900/70 p-10 text-center text-sm text-zinc-300">
        <p className="text-lg font-semibold text-white">Detail lowongan tidak dapat dimuat.</p>
        <p>
          Pastikan API MagangHub berjalan di{" "}
          <code className="rounded bg-black/40 px-1.5 py-0.5 text-xs">
            {process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3333"}
          </code>
          .
        </p>
        {error ? (
          <p className="text-xs text-rose-300">
            Detail error: {error instanceof Error ? error.message : String(error)}
          </p>
        ) : null}
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={loadData}>Coba lagi</Button>
          <Button asChild variant="outline">
            <Link href="/">Kembali ke daftar</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <VacancyDetail vacancy={vacancy} />;
}

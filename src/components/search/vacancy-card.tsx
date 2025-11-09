import Link from "next/link";
import { ArrowUpRight, Calendar, Clock, MapPin } from "lucide-react";

import type { Vacancy } from "@/lib/api-types";
import { formatDateRange, formatRelativeTime, isRegistrationOpen, safeParseDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

interface VacancyCardProps {
  vacancy: Vacancy;
}

const now = () => new Date().getTime();

function isNew(firstSeen?: string | null) {
  const parsed = safeParseDate(firstSeen);
  if (!parsed) return false;
  const hours = (now() - parsed.getTime()) / (1000 * 60 * 60);
  return hours <= 72;
}

export function VacancyCard({ vacancy }: VacancyCardProps) {
  const quota = vacancy.jumlah_kuota ?? 0;
  const registered = vacancy.jumlah_terdaftar ?? 0;
  const percent = registered > 0 ? Math.round((quota / registered) * 100) : null;
  const open = vacancy.is_active && isRegistrationOpen(vacancy.pendaftaran_awal, vacancy.pendaftaran_akhir);
  const relativeUpdated = formatRelativeTime(vacancy.updated_at);
  const vacancyId = vacancy.id_posisi || vacancy.id;

  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/40">
      <header className="flex items-start gap-3">
        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
            {vacancy.agency || vacancy.sub_agency || vacancy.nama_perusahaan || "Instansi"}
          </p>
          <h3 className="text-base font-semibold text-white line-clamp-2">{vacancy.posisi}</h3>
          <p className="flex items-center gap-1 text-xs text-zinc-400">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {vacancy.nama_kabupaten || "Lokasi fleksibel"}, {vacancy.nama_provinsi || "Indonesia"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <Badge variant={open ? "success" : "outline"}>{open ? "Masih buka" : "Tutup"}</Badge>
          {isNew(vacancy.first_seen_at) ? <Badge variant="warning">Baru</Badge> : null}
        </div>
      </header>

      <p className="line-clamp-2 text-xs text-zinc-400">
        {vacancy.deskripsi_posisi || "Deskripsi belum tersedia dari sumber."}
      </p>

      <div className="flex flex-wrap gap-1 text-[11px]">
        {vacancy.jenjang.slice(0, 2).map((value) => (
          <Badge key={value} variant="outline">
            {value}
          </Badge>
        ))}
        {vacancy.program_studi.slice(0, 1).map((value) => (
          <Badge key={value} variant="outline">
            {value}
          </Badge>
        ))}
        {vacancy.program_studi.length > 1 ? (
          <Badge variant="outline">+{vacancy.program_studi.length - 1} prodi</Badge>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-3 rounded-xl bg-black/20 px-3 py-2 text-center text-[11px] text-zinc-400">
        <div>
          <p>Kuota</p>
          <p className="text-sm font-semibold text-white">{quota || "-"}</p>
        </div>
        <div>
          <p>Pendaftar</p>
          <p className="text-sm font-semibold text-white">{registered}</p>
        </div>
        <div>
          <p>Persentase</p>
          <p className="text-sm font-semibold text-white">
            {percent !== null ? `${percent}%` : "—"}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-black/10 px-3 py-2 text-xs text-zinc-400">
        <p className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          {formatDateRange(vacancy.pendaftaran_awal, vacancy.pendaftaran_akhir)}
        </p>
      </div>

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {relativeUpdated ? `Disinkron ${relativeUpdated}` : "Sinkron terbaru belum tersedia"}
        </span>
        {vacancyId ? (
          <Link href={`/vacancies/${vacancyId}`} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300">
            Lihat detail
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <a
            href={vacancy.url_original || "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300"
          >
            Buka sumber
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </footer>
    </article>
  );
}

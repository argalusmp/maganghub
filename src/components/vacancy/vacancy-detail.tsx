"use client";

import { ReactNode, useMemo, useState } from "react";
import { Building2, Calendar, ExternalLink, FileText, Link, MapPin, Users } from "lucide-react";

import type { Vacancy } from "@/lib/api-types";
import { formatDateRange, formatIndoDate, formatRelativeTime, isRegistrationOpen } from "@/lib/format";
import { cn, compact } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VacancyDetailProps {
  vacancy: Vacancy;
}

const tabs = [
  { id: "summary", label: "Ringkasan" },
  { id: "requirements", label: "Persyaratan" },
  { id: "company", label: "Perusahaan" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function VacancyDetail({ vacancy }: VacancyDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>("summary");
  const isOpen = vacancy.is_active && isRegistrationOpen(vacancy.pendaftaran_awal, vacancy.pendaftaran_akhir);
  const relativeUpdated = formatRelativeTime(vacancy.updated_at) ?? "-";

  const syaratKhusus = useMemo(() => {
    const value = vacancy.source_raw?.syarat_khusus;
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.join("\n");
    return "-";
  }, [vacancy.source_raw]);

  const perusahaanInfo = useMemo(() => {
    if (!vacancy.source_raw || typeof vacancy.source_raw !== "object") return {} as Record<string, unknown>;
    const perusahaan = (vacancy.source_raw as Record<string, unknown>).perusahaan as Record<string, unknown> | undefined;
    return perusahaan ?? {};
  }, [vacancy.source_raw]);

  const tabContent = (
    <div className="rounded-3xl border border-white/10 bg-white/80 p-6 shadow-lg dark:bg-zinc-900/70">
      {activeTab === "summary" ? <SummaryTab vacancy={vacancy} /> : null}
      {activeTab === "requirements" ? (
        <RequirementsTab vacancy={vacancy} syaratKhusus={syaratKhusus} />
      ) : null}
      {activeTab === "company" ? <CompanyTab vacancy={vacancy} perusahaanInfo={perusahaanInfo} /> : null}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/80 p-8 shadow-lg dark:bg-zinc-900/80">
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant={isOpen ? "success" : "outline"}>{isOpen ? "Pendaftaran dibuka" : "Pendaftaran ditutup"}</Badge>
          <p className="text-sm text-zinc-500">Terakhir sinkron {relativeUpdated}</p>
        </div>
        <div className="mt-6 space-y-3">
          <p className="text-sm uppercase tracking-wide text-zinc-500">{vacancy.agency || vacancy.sub_agency}</p>
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white md:text-4xl">{vacancy.posisi}</h1>
          <p className="flex items-center gap-2 text-sm text-zinc-500">
            <MapPin className="h-4 w-4" />
            {vacancy.nama_kabupaten || "Lokasi fleksibel"}, {vacancy.nama_provinsi || "Indonesia"}
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard icon={<Calendar className="h-4 w-4" />} title="Jadwal pendaftaran" value={formatDateRange(vacancy.pendaftaran_awal, vacancy.pendaftaran_akhir)} />
          <InfoCard icon={<Calendar className="h-4 w-4" />} title="Periode magang" value={formatDateRange(vacancy.mulai, vacancy.selesai)} />
          <InfoCard icon={<Users className="h-4 w-4" />} title="Kuota" value={`${vacancy.jumlah_kuota ?? 0} orang`} />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {vacancy.jenjang.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))}
          {vacancy.program_studi.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/70 p-2 dark:bg-zinc-900/70">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={cn(
                  "flex-1 rounded-2xl px-4 py-2 text-sm font-medium",
                  activeTab === tab.id
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                    : "text-zinc-500"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {tabContent}
        </div>

        <aside className="space-y-4 rounded-3xl border border-white/10 bg-white/80 p-6 shadow-lg dark:bg-zinc-900/70 lg:sticky lg:top-32">
          <p className="text-sm text-zinc-500">Tautan resmi</p>
          <Button asChild size="lg">
            <a href={vacancy.url_original || "#"} target="_blank" rel="noreferrer">
              Buka halaman pendaftaran
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          {/* <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              if (typeof window === "undefined") return;
              const url = window.location.href;
              if (navigator?.clipboard) {
                navigator.clipboard.writeText(url);
              }
            }}
            className="w-full"
          >
            Salin tautan berbagi
            <Link className="ml-2 h-4 w-4" />
          </Button> */}
          <div className="rounded-2xl bg-zinc-50/80 p-4 text-xs text-zinc-500 dark:bg-zinc-800/60">
            Pastikan kembali informasi di situs resmi sebelum mengirimkan berkas.
          </div>
        </aside>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value }: { icon: ReactNode; title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-500">
        {icon}
        {title}
      </p>
      <p className="mt-2 text-base font-semibold text-zinc-900 dark:text-white">{value}</p>
    </div>
  );
}

function SummaryTab({ vacancy }: { vacancy: Vacancy }) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
      <p>{vacancy.deskripsi_posisi || "Deskripsi belum tersedia."}</p>
    </div>
  );
}

function RequirementsTab({ vacancy, syaratKhusus }: { vacancy: Vacancy; syaratKhusus: string }) {
  return (
    <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-200">
      <SectionBlock title="Jenjang yang diterima" icon={<FileText className="h-4 w-4" />}>
        {vacancy.jenjang.length ? vacancy.jenjang.join(", ") : "Tidak disebutkan"}
      </SectionBlock>
      <SectionBlock title="Program studi" icon={<FileText className="h-4 w-4" />}>
        {vacancy.program_studi.length ? vacancy.program_studi.join(", ") : "Semua program studi"}
      </SectionBlock>
      <SectionBlock title="Kuota" icon={<Users className="h-4 w-4" />}>
        {vacancy.jumlah_kuota ?? 0} peserta
      </SectionBlock>
      <SectionBlock title="Syarat khusus" icon={<FileText className="h-4 w-4" />}>
        {syaratKhusus || "Belum tersedia"}
      </SectionBlock>
    </div>
  );
}

function CompanyTab({ vacancy, perusahaanInfo }: { vacancy: Vacancy; perusahaanInfo: Record<string, unknown> }) {
  const alamat = perusahaanInfo?.alamat as string | undefined;
  const website = perusahaanInfo?.website as string | undefined;
  const kontak = compact([
    perusahaanInfo?.telepon as string | undefined,
    perusahaanInfo?.email as string | undefined,
  ]).join(" · ");

  return (
    <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-200">
      <SectionBlock title="Perusahaan" icon={<Building2 className="h-4 w-4" />}>
        <p className="text-base font-semibold text-zinc-900 dark:text-white">{vacancy.nama_perusahaan}</p>
        {alamat ? <p className="text-sm text-zinc-500">{alamat}</p> : null}
      </SectionBlock>
      <SectionBlock title="Instansi" icon={<Building2 className="h-4 w-4" />}>
        {vacancy.agency || vacancy.sub_agency || "-"}
      </SectionBlock>
      <SectionBlock title="Kontak" icon={<Building2 className="h-4 w-4" />}>
        {kontak || "Belum tersedia"}
      </SectionBlock>
      {website ? (
        <SectionBlock title="Website" icon={<ExternalLink className="h-4 w-4" />}>
          <a href={website} target="_blank" rel="noreferrer" className="text-emerald-600">
            {website}
          </a>
        </SectionBlock>
      ) : null}
    </div>
  );
}

function SectionBlock({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-100 p-4 dark:border-zinc-800">
      <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-500">
        {icon}
        {title}
      </p>
      <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-100">{children}</div>
    </div>
  );
}

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const formatNumber = Intl.NumberFormat("id-ID");

interface LandingHeroProps {
  totalVacancies: number;
  newCount: number;
}

export function LandingHero({ totalVacancies, newCount }: LandingHeroProps) {
  return (
    <section className="mx-auto mt-8 flex w-full max-w-7xl flex-col gap-8 px-4 md:px-6 lg:px-8 text-center md:text-left">
      <div className="space-y-6">
        <p className="inline-flex items-center rounded-full border border-emerald-500/40 px-3 py-1 text-xs font-medium text-emerald-200">
          Magang curated • Real-time sync every 2 hours
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
          Temukan magang paling relevan pada program maganghub kemnaker tanpa menyisir ribuan halaman.
        </h1>
        <p className="text-lg text-zinc-300 md:text-xl">
          MagangYu menghadirkan pencarian cerdas, filter mendalam, dan analitik ringan agar kamu bisa fokus
          pada peluang terbaik.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <Button asChild size="lg">
            <Link href="#cari">
              Mulai jelajahi
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="subtle" size="lg">
            <Link href="/?status=open">
              Fokus pada lowongan aktif
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <dl className="grid gap-6 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-2xl ring-1 ring-zinc-800 backdrop-blur md:grid-cols-2" aria-label="Statistik singkat">
        <div>
          <dt className="text-sm text-zinc-400">Lowongan aktif di database</dt>
          <dd className="text-4xl font-semibold text-white">
            {formatNumber.format(totalVacancies)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-400">Lowongan baru 72 jam terakhir</dt>
          <dd className="text-4xl font-semibold text-emerald-300">
            +{formatNumber.format(newCount)}
          </dd>
        </div>
      </dl>
    </section>
  );
}

import { Suspense } from "react";
import { LandingHero } from "@/components/hero/landing-hero";
import { SearchWorkspace } from "@/components/search/search-workspace";
import { fetchHeroMetrics } from "@/lib/api";

export default async function Home() {
  const heroMetrics = await fetchHeroMetrics().catch(() => ({ total: 0, newCount: 0 }));

  return (
    <>
      <LandingHero totalVacancies={heroMetrics.total} newCount={heroMetrics.newCount} />
      <Suspense fallback={<div className="mx-auto mt-10 w-full max-w-7xl px-4 pb-16 md:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="h-96 rounded-3xl border border-white/10 bg-zinc-900/70 animate-pulse" />
          <div className="h-96 rounded-3xl border border-white/10 bg-zinc-900/70 animate-pulse" />
        </div>
      </div>}>
        <SearchWorkspace />
      </Suspense>
    </>
  );
}

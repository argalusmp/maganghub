import { LandingHero } from "@/components/hero/landing-hero";
import { SearchWorkspace } from "@/components/search/search-workspace";
import { fetchHeroMetrics } from "@/lib/api";

export default async function Home() {
  const heroMetrics = await fetchHeroMetrics().catch(() => ({ total: 0, newCount: 0 }));

  return (
    <>
      <LandingHero totalVacancies={heroMetrics.total} newCount={heroMetrics.newCount} />
      <SearchWorkspace />
    </>
  );
}

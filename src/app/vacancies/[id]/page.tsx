import type { Metadata } from "next";
import { VacancyDetailScreen } from "@/components/vacancy/vacancy-detail-screen";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

interface VacancyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: VacancyPageProps): Promise<Metadata> {
  return {
    title: "Detail Lowongan — MagangHub",
    description: "Informasi lengkap lowongan magang pilihan dari MagangHub.",
  };
}

export default async function VacancyPage({ params }: VacancyPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <VacancyDetailScreen id={id} />
    </div>
  );
}

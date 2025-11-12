import type { Vacancy } from "@/lib/api-types";

export const BASE_PROGRAM_STUDI = [
  "Teknik Informatika",
  "Sistem Informasi",
  "Ilmu Komputer",
  "Rekayasa Perangkat Lunak",
  "Data Science",
  "Statistika",
  "Matematika",
  "Teknik Industri",
  "Teknik Elektro",
  "Teknik Mesin",
  "Teknik Kimia",
  "Teknik Sipil",
  "Teknik Lingkungan",
  "Teknik Telekomunikasi",
  "Teknik Fisika",
  "Teknik Geologi",
  "Teknik Perminyakan",
  "Teknik Pertambangan",
  "Sains Aktuaria",
  "Akuntansi",
  "Manajemen",
  "Bisnis Digital",
  "Administrasi Bisnis",
  "Administrasi Publik",
  "Ilmu Komunikasi",
  "Desain Komunikasi Visual",
  "Desain Produk",
  "Hubungan Internasional",
  "Hukum",
  "Psikologi",
  "Kesehatan Masyarakat",
  "Keperawatan",
  "Farmasi",
  "Kedokteran",
  "Biologi",
  "Kimia",
  "Fisika",
  "Agroteknologi",
  "Agribisnis",
  "Pariwisata",
  "Perhotelan",
  "Pendidikan Bahasa Inggris",
  "Pendidikan Matematika",
];

const canonicalProgramMap = new Map(
  BASE_PROGRAM_STUDI.map((label) => [normalizeProgramKey(label), label])
);

export function canonicalizeProgramLabel(raw: string) {
  const collapsed = raw.replace(/\s+/g, " ").trim();
  if (!collapsed) return "";

  const key = normalizeProgramKey(collapsed);
  return canonicalProgramMap.get(key) ?? collapsed;
}

export function buildProgramOptionsFromVacancies(vacancies: Vacancy[]) {
  const map = new Map(canonicalProgramMap);

  vacancies.forEach((vacancy) => {
    vacancy.program_studi.forEach((program) => {
      const canonical = canonicalizeProgramLabel(program);
      if (!canonical) return;

      const key = normalizeProgramKey(canonical);
      if (!map.has(key)) {
        map.set(key, canonical);
      }
    });
  });

  return Array.from(map.values()).sort((a, b) => a.localeCompare(b, "id"));
}

function normalizeProgramKey(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

import { test, expect } from "@playwright/test";

const mockVacancy = {
  id_posisi: "123",
  posisi: "Data Analyst Intern",
  deskripsi_posisi: "Bantu tim data menganalisis performa program.",
  jumlah_kuota: 5,
  jumlah_terdaftar: 2,
  program_studi: ["Statistika", "Sistem Informasi"],
  jenjang: ["Sarjana"],
  nama_perusahaan: "MagangHub Labs",
  kode_provinsi: "31",
  nama_provinsi: "DKI Jakarta",
  kode_kabupaten: "3174",
  nama_kabupaten: "Jakarta Selatan",
  pendaftaran_awal: "2024-01-01T00:00:00.000Z",
  pendaftaran_akhir: "2025-01-01T00:00:00.000Z",
  mulai: "2025-02-01T00:00:00.000Z",
  selesai: "2025-08-01T00:00:00.000Z",
  agency: "Kemnaker",
  sub_agency: "Ditjen Vokasi",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-02T00:00:00.000Z",
  source_raw: {},
  first_seen_at: new Date().toISOString(),
  last_synced_at: new Date().toISOString(),
  is_active: true,
  url_original: "https://kemnaker.go.id/magang/123",
};

const baseSearchResponse = {
  meta: { page: 1, limit: 20, total: 1 },
  data: [mockVacancy],
};

const heroResponse = { meta: { page: 1, limit: 1, total: 12000 }, data: [] };
const heroNewResponse = { meta: { page: 1, limit: 1, total: 42 }, data: [] };

const provinces = [{ kode_provinsi: "31", nama_provinsi: "DKI Jakarta" }];
const kabupaten = [{ nama_kabupaten: "Jakarta Selatan" }];

test.describe("search workspace", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/search**", async (route) => {
      const url = new URL(route.request().url());
      if (url.searchParams.get("only_new") === "true" && url.searchParams.get("limit") === "1") {
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(heroNewResponse) });
      }
      if (url.searchParams.get("limit") === "1" && url.searchParams.get("sort") === "terbaru") {
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(heroResponse) });
      }
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(baseSearchResponse) });
    });

    await page.route("**/facets/provinces", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(provinces) })
    );
    await page.route("**/facets/kabupaten**", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(kabupaten) })
    );
  });

  test("allows filtering and shows chips", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Lowongan aktif di database")).toBeVisible();
    await expect(page.getByText("Menampilkan 1-1 dari 1 lowongan")).toBeVisible();

    const provinceSelect = page.getByLabel("Provinsi");
    await provinceSelect.selectOption("31");

    const onlyNew = page.getByLabel("Hanya tampilkan lowongan baru 72 jam terakhir");
    await onlyNew.check();

    await expect(page.getByText("Hanya baru")).toBeVisible();
    await expect(page).toHaveURL(/kode_provinsi=31/);
  });
});

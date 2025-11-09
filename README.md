# MagangHub Frontend

MagangHub adalah antarmuka pencarian magang modern berbasis Next.js App Router dengan TypeScript dan Tailwind CSS 4. Aplikasi ini menampilkan ribuan lowongan dari MagangHub API / Kemnaker dan memfokuskan pengalaman discovery melalui filter mendalam, analitik ringan, serta URL yang dapat dibagikan.

## Fitur utama
- **Landing hero** dengan statistik total lowongan dan jumlah lowongan baru 72 jam terakhir.
- **Workspace pencarian**: panel filter (drawer mobile) dengan pencarian teks ter-debounce, filter lokasi hirarkis, jenjang & prodi multi-select dinamis, status, sort, checkbox "only new", serta tombol reset.
- **Ringkasan hasil** sticky berisi jumlah hasil dan chip filter yang bisa dihapus cepat.
- **Kartu lowongan** dengan badge status, highlight jenjang/prodi, kuota vs pendaftar, timeline pendaftaran, dan indikator "Baru".
- **Pagination** 20 item/halaman dengan skeleton optimistik ketika filter berubah.
- **Halaman detail lowongan** lengkap dengan hero posisi, tab Ringkasan/Persyaratan/Perusahaan, serta CTA sticky menuju halaman resmi.
- **Tema terang/gelap** dan komponen UI bergaya glassmorphism/shadcn.

## Teknologi
- Next.js 16 (App Router, RSC) + TypeScript
- Tailwind CSS 4 + custom utility components ala shadcn
- @tanstack/react-query untuk data fetching & caching klien
- Zod untuk validasi payload API
- date-fns untuk formatting tanggal/relative time
- Vitest + Testing Library dan Playwright untuk pengujian

## Prasyarat
1. **API backend** NestJS sudah berjalan di `http://localhost:3333` (atau set env di bawah).
2. Node.js 18+ dan npm.

## Konfigurasi lingkungan
Buat file `.env.local` di akar proyek bila perlu menimpa nilai default:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333
```

Jika variabel tidak diisi, aplikasi otomatis memakai `http://localhost:3333`.

## Menjalankan secara lokal
```bash
npm install          # pasang dependensi
npm run dev          # jalankan Next.js di http://localhost:3000
```

Perintah lain:

| Perintah             | Deskripsi |
|---------------------|-----------|
| `npm run build`     | Build produksi Next.js |
| `npm run start`     | Menjalankan build produksi |
| `npm run lint`      | Menjalankan ESLint |
| `npm run test`      | Menjalankan Vitest (unit + RTL) |
| `npm run test:ui`   | Mode interaktif Vitest |
| `npm run test:e2e`  | Menjalankan Playwright smoke test |

> Catatan: Playwright mengasumsikan server dev sudah aktif di port 3000 sebelum dijalankan.

## Struktur penting
```
src/
  app/
    page.tsx                 # Landing + workspace
    vacancies/[id]/page.tsx  # Detail lowongan
  components/
    hero/                    # Landing hero
    layout/                  # Shell, header, footer
    providers/               # Query & theme providers
    search/                  # Filter panel, results, cards
    ui/                      # Komponen utilitas (button, badge, dll)
    vacancy/                 # Detail vacancy tabs + hero
  hooks/                     # use-filter-params, TanStack hooks, debounce
  lib/
    api.ts                   # Fetcher + caching helper
    api-types.ts             # Skema Zod
    filters.ts               # Serialisasi filter ↔ URL
    format.ts                # Utils tanggal/status
```

## Integrasi API
Aplikasi memanfaatkan endpoint publik berikut:
1. `GET /search` — mendukung parameter `q`, `kode_provinsi`, `kabupaten`, `jenjang`, `prodi`, `status`, `only_new`, `sort`, `page`, `limit`.
2. `GET /vacancies/:id` — detail lowongan.
3. `GET /facets/provinces` — daftar provinsi (cache 12 jam).
4. `GET /facets/kabupaten?kode_provinsi=31` — daftar kabupaten per provinsi.

URL query di frontend selalu mencerminkan filter aktif sehingga dapat dibagikan atau di-bookmark.

## Pengujian
- **Unit/RTL**: fokus pada utilitas filter dan sinkronisasi URL (lihat `tests/filter-state.test.ts`).
- **Playwright**: smoke test memastikan alur pencarian utama (lihat `tests/search.spec.ts`).

## Troubleshooting
- Pastikan API backend berjalan sebelum membuka frontend.
- Jika mengganti port/host API, perbarui `NEXT_PUBLIC_API_BASE_URL`.
- Saat menambahkan dependensi baru di lingkungan WSL1, upgrade ke WSL2 atau gunakan Node.js yang mendukung karena beberapa paket mengharuskan fitur tersebut.

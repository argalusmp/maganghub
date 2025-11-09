import { z } from "zod";

const nullableDate = z.string().or(z.null()).optional();
const fallbackString = z.string().nullable().optional().default("");

export const vacancySchema = z.object({
  id: fallbackString,
  id_posisi: z.string(),
  posisi: z.string(),
  deskripsi_posisi: fallbackString,
  jumlah_kuota: z.coerce.number().nullable().default(0),
  jumlah_terdaftar: z.coerce.number().nullable().default(0),
  program_studi: z.array(z.string()).default([]),
  jenjang: z.array(z.string()).default([]),
  nama_perusahaan: fallbackString,
  kode_provinsi: fallbackString,
  nama_provinsi: fallbackString,
  kode_kabupaten: fallbackString,
  nama_kabupaten: fallbackString,
  pendaftaran_awal: nullableDate,
  pendaftaran_akhir: nullableDate,
  mulai: nullableDate,
  selesai: nullableDate,
  agency: fallbackString,
  sub_agency: fallbackString,
  created_at: nullableDate,
  updated_at: nullableDate,
  source_raw: z.record(z.any()).nullable().default({}),
  first_seen_at: nullableDate,
  last_synced_at: nullableDate,
  is_active: z.boolean().optional().default(true),
  url_original: fallbackString,
});

export type Vacancy = z.infer<typeof vacancySchema>;

export const searchMetaSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  total: z.coerce.number().default(0),
});

export const searchResponseSchema = z.object({
  meta: searchMetaSchema,
  data: z.array(vacancySchema),
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;

export const provinceSchema = z
  .object({
    kode_provinsi: fallbackString.optional(),
    kode_propinsi: fallbackString.optional(),
    nama_provinsi: fallbackString.optional(),
    nama_propinsi: fallbackString.optional(),
  })
  .transform((payload) => ({
    kode_provinsi: payload.kode_provinsi || payload.kode_propinsi || "",
    nama_provinsi: payload.nama_provinsi || payload.nama_propinsi || "",
  }));

export type Province = z.infer<typeof provinceSchema>;

export const kabupatenSchema = z
  .object({
    nama_kabupaten: fallbackString.optional(),
  })
  .transform((payload) => ({
    nama_kabupaten: payload.nama_kabupaten || "",
  }));

export type Kabupaten = z.infer<typeof kabupatenSchema>;

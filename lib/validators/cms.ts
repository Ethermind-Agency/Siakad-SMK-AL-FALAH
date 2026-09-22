import { z } from 'zod';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const newsStatusEnum = z.enum(['draft', 'published', 'archived']);
export const facilityConditionEnum = z.enum([
  'baik',
  'rusak_ringan',
  'rusak_sedang',
  'rusak_berat',
]);

export const createNewsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: 'Judul berita minimal 5 karakter' })
    .max(255, { message: 'Judul berita maksimal 255 karakter' }),
  content: z
    .string()
    .trim()
    .min(10, { message: 'Konten berita minimal 10 karakter' }),
  excerpt: z
    .string()
    .trim()
    .max(500, { message: 'Ringkasan berita maksimal 500 karakter' })
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
  featuredImageUrl: z
    .string()
    .trim()
    .url({ message: 'URL gambar utama tidak valid' })
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
  status: newsStatusEnum.optional().default('published'),
});

export const updateNewsSchema = createNewsSchema.partial();

export const createFacilitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'Nama fasilitas minimal 3 karakter' })
    .max(150, { message: 'Nama fasilitas maksimal 150 karakter' }),
  description: z
    .string()
    .trim()
    .max(1000, { message: 'Deskripsi fasilitas maksimal 1000 karakter' })
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
  condition: facilityConditionEnum,
  imageUrl: z
    .string()
    .trim()
    .url({ message: 'URL gambar fasilitas tidak valid' })
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
});

export const updateFacilitySchema = createFacilitySchema.partial();

export const updateSchoolProfileSchema = z.object({
  name: z.string().trim().min(3).max(200).optional(),
  vision: z.string().trim().min(10).optional(),
  mission: z.array(z.string().trim().min(5)).min(1).optional(),
  history: z.string().trim().min(10).optional(),
  address: z.string().trim().min(5).optional(),
  phone: z.string().trim().max(30).optional(),
  email: z.string().trim().email({ message: 'Format email sekolah tidak valid' }).optional(),
});

export const newsFilterQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: newsStatusEnum.optional(),
  page: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => Math.max(1, parseInt(v, 10)))
    .optional()
    .default('1'),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => Math.min(50, Math.max(1, parseInt(v, 10))))
    .optional()
    .default('10'),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
export type CreateFacilityInput = z.infer<typeof createFacilitySchema>;
export type UpdateFacilityInput = z.infer<typeof updateFacilitySchema>;
export type UpdateSchoolProfileInput = z.infer<typeof updateSchoolProfileSchema>;
export type NewsFilterQueryInput = z.infer<typeof newsFilterQuerySchema>;

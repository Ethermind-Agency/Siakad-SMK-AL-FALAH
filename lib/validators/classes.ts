import { z } from 'zod';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const createClassSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'Nama kelas minimal 3 karakter (contoh: X TKJ 1)' })
    .max(50, { message: 'Nama kelas maksimal 50 karakter' }),
  gradeLevel: z
    .number()
    .int()
    .min(10, { message: 'Tingkat kelas minimal 10' })
    .max(12, { message: 'Tingkat kelas maksimal 12' }),
  academicYear: z
    .string()
    .trim()
    .regex(/^\d{4}\/\d{4}$/, { message: 'Format tahun ajaran harus YYYY/YYYY (contoh: 2026/2027)' }),
  homeroomTeacherId: z
    .string()
    .trim()
    .regex(uuidRegex, { message: 'ID Wali Kelas harus berupa UUID valid' }),
});

export const updateClassSchema = createClassSchema.partial();

export const classFilterQuerySchema = z.object({
  academicYear: z.string().trim().optional(),
  gradeLevel: z
    .string()
    .regex(/^(10|11|12)$/)
    .transform((v) => parseInt(v, 10))
    .optional(),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type ClassFilterQueryInput = z.infer<typeof classFilterQuerySchema>;

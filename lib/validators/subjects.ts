import { z } from 'zod';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const createSubjectSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, { message: 'Kode mata pelajaran minimal 2 karakter' })
    .max(20, { message: 'Kode mata pelajaran maksimal 20 karakter' })
    .transform((v) => v.toUpperCase()),
  name: z
    .string()
    .trim()
    .min(3, { message: 'Nama mata pelajaran minimal 3 karakter' })
    .max(150, { message: 'Nama mata pelajaran maksimal 150 karakter' }),
  description: z
    .string()
    .trim()
    .max(500, { message: 'Deskripsi maksimal 500 karakter' })
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
});

export const updateSubjectSchema = createSubjectSchema.partial();

export const assignClassSubjectSchema = z.object({
  classId: z.string().trim().regex(uuidRegex, { message: 'ID Kelas harus berupa UUID valid' }),
  subjectId: z.string().trim().regex(uuidRegex, { message: 'ID Mata Pelajaran harus berupa UUID valid' }),
  teacherId: z.string().trim().regex(uuidRegex, { message: 'ID Guru harus berupa UUID valid' }),
  academicYear: z
    .string()
    .trim()
    .regex(/^\d{4}\/\d{4}$/, { message: 'Format tahun ajaran harus YYYY/YYYY (contoh: 2026/2027)' }),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
export type AssignClassSubjectInput = z.infer<typeof assignClassSubjectSchema>;

import { z } from 'zod';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const studentGenderEnum = z.enum(['L', 'P'], {
  errorMap: () => ({ message: 'Jenis kelamin harus L (Laki-laki) atau P (Perempuan)' }),
});

export const createStudentSchema = z.object({
  nisn: z
    .string()
    .trim()
    .min(5, { message: 'NISN minimal 5 digit' })
    .max(20, { message: 'NISN maksimal 20 digit' }),
  fullName: z
    .string()
    .trim()
    .min(3, { message: 'Nama lengkap siswa minimal 3 karakter' })
    .max(150, { message: 'Nama lengkap siswa maksimal 150 karakter' }),
  classId: z
    .string()
    .trim()
    .regex(uuidRegex, { message: 'ID Kelas harus berupa UUID valid' }),
  gender: studentGenderEnum,
  parentUserId: z
    .string()
    .trim()
    .regex(uuidRegex, { message: 'ID Orang Tua harus berupa UUID valid' })
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
});

export const updateStudentSchema = z.object({
  nisn: z.string().trim().min(5).max(20).optional(),
  fullName: z.string().trim().min(3).max(150).optional(),
  classId: z.string().trim().regex(uuidRegex).optional(),
  gender: studentGenderEnum.optional(),
  parentUserId: z.string().trim().regex(uuidRegex).optional().nullable(),
  isActive: z.boolean().optional(),
});

export const studentFilterQuerySchema = z.object({
  classId: z.string().trim().regex(uuidRegex).optional(),
  search: z.string().trim().optional(),
  gender: studentGenderEnum.optional(),
  isActive: z
    .string()
    .transform((v) => v === 'true' || v === '1')
    .optional()
    .default('true'),
  page: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => Math.max(1, parseInt(v, 10)))
    .optional()
    .default('1'),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => Math.min(100, Math.max(1, parseInt(v, 10))))
    .optional()
    .default('20'),
});

export const singleImportStudentItemSchema = z.object({
  nisn: z.string().trim().min(5).max(20),
  fullName: z.string().trim().min(3).max(150),
  gender: studentGenderEnum,
});

export const importStudentsSchema = z.object({
  classId: z.string().trim().regex(uuidRegex, { message: 'ID Kelas harus berupa UUID valid' }),
  students: z
    .array(singleImportStudentItemSchema)
    .min(1, { message: 'Daftar import siswa tidak boleh kosong' })
    .refine(
      (items) => {
        const nisns = items.map((i) => i.nisn);
        return new Set(nisns).size === nisns.length;
      },
      { message: 'Terdapat NISN duplikat dalam data import' }
    ),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type StudentFilterQueryInput = z.infer<typeof studentFilterQuerySchema>;
export type ImportStudentsInput = z.infer<typeof importStudentsSchema>;

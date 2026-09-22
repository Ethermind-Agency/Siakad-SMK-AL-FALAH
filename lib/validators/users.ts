import { z } from 'zod';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const userRoleEnum = z.enum(['admin_tu', 'kepala_sekolah', 'guru', 'siswa_ortu'], {
  errorMap: () => ({ message: 'Role harus salah satu dari: admin_tu, kepala_sekolah, guru, siswa_ortu' }),
});

export const createUserSchema = z.object({
  email: z.string().trim().email({ message: 'Format email tidak valid' }).toLowerCase(),
  password: z
    .string()
    .min(6, { message: 'Password minimal 6 karakter' })
    .max(100, { message: 'Password maksimal 100 karakter' }),
  fullName: z
    .string()
    .trim()
    .min(3, { message: 'Nama lengkap minimal 3 karakter' })
    .max(150, { message: 'Nama lengkap maksimal 150 karakter' }),
  role: userRoleEnum,
  nipOrNisn: z
    .string()
    .trim()
    .max(50, { message: 'NIP/NISN maksimal 50 karakter' })
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  phone: z
    .string()
    .trim()
    .max(25, { message: 'Nomor telepon maksimal 25 karakter' })
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(3).max(150).optional(),
  role: userRoleEnum.optional(),
  nipOrNisn: z.string().trim().max(50).optional().nullable(),
  phone: z.string().trim().max(25).optional().nullable(),
  password: z.string().min(6).max(100).optional(),
});

export const userFilterQuerySchema = z.object({
  search: z.string().trim().optional(),
  role: userRoleEnum.optional(),
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

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserFilterQueryInput = z.infer<typeof userFilterQuerySchema>;

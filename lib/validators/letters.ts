import { z } from 'zod';

const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const letterStatusEnum = z.enum([
  'draft',
  'pending',
  'approved',
  'rejected',
  'archived',
]);

export const createIncomingLetterSchema = z.object({
  referenceNumber: z
    .string()
    .trim()
    .min(3, { message: 'Nomor surat asli minimal 3 karakter' })
    .max(100, { message: 'Nomor surat asli maksimal 100 karakter' }),
  date: z
    .string()
    .trim()
    .regex(dateRegex, { message: 'Format tanggal harus YYYY-MM-DD' }),
  sender: z
    .string()
    .trim()
    .min(3, { message: 'Nama pengirim minimal 3 karakter' })
    .max(150, { message: 'Nama pengirim maksimal 150 karakter' }),
  subject: z
    .string()
    .trim()
    .min(3, { message: 'Perihal surat minimal 3 karakter' })
    .max(255, { message: 'Perihal surat maksimal 255 karakter' }),
  classificationCode: z
    .string()
    .trim()
    .min(1, { message: 'Kode klasifikasi wajib diisi' })
    .max(50, { message: 'Kode klasifikasi maksimal 50 karakter' }),
  summary: z
    .string()
    .trim()
    .max(1000, { message: 'Ringkasan surat maksimal 1000 karakter' })
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
  fileUrl: z
    .string()
    .trim()
    .url({ message: 'URL file PDF tidak valid' })
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
  fileSizeBytes: z
    .number()
    .int()
    .positive()
    .max(5 * 1024 * 1024, { message: 'Ukuran file PDF maksimal 5MB' })
    .optional(),
});

export const createOutgoingLetterSchema = z.object({
  date: z
    .string()
    .trim()
    .regex(dateRegex, { message: 'Format tanggal harus YYYY-MM-DD' }),
  recipient: z
    .string()
    .trim()
    .min(3, { message: 'Tujuan/Penerima surat minimal 3 karakter' })
    .max(150, { message: 'Tujuan/Penerima surat maksimal 150 karakter' }),
  subject: z
    .string()
    .trim()
    .min(3, { message: 'Perihal surat minimal 3 karakter' })
    .max(255, { message: 'Perihal surat maksimal 255 karakter' }),
  classificationCode: z
    .string()
    .trim()
    .min(1, { message: 'Kode klasifikasi wajib diisi' })
    .max(50, { message: 'Kode klasifikasi maksimal 50 karakter' }),
  summary: z
    .string()
    .trim()
    .max(2000, { message: 'Isi ringkas surat maksimal 2000 karakter' })
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
});

export const updateLetterStatusSchema = z.object({
  status: letterStatusEnum,
  dispositionNotes: z
    .string()
    .trim()
    .max(500, { message: 'Catatan disposisi maksimal 500 karakter' })
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
});

export const letterFilterQuerySchema = z.object({
  search: z.string().trim().optional(),
  classificationCode: z.string().trim().optional(),
  status: letterStatusEnum.optional(),
  startDate: z.string().trim().regex(dateRegex).optional(),
  endDate: z.string().trim().regex(dateRegex).optional(),
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

export type CreateIncomingLetterInput = z.infer<typeof createIncomingLetterSchema>;
export type CreateOutgoingLetterInput = z.infer<typeof createOutgoingLetterSchema>;
export type UpdateLetterStatusInput = z.infer<typeof updateLetterStatusSchema>;
export type LetterFilterQueryInput = z.infer<typeof letterFilterQuerySchema>;

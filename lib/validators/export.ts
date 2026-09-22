import { z } from 'zod';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const exportAttendanceQuerySchema = z.object({
  classId: z.string().trim().regex(uuidRegex, { message: 'ID Kelas harus berupa UUID valid' }),
  subjectId: z
    .string()
    .trim()
    .regex(uuidRegex, { message: 'ID Mata Pelajaran harus berupa UUID valid' })
    .optional(),
  startDate: z
    .string()
    .trim()
    .regex(dateRegex, { message: 'Format startDate harus YYYY-MM-DD' })
    .optional(),
  endDate: z
    .string()
    .trim()
    .regex(dateRegex, { message: 'Format endDate harus YYYY-MM-DD' })
    .optional(),
  month: z
    .string()
    .regex(/^([1-9]|1[0-2])$/, { message: 'Bulan harus antara 1-12' })
    .transform((val) => parseInt(val, 10))
    .optional(),
  year: z
    .string()
    .regex(/^\d{4}$/, { message: 'Tahun harus 4 digit angka' })
    .transform((val) => parseInt(val, 10))
    .optional(),
  format: z.enum(['csv', 'excel']).optional().default('csv'),
});

export type ExportAttendanceQueryInput = z.infer<typeof exportAttendanceQuerySchema>;

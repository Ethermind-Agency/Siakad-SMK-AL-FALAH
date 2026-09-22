import { z } from 'zod';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const attendanceStatusEnum = z.enum(['HADIR', 'IZIN', 'SAKIT', 'ALPA'], {
  errorMap: () => ({ message: 'Status kehadiran harus HADIR, IZIN, SAKIT, atau ALPA' }),
});

export const attendanceRecordInputSchema = z.object({
  studentId: z
    .string()
    .trim()
    .regex(uuidRegex, { message: 'ID Siswa harus berupa UUID valid' }),
  status: attendanceStatusEnum,
  notes: z
    .string()
    .trim()
    .max(255, { message: 'Catatan maksimal 255 karakter' })
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
});

export const submitAttendanceSchema = z.object({
  classId: z
    .string()
    .trim()
    .regex(uuidRegex, { message: 'ID Kelas harus berupa UUID valid' }),
  subjectId: z
    .string()
    .trim()
    .regex(uuidRegex, { message: 'ID Mata Pelajaran harus berupa UUID valid' })
    .optional(),
  date: z
    .string()
    .trim()
    .regex(dateRegex, { message: 'Format tanggal harus YYYY-MM-DD' })
    .refine(
      (val) => {
        const d = new Date(val);
        return !isNaN(d.getTime());
      },
      { message: 'Tanggal tidak valid' }
    ),
  records: z
    .array(attendanceRecordInputSchema)
    .min(1, { message: 'Daftar presensi siswa tidak boleh kosong' })
    .refine(
      (records) => {
        const studentIds = records.map((r) => r.studentId);
        return new Set(studentIds).size === studentIds.length;
      },
      { message: 'Terdapat duplikasi data siswa dalam daftar presensi' }
    ),
});

export const getAttendanceQuerySchema = z.object({
  classId: z
    .string()
    .trim()
    .regex(uuidRegex, { message: 'ID Kelas harus berupa UUID valid' }),
  subjectId: z
    .string()
    .trim()
    .regex(uuidRegex, { message: 'ID Mata Pelajaran harus berupa UUID valid' })
    .optional(),
  date: z
    .string()
    .trim()
    .regex(dateRegex, { message: 'Format tanggal harus YYYY-MM-DD' }),
});

export const getRecapQuerySchema = z
  .object({
    classId: z
      .string()
      .trim()
      .regex(uuidRegex, { message: 'ID Kelas harus berupa UUID valid' })
      .optional(),
    subjectId: z
      .string()
      .trim()
      .regex(uuidRegex, { message: 'ID Mata Pelajaran harus berupa UUID valid' })
      .optional(),
    studentId: z
      .string()
      .trim()
      .regex(uuidRegex, { message: 'ID Siswa harus berupa UUID valid' })
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
  })
  .refine(
    (data) => {
      // Must provide either classId or studentId
      return Boolean(data.classId || data.studentId);
    },
    { message: 'Wajib menyertakan parameter classId atau studentId' }
  );

export type SubmitAttendanceInput = z.infer<typeof submitAttendanceSchema>;
export type GetAttendanceQuery = z.infer<typeof getAttendanceQuerySchema>;
export type GetRecapQuery = z.infer<typeof getRecapQuerySchema>;

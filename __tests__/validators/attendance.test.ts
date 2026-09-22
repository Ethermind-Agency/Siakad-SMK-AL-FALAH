import { describe, it, expect } from 'vitest';
import {
  submitAttendanceSchema,
  getAttendanceQuerySchema,
  getRecapQuerySchema,
} from '@/lib/validators/attendance';

describe('Attendance Zod Validators', () => {
  const validClassId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
  const validStudentId1 = '11111111-2222-4333-8444-555555555555';
  const validStudentId2 = '66666666-7777-4888-8999-000000000000';

  describe('submitAttendanceSchema', () => {
    it('should validate a correct attendance submission body', () => {
      const validPayload = {
        classId: validClassId,
        date: '2026-09-22',
        records: [
          { studentId: validStudentId1, status: 'HADIR', notes: 'Tepat waktu' },
          { studentId: validStudentId2, status: 'IZIN', notes: 'Surat dokter' },
        ],
      };

      const result = submitAttendanceSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.records.length).toBe(2);
        expect(result.data.records[0].status).toBe('HADIR');
      }
    });

    it('should fail when classId is not a valid UUID', () => {
      const payload = {
        classId: 'invalid-class-id',
        date: '2026-09-22',
        records: [{ studentId: validStudentId1, status: 'HADIR' }],
      };

      const result = submitAttendanceSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.some((e) => e.path.includes('classId'))).toBe(true);
      }
    });

    it('should fail when date format is not YYYY-MM-DD', () => {
      const payload = {
        classId: validClassId,
        date: '22-09-2026', // wrong format
        records: [{ studentId: validStudentId1, status: 'HADIR' }],
      };

      const result = submitAttendanceSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should fail when attendance status is invalid', () => {
      const payload = {
        classId: validClassId,
        date: '2026-09-22',
        records: [{ studentId: validStudentId1, status: 'BOLOS' }], // invalid status
      };

      const result = submitAttendanceSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should fail when records array is empty', () => {
      const payload = {
        classId: validClassId,
        date: '2026-09-22',
        records: [],
      };

      const result = submitAttendanceSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should fail when duplicate studentId exists in records', () => {
      const payload = {
        classId: validClassId,
        date: '2026-09-22',
        records: [
          { studentId: validStudentId1, status: 'HADIR' },
          { studentId: validStudentId1, status: 'IZIN' }, // duplicate studentId
        ],
      };

      const result = submitAttendanceSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.errors.some((e) =>
            e.message.includes('Terdapat duplikasi data siswa')
          )
        ).toBe(true);
      }
    });
  });

  describe('getAttendanceQuerySchema', () => {
    it('should validate valid classId and date query parameters', () => {
      const query = {
        classId: validClassId,
        date: '2026-09-22',
      };

      const result = getAttendanceQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
    });

    it('should fail with missing date or invalid UUID', () => {
      const result = getAttendanceQuerySchema.safeParse({ classId: 'abc' });
      expect(result.success).toBe(false);
    });
  });

  describe('getRecapQuerySchema', () => {
    it('should succeed when classId is provided', () => {
      const result = getRecapQuerySchema.safeParse({
        classId: validClassId,
        month: '9',
        year: '2026',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.month).toBe(9);
        expect(result.data.year).toBe(2026);
      }
    });

    it('should succeed when studentId is provided', () => {
      const result = getRecapQuerySchema.safeParse({
        studentId: validStudentId1,
      });
      expect(result.success).toBe(true);
    });

    it('should fail when neither classId nor studentId is provided', () => {
      const result = getRecapQuerySchema.safeParse({
        startDate: '2026-09-01',
        endDate: '2026-09-22',
      });
      expect(result.success).toBe(false);
    });

    it('should fail on invalid month (e.g. month 13)', () => {
      const result = getRecapQuerySchema.safeParse({
        classId: validClassId,
        month: '13',
      });
      expect(result.success).toBe(false);
    });
  });
});

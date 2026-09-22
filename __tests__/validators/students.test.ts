import { describe, it, expect } from 'vitest';
import {
  createStudentSchema,
  importStudentsSchema,
} from '@/lib/validators/students';

describe('Students Zod Validators', () => {
  const validClassId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

  describe('createStudentSchema', () => {
    it('should validate valid student registration', () => {
      const payload = {
        nisn: '0081234567',
        fullName: 'Muhammad Rizky',
        classId: validClassId,
        gender: 'L',
      };

      const result = createStudentSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should reject invalid gender', () => {
      const payload = {
        nisn: '0081234567',
        fullName: 'Muhammad Rizky',
        classId: validClassId,
        gender: 'X',
      };

      const result = createStudentSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('importStudentsSchema', () => {
    it('should validate batch import array', () => {
      const payload = {
        classId: validClassId,
        students: [
          { nisn: '0081111111', fullName: 'Siswa Satu', gender: 'L' },
          { nisn: '0082222222', fullName: 'Siswa Dua', gender: 'P' },
        ],
      };

      const result = importStudentsSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should reject batch import with duplicate NISNs in payload', () => {
      const payload = {
        classId: validClassId,
        students: [
          { nisn: '0081111111', fullName: 'Siswa Satu', gender: 'L' },
          { nisn: '0081111111', fullName: 'Siswa Duplikat', gender: 'P' }, // duplicate NISN
        ],
      };

      const result = importStudentsSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});

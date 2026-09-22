import { describe, it, expect } from 'vitest';
import {
  createSubjectSchema,
  assignClassSubjectSchema,
} from '@/lib/validators/subjects';

describe('Subject Zod Validators', () => {
  const validClassId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
  const validSubjectId = '11111111-2222-4333-8444-555555555555';
  const validTeacherId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

  describe('createSubjectSchema', () => {
    it('should validate and uppercase subject code', () => {
      const payload = {
        code: 'aij',
        name: 'Administrasi Infrastruktur Jaringan',
        description: 'Mata pelajaran produktif TKJ',
      };

      const result = createSubjectSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe('AIJ');
      }
    });

    it('should fail when subject code or name is too short', () => {
      const payload = {
        code: 'a',
        name: 'b',
      };

      const result = createSubjectSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('assignClassSubjectSchema', () => {
    it('should validate valid class subject assignment', () => {
      const payload = {
        classId: validClassId,
        subjectId: validSubjectId,
        teacherId: validTeacherId,
        academicYear: '2026/2027',
      };

      const result = assignClassSubjectSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should reject invalid academic year format', () => {
      const payload = {
        classId: validClassId,
        subjectId: validSubjectId,
        teacherId: validTeacherId,
        academicYear: '2026-2027', // invalid format (must be YYYY/YYYY)
      };

      const result = assignClassSubjectSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});

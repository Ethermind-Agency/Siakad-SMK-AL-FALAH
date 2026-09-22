import { describe, it, expect } from 'vitest';
import {
  createClassSchema,
  classFilterQuerySchema,
} from '@/lib/validators/classes';

describe('Classes Zod Validators', () => {
  const validTeacherId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

  describe('createClassSchema', () => {
    it('should validate valid class payload', () => {
      const payload = {
        name: 'X TKJ 1',
        gradeLevel: 10,
        academicYear: '2026/2027',
        homeroomTeacherId: validTeacherId,
      };

      const result = createClassSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should reject invalid gradeLevel (must be 10, 11, or 12)', () => {
      const payload = {
        name: 'Kelas 9',
        gradeLevel: 9, // SMK only has 10, 11, 12
        academicYear: '2026/2027',
        homeroomTeacherId: validTeacherId,
      };

      const result = createClassSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should reject invalid academic year format', () => {
      const payload = {
        name: 'X TKJ 1',
        gradeLevel: 10,
        academicYear: '2026-2027',
        homeroomTeacherId: validTeacherId,
      };

      const result = createClassSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('classFilterQuerySchema', () => {
    it('should parse gradeLevel and academicYear', () => {
      const result = classFilterQuerySchema.safeParse({
        gradeLevel: '11',
        academicYear: '2026/2027',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.gradeLevel).toBe(11);
      }
    });
  });
});

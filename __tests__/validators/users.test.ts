import { describe, it, expect } from 'vitest';
import {
  createUserSchema,
  updateUserSchema,
  userFilterQuerySchema,
} from '@/lib/validators/users';

describe('User Management Zod Validators', () => {
  describe('createUserSchema', () => {
    it('should validate valid user payload with role', () => {
      const payload = {
        email: 'guru.tkj@smks-alfalah.sch.id',
        password: 'Password123!',
        fullName: 'Budi Santoso, S.Kom',
        role: 'guru',
        nipOrNisn: '198501012010011001',
        phone: '081234567890',
      };

      const result = createUserSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('guru.tkj@smks-alfalah.sch.id');
        expect(result.data.role).toBe('guru');
      }
    });

    it('should reject invalid role enum', () => {
      const payload = {
        email: 'user@example.com',
        password: 'Password123!',
        fullName: 'User Name',
        role: 'superadmin', // not in allowed roles
      };

      const result = createUserSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should reject short password (< 6 chars)', () => {
      const payload = {
        email: 'user@example.com',
        password: '123',
        fullName: 'User Name',
        role: 'guru',
      };

      const result = createUserSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('updateUserSchema', () => {
    it('should allow partial updates', () => {
      const result = updateUserSchema.safeParse({
        fullName: 'Updated Name',
        role: 'kepala_sekolah',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('userFilterQuerySchema', () => {
    it('should parse role filter and pagination', () => {
      const result = userFilterQuerySchema.safeParse({
        role: 'guru',
        search: 'Budi',
        page: '2',
        limit: '20',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(20);
      }
    });
  });
});

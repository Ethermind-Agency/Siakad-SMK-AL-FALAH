import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getStudents, POST as createStudent } from '@/app/api/students/route';
import { POST as importStudents } from '@/app/api/students/import/route';
import * as sessionModule from '@/lib/auth/session';
import * as supabaseModule from '@/lib/supabase/server';

vi.mock('@/lib/auth/session');
vi.mock('@/lib/supabase/server');

describe('Students API Route Handlers', () => {
  const adminId = '11111111-2222-3333-4444-555555555555';
  const classId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
  const studentId = '99999999-8888-7777-6666-555555555555';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/students', () => {
    it('should successfully register a student for Admin TU', async () => {
      vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue({
        id: adminId,
        email: 'admin@example.com',
        profile: {
          id: adminId,
          email: 'admin@example.com',
          full_name: 'Ibrahim (Admin TU)',
          role: 'admin_tu',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      const mockSupabase = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'students') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({ data: null }), // NISN not taken
              insert: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: {
                  id: studentId,
                  nisn: '0081234567',
                  full_name: 'Muhammad Rizky',
                  class_id: classId,
                  gender: 'L',
                  is_active: true,
                },
                error: null,
              }),
            };
          }
          if (table === 'classes') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: { id: classId },
                error: null,
              }),
            };
          }
          return {};
        }),
      };

      const mockAdmin = {
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockResolvedValue({ error: null }),
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(supabaseModule, 'createServerSupabaseClient').mockResolvedValue(mockSupabase as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(supabaseModule, 'createAdminClient').mockReturnValue(mockAdmin as any);

      const req = new NextRequest('http://localhost/api/students', {
        method: 'POST',
        body: JSON.stringify({
          nisn: '0081234567',
          fullName: 'Muhammad Rizky',
          classId,
          gender: 'L',
        }),
      });

      const res = await createStudent(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.nisn).toBe('0081234567');
    });
  });

  describe('POST /api/students/import', () => {
    it('should successfully batch import multiple students', async () => {
      vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue({
        id: adminId,
        email: 'admin@example.com',
        profile: {
          id: adminId,
          email: 'admin@example.com',
          full_name: 'Ibrahim (Admin TU)',
          role: 'admin_tu',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      const mockSupabase = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'classes') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: { id: classId, name: 'X TKJ 1' },
                error: null,
              }),
            };
          }
          if (table === 'students') {
            return {
              select: vi.fn().mockReturnThis(),
              in: vi.fn().mockResolvedValue({
                data: [], // No existing NISN conflicts
              }),
              insert: vi.fn().mockReturnValue({
                select: vi.fn().mockResolvedValue({
                  data: [
                    { id: 'st-1', nisn: '0081111111', full_name: 'Siswa Satu', gender: 'L' },
                    { id: 'st-2', nisn: '0082222222', full_name: 'Siswa Dua', gender: 'P' },
                  ],
                  error: null,
                }),
              }),
            };
          }
          return {};
        }),
      };

      const mockAdmin = {
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockResolvedValue({ error: null }),
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(supabaseModule, 'createServerSupabaseClient').mockResolvedValue(mockSupabase as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(supabaseModule, 'createAdminClient').mockReturnValue(mockAdmin as any);

      const req = new NextRequest('http://localhost/api/students/import', {
        method: 'POST',
        body: JSON.stringify({
          classId,
          students: [
            { nisn: '0081111111', fullName: 'Siswa Satu', gender: 'L' },
            { nisn: '0082222222', fullName: 'Siswa Dua', gender: 'P' },
          ],
        }),
      });

      const res = await importStudents(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.totalImported).toBe(2);
      expect(json.data.className).toBe('X TKJ 1');
    });
  });
});

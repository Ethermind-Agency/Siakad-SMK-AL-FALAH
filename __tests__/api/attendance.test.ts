import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/attendance/route';
import * as sessionModule from '@/lib/auth/session';
import * as supabaseModule from '@/lib/supabase/server';

vi.mock('@/lib/auth/session');
vi.mock('@/lib/supabase/server');

describe('Attendance API Route Handlers', () => {
  const validClassId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
  const validSubjectId = '22222222-3333-4444-5555-666666666666';
  const validStudentId = '11111111-2222-4333-8444-555555555555';
  const teacherId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/attendance', () => {
    it('should return 401 when user is not authenticated', async () => {
      vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue(null);

      const req = new NextRequest('http://localhost/api/attendance', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.success).toBe(false);
      expect(json.message).toContain('Sesi tidak valid');
    });

    it('should return 403 when user has unauthorized role (e.g. siswa_ortu)', async () => {
      vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue({
        id: '12345678-1234-1234-1234-123456789012',
        email: 'student@example.com',
        profile: {
          id: '12345678-1234-1234-1234-123456789012',
          email: 'student@example.com',
          full_name: 'Student One',
          role: 'siswa_ortu',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      const req = new NextRequest('http://localhost/api/attendance', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(403);
      expect(json.success).toBe(false);
      expect(json.message).toContain('Hanya Guru atau Admin TU');
    });

    it('should return 400 when body fails Zod validation', async () => {
      vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue({
        id: teacherId,
        email: 'teacher@example.com',
        profile: {
          id: teacherId,
          email: 'teacher@example.com',
          full_name: 'Guru Pengampu',
          role: 'guru',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      const req = new NextRequest('http://localhost/api/attendance', {
        method: 'POST',
        body: JSON.stringify({
          classId: 'not-a-uuid',
          date: 'invalid-date',
          records: [],
        }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.errors).toBeDefined();
    });

    it('should successfully submit new daily attendance and return 201', async () => {
      vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue({
        id: teacherId,
        email: 'teacher@example.com',
        profile: {
          id: teacherId,
          email: 'teacher@example.com',
          full_name: 'Guru Pengampu',
          role: 'guru',
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
                data: { id: validClassId, name: 'X TKJ 1', homeroom_teacher_id: teacherId },
                error: null,
              }),
            };
          }
          if (table === 'students') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              in: vi.fn().mockResolvedValue({
                data: [{ id: validStudentId }],
                error: null,
              }),
            };
          }
          if (table === 'attendances') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              is: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({ data: null }), // No existing attendance
              insert: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: { id: 'attendance-header-uuid' },
                error: null,
              }),
            };
          }
          if (table === 'attendance_records') {
            return {
              insert: vi.fn().mockResolvedValue({ error: null }),
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

      const today = new Date().toISOString().split('T')[0];
      const req = new NextRequest('http://localhost/api/attendance', {
        method: 'POST',
        body: JSON.stringify({
          classId: validClassId,
          date: today,
          records: [{ studentId: validStudentId, status: 'HADIR' }],
        }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.stats.percentage).toBe(100);
      expect(json.data.className).toBe('X TKJ 1');
    });

    it('should successfully submit subject attendance when teacher is assigned to class subject', async () => {
      vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue({
        id: teacherId,
        email: 'teacher@example.com',
        profile: {
          id: teacherId,
          email: 'teacher@example.com',
          full_name: 'Guru Mapel',
          role: 'guru',
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
                data: { id: validClassId, name: 'X TKJ 1', homeroom_teacher_id: '99999999-8888-7777-6666-555555555555' },
                error: null,
              }),
            };
          }
          if (table === 'subjects') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: { id: validSubjectId, name: 'Administrasi Infrastruktur Jaringan' },
                error: null,
              }),
            };
          }
          if (table === 'class_subjects') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({
                data: { id: 'assignment-1' }, // Teacher is assigned!
              }),
            };
          }
          if (table === 'students') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              in: vi.fn().mockResolvedValue({
                data: [{ id: validStudentId }],
                error: null,
              }),
            };
          }
          if (table === 'attendances') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({ data: null }),
              insert: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: { id: 'attendance-subj-header-uuid' },
                error: null,
              }),
            };
          }
          if (table === 'attendance_records') {
            return {
              insert: vi.fn().mockResolvedValue({ error: null }),
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

      const today = new Date().toISOString().split('T')[0];
      const req = new NextRequest('http://localhost/api/attendance', {
        method: 'POST',
        body: JSON.stringify({
          classId: validClassId,
          subjectId: validSubjectId,
          date: today,
          records: [{ studentId: validStudentId, status: 'HADIR' }],
        }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.subjectId).toBe(validSubjectId);
      expect(json.data.subjectName).toBe('Administrasi Infrastruktur Jaringan');
    });
  });

  describe('GET /api/attendance', () => {
    it('should return 400 when query params are missing', async () => {
      vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue({
        id: teacherId,
        email: 'teacher@example.com',
        profile: {
          id: teacherId,
          email: 'teacher@example.com',
          full_name: 'Guru Pengampu',
          role: 'guru',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      const req = new NextRequest('http://localhost/api/attendance?classId=invalid', {
        method: 'GET',
      });

      const res = await GET(req);
      expect(res.status).toBe(400);
    });
  });
});

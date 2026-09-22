import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getSubjects, POST as createSubject } from '@/app/api/subjects/route';
import { GET as getClassSubjects, POST as assignClassSubject } from '@/app/api/class-subjects/route';
import * as sessionModule from '@/lib/auth/session';
import * as supabaseModule from '@/lib/supabase/server';

vi.mock('@/lib/auth/session');
vi.mock('@/lib/supabase/server');

describe('Subjects & Class Subjects API Route Handlers', () => {
  const adminId = '11111111-2222-3333-4444-555555555555';
  const teacherId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  const validClassId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
  const validSubjectId = '22222222-3333-4444-5555-666666666666';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET & POST /api/subjects', () => {
    it('should return subject list for GET', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({
            data: [
              { id: 'subj-1', code: 'AIJ', name: 'Administrasi Infrastruktur Jaringan' },
              { id: 'subj-2', code: 'MTK', name: 'Matematika' },
            ],
            error: null,
          }),
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(supabaseModule, 'createServerSupabaseClient').mockResolvedValue(mockSupabase as any);

      const res = await getSubjects();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.length).toBe(2);
    });

    it('should allow Admin TU to create new subject', async () => {
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
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null }), // Code not taken
          insert: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: { id: 'new-subj-id', code: 'AIJ', name: 'Administrasi Infrastruktur Jaringan' },
            error: null,
          }),
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

      const req = new NextRequest('http://localhost/api/subjects', {
        method: 'POST',
        body: JSON.stringify({
          code: 'aij',
          name: 'Administrasi Infrastruktur Jaringan',
        }),
      });

      const res = await createSubject(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.code).toBe('AIJ');
    });
  });

  describe('POST /api/class-subjects', () => {
    it('should allow Admin TU to assign teacher to class subject', async () => {
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
          if (table === 'profiles') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: { id: teacherId, role: 'guru' },
                error: null,
              }),
            };
          }
          if (table === 'class_subjects') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({ data: null }), // new assignment
              insert: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'assignment-id-1',
                  class_id: validClassId,
                  subject_id: validSubjectId,
                  teacher_id: teacherId,
                  academic_year: '2026/2027',
                },
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

      const req = new NextRequest('http://localhost/api/class-subjects', {
        method: 'POST',
        body: JSON.stringify({
          classId: validClassId,
          subjectId: validSubjectId,
          teacherId: teacherId,
          academicYear: '2026/2027',
        }),
      });

      const res = await assignClassSubject(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.academic_year).toBe('2026/2027');
    });
  });
});

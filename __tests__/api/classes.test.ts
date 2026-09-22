import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getClasses, POST as createClass } from '@/app/api/classes/route';
import * as sessionModule from '@/lib/auth/session';
import * as supabaseModule from '@/lib/supabase/server';

vi.mock('@/lib/auth/session');
vi.mock('@/lib/supabase/server');

describe('Classes API Route Handlers', () => {
  const adminId = '11111111-2222-3333-4444-555555555555';
  const teacherId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  const classId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET & POST /api/classes', () => {
    it('should list classes for GET request', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockImplementation(function () {
            return {
              order: vi.fn().mockResolvedValue({
                data: [
                  { id: classId, name: 'X TKJ 1', grade_level: 10, academic_year: '2026/2027' },
                ],
                error: null,
              }),
            };
          }),
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(supabaseModule, 'createServerSupabaseClient').mockResolvedValue(mockSupabase as any);

      const req = new NextRequest('http://localhost/api/classes');
      const res = await getClasses(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.length).toBe(1);
    });

    it('should create new class for Admin TU', async () => {
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
          if (table === 'classes') {
            return {
              insert: vi.fn().mockReturnThis(),
              select: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: {
                  id: classId,
                  name: 'X TKJ 1',
                  grade_level: 10,
                  academic_year: '2026/2027',
                  homeroom_teacher_id: teacherId,
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

      const req = new NextRequest('http://localhost/api/classes', {
        method: 'POST',
        body: JSON.stringify({
          name: 'X TKJ 1',
          gradeLevel: 10,
          academicYear: '2026/2027',
          homeroomTeacherId: teacherId,
        }),
      });

      const res = await createClass(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.name).toBe('X TKJ 1');
    });
  });
});

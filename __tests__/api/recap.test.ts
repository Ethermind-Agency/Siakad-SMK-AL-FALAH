import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/attendance/recap/route';
import * as sessionModule from '@/lib/auth/session';
import * as supabaseModule from '@/lib/supabase/server';

vi.mock('@/lib/auth/session');
vi.mock('@/lib/supabase/server');

describe('Attendance Recap API Route Handler', () => {
  const validClassId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
  const validStudentId = '11111111-2222-4333-8444-555555555555';
  const teacherId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when user is unauthenticated', async () => {
    vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue(null);

    const req = new NextRequest(`http://localhost/api/attendance/recap?classId=${validClassId}`);
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
  });

  it('should return 400 when neither classId nor studentId is provided', async () => {
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

    const req = new NextRequest('http://localhost/api/attendance/recap?month=9');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it('should return class recap correctly for authorized teacher', async () => {
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
              data: {
                id: validClassId,
                name: 'X TKJ 1',
                academic_year: '2026/2027',
                homeroom_teacher_id: teacherId,
              },
              error: null,
            }),
          };
        }
        if (table === 'students') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({
              data: [
                { id: validStudentId, nisn: '0012345678', full_name: 'Ahmad Siswa', gender: 'L' },
              ],
              error: null,
            }),
          };
        }
        if (table === 'attendances') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            is: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            lte: vi.fn().mockResolvedValue({
              data: [
                {
                  id: 'att-1',
                  date: '2026-09-20',
                  attendance_records: [{ student_id: validStudentId, status: 'HADIR' }],
                },
                {
                  id: 'att-2',
                  date: '2026-09-21',
                  attendance_records: [{ student_id: validStudentId, status: 'HADIR' }],
                },
              ],
              error: null,
            }),
          };
        }
        return {};
      }),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(supabaseModule, 'createServerSupabaseClient').mockResolvedValue(mockSupabase as any);

    const req = new NextRequest(
      `http://localhost/api/attendance/recap?classId=${validClassId}&month=9&year=2026`
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.className).toBe('X TKJ 1');
    expect(json.data.totalEffectiveDays).toBe(2);
    expect(json.data.classOverallPercentage).toBe(100);
    expect(json.data.students[0].stats.hadir).toBe(2);
  });
});

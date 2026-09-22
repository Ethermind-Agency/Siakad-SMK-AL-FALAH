import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as exportAttendance } from '@/app/api/attendance/export/route';
import * as sessionModule from '@/lib/auth/session';
import * as supabaseModule from '@/lib/supabase/server';

vi.mock('@/lib/auth/session');
vi.mock('@/lib/supabase/server');

describe('Attendance Export API Route Handler', () => {
  const adminId = '11111111-2222-3333-4444-555555555555';
  const classId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
  const studentId = '99999999-8888-7777-6666-555555555555';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when user is unauthenticated', async () => {
    vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue(null);

    const req = new NextRequest(`http://localhost/api/attendance/export?classId=${classId}`);
    const res = await exportAttendance(req);
    expect(res.status).toBe(401);
  });

  it('should return 403 when user is siswa_ortu', async () => {
    vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue({
      id: 'user-siswa',
      email: 'siswa@example.com',
      profile: {
        id: 'user-siswa',
        email: 'siswa@example.com',
        full_name: 'Siswa User',
        role: 'siswa_ortu',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    const req = new NextRequest(`http://localhost/api/attendance/export?classId=${classId}`);
    const res = await exportAttendance(req);
    expect(res.status).toBe(403);
  });

  it('should successfully export CSV with attachment headers for authorized Admin TU', async () => {
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
              data: {
                id: classId,
                name: 'X TKJ 1',
                grade_level: 10,
                academic_year: '2026/2027',
                homeroom_teacher_id: adminId,
              },
              error: null,
            }),
          };
        }
        if (table === 'school_profile') {
          return {
            select: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: { name: 'SMKS AL-FALAH', npsn: '69984368' },
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
                { id: studentId, nisn: '0081234567', full_name: 'Ahmad Siswa', gender: 'L' },
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
                  date: '2026-09-01',
                  attendance_records: [{ student_id: studentId, status: 'HADIR' }],
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
      `http://localhost/api/attendance/export?classId=${classId}&month=9&year=2026`
    );
    const res = await exportAttendance(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/csv');
    expect(res.headers.get('content-disposition')).toContain('attachment; filename=');

    const csvText = await res.text();
    expect(csvText).toContain('SMKS AL-FALAH');
    expect(csvText).toContain('X TKJ 1');
    expect(csvText).toContain('Ahmad Siswa');
    expect(csvText).toContain('100%');
  });
});

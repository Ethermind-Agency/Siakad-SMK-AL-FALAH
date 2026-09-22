import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getUsers, POST as createUser } from '@/app/api/users/route';
import * as sessionModule from '@/lib/auth/session';
import * as supabaseModule from '@/lib/supabase/server';

vi.mock('@/lib/auth/session');
vi.mock('@/lib/supabase/server');

describe('Users API Route Handlers', () => {
  const adminId = '11111111-2222-3333-4444-555555555555';
  const teacherUserId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET & POST /api/users', () => {
    it('should return 403 when non-admin tries to list users', async () => {
      vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue({
        id: teacherUserId,
        email: 'guru@example.com',
        profile: {
          id: teacherUserId,
          email: 'guru@example.com',
          full_name: 'Guru',
          role: 'guru',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      const req = new NextRequest('http://localhost/api/users');
      const res = await getUsers(req);
      expect(res.status).toBe(403);
    });

    it('should successfully create user in Supabase Auth and Profiles table for Admin TU', async () => {
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

      const mockAdminClient = {
        auth: {
          admin: {
            createUser: vi.fn().mockResolvedValue({
              data: { user: { id: teacherUserId } },
              error: null,
            }),
          },
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'profiles') {
            return {
              upsert: vi.fn().mockReturnThis(),
              select: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: {
                  id: teacherUserId,
                  email: 'guru.baru@smks-alfalah.sch.id',
                  full_name: 'Guru Baru, S.Pd',
                  role: 'guru',
                },
                error: null,
              }),
            };
          }
          if (table === 'activity_logs') {
            return {
              insert: vi.fn().mockResolvedValue({ error: null }),
            };
          }
          return {};
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(supabaseModule, 'createAdminClient').mockReturnValue(mockAdminClient as any);

      const req = new NextRequest('http://localhost/api/users', {
        method: 'POST',
        body: JSON.stringify({
          email: 'guru.baru@smks-alfalah.sch.id',
          password: 'Password123!',
          fullName: 'Guru Baru, S.Pd',
          role: 'guru',
        }),
      });

      const res = await createUser(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.email).toBe('guru.baru@smks-alfalah.sch.id');
    });
  });
});

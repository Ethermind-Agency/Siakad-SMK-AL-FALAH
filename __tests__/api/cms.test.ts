import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getNews, POST as createNews } from '@/app/api/cms/news/route';
import { GET as getFacilities, POST as createFacility } from '@/app/api/cms/facilities/route';
import { GET as getProfile, PUT as updateProfile } from '@/app/api/cms/profile/route';
import { GET as pingKeepAlive } from '@/app/api/keep-alive/route';
import * as sessionModule from '@/lib/auth/session';
import * as supabaseModule from '@/lib/supabase/server';

vi.mock('@/lib/auth/session');
vi.mock('@/lib/supabase/server');

describe('CMS API Route Handlers', () => {
  const adminId = 'admin-tu-uuid-1111-2222-333344445555';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET & POST /api/cms/news', () => {
    it('should return published news for public users', async () => {
      vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue(null);

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          range: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'news-1',
                title: 'Kegiatan Pramuka',
                slug: 'kegiatan-pramuka',
                status: 'published',
              },
            ],
            count: 1,
            error: null,
          }),
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(supabaseModule, 'createServerSupabaseClient').mockResolvedValue(mockSupabase as any);

      const req = new NextRequest('http://localhost/api/cms/news');
      const res = await getNews(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.items.length).toBe(1);
    });

    it('should allow Admin TU to create news article', async () => {
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
          maybeSingle: vi.fn().mockResolvedValue({ data: null }), // no slug collision
          insert: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'news-uuid-2',
              title: 'Workshop Teknik Komputer Jaringan',
              slug: 'workshop-teknik-komputer-jaringan',
              status: 'published',
            },
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

      const req = new NextRequest('http://localhost/api/cms/news', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Workshop Teknik Komputer Jaringan',
          content: 'Siswa kelas X dan XI mengikuti workshop konfigurasi mikrotik router...',
          excerpt: 'Workshop mikrotik di SMKS AL-FALAH',
          status: 'published',
        }),
      });

      const res = await createNews(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.slug).toBe('workshop-teknik-komputer-jaringan');
    });
  });

  describe('GET /api/cms/facilities', () => {
    it('should return facility list', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({
            data: [
              { id: 'fac-1', name: 'Lab Komputer TKJ', condition: 'baik' },
              { id: 'fac-2', name: 'Ruang Kelas X', condition: 'rusak_sedang' },
            ],
            error: null,
          }),
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(supabaseModule, 'createServerSupabaseClient').mockResolvedValue(mockSupabase as any);

      const res = await getFacilities();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.length).toBe(2);
    });
  });

  describe('GET /api/cms/profile', () => {
    it('should return school profile', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              id: 'prof-1',
              name: 'SMKS AL-FALAH',
              npsn: '69984368',
              vision: 'Visi Sekolah',
              mission: ['Misi 1', 'Misi 2'],
            },
            error: null,
          }),
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(supabaseModule, 'createServerSupabaseClient').mockResolvedValue(mockSupabase as any);

      const res = await getProfile();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.npsn).toBe('69984368');
    });
  });

  describe('GET /api/keep-alive', () => {
    it('should respond with status ok', async () => {
      const mockAdmin = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({ count: 10, error: null }),
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(supabaseModule, 'createAdminClient').mockReturnValue(mockAdmin as any);

      const res = await pingKeepAlive();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.status).toBe('ok');
      expect(json.database).toBe('connected');
    });
  });
});

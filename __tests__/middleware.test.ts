import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware, getRoleHomePath } from '@/middleware';
import * as supabaseMiddleware from '@/lib/supabase/middleware';

vi.mock('@/lib/supabase/middleware');

describe('Next.js Edge Middleware Route Protection & RBAC', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRoleHomePath', () => {
    it('should map roles to their dedicated dashboard homepaths', () => {
      expect(getRoleHomePath('admin_tu')).toBe('/admin');
      expect(getRoleHomePath('kepala_sekolah')).toBe('/kepala-sekolah');
      expect(getRoleHomePath('guru')).toBe('/guru');
      expect(getRoleHomePath('siswa_ortu')).toBe('/siswa');
      expect(getRoleHomePath(undefined)).toBe('/login');
    });
  });

  describe('middleware protection', () => {
    it('should allow public static and API routes without interception', async () => {
      const req = new NextRequest('http://localhost/api/keep-alive');
      const res = await middleware(req);
      expect(res.status).toBe(200);
    });

    it('should redirect unauthenticated users accessing /admin to /login with redirect param', async () => {
      vi.spyOn(supabaseMiddleware, 'updateSession').mockResolvedValue({
        response: {} as any,
        user: null,
      });

      const req = new NextRequest('http://localhost/admin/surat');
      const res = await middleware(req);

      expect(res.status).toBe(307); // Redirect
      expect(res.headers.get('location')).toContain('/login?redirect=%2Fadmin%2Fsurat');
    });

    it('should redirect already logged in user accessing /login to their role home', async () => {
      vi.spyOn(supabaseMiddleware, 'updateSession').mockResolvedValue({
        response: {} as any,
        user: {
          id: 'user-1',
          role: 'guru',
        },
      });

      const req = new NextRequest('http://localhost/login');
      const res = await middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/guru');
    });

    it('should prevent Guru from accessing /admin and redirect to /guru', async () => {
      vi.spyOn(supabaseMiddleware, 'updateSession').mockResolvedValue({
        response: {} as any,
        user: {
          id: 'guru-1',
          role: 'guru',
        },
      });

      const req = new NextRequest('http://localhost/admin/cms');
      const res = await middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/guru');
    });

    it('should allow Admin TU to access /admin routes', async () => {
      vi.spyOn(supabaseMiddleware, 'updateSession').mockResolvedValue({
        response: { status: 200 } as any,
        user: {
          id: 'admin-1',
          role: 'admin_tu',
        },
      });

      const req = new NextRequest('http://localhost/admin/surat');
      const res = await middleware(req);

      expect(res.status).toBe(200);
    });
  });
});

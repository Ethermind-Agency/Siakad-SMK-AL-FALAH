import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as createIncoming, GET as getIncoming } from '@/app/api/letters/incoming/route';
import { POST as createOutgoing, GET as getOutgoing } from '@/app/api/letters/outgoing/route';
import { PATCH as updateStatus } from '@/app/api/letters/[id]/status/route';
import * as sessionModule from '@/lib/auth/session';
import * as supabaseModule from '@/lib/supabase/server';

vi.mock('@/lib/auth/session');
vi.mock('@/lib/supabase/server');

describe('Letters API Route Handlers', () => {
  const adminId = 'admin-tu-uuid-1111-2222-333344445555';
  const principalId = 'kepala-sekolah-uuid-6666-7777-888899990000';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/letters/incoming', () => {
    it('should return 403 when non-admin user attempts to create incoming letter', async () => {
      vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue({
        id: 'guru-id',
        email: 'guru@example.com',
        profile: {
          id: 'guru-id',
          email: 'guru@example.com',
          full_name: 'Guru',
          role: 'guru',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      const req = new NextRequest('http://localhost/api/letters/incoming', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const res = await createIncoming(req);
      expect(res.status).toBe(403);
    });

    it('should successfully record incoming letter for Admin TU', async () => {
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
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'letter-incoming-uuid-1',
              reference_number: '005/DISDIK/IX/2026',
              date: '2026-09-22',
              sender_or_recipient: 'Dinas Pendidikan',
              subject: 'Undangan Rapat',
              status: 'pending',
              created_at: new Date().toISOString(),
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

      const req = new NextRequest('http://localhost/api/letters/incoming', {
        method: 'POST',
        body: JSON.stringify({
          referenceNumber: '005/DISDIK/IX/2026',
          date: '2026-09-22',
          sender: 'Dinas Pendidikan',
          subject: 'Undangan Rapat',
          classificationCode: '005',
        }),
      });

      const res = await createIncoming(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.reference_number).toBe('005/DISDIK/IX/2026');
    });
  });

  describe('POST /api/letters/outgoing', () => {
    it('should generate automatic sequential letter number for outgoing letter', async () => {
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
          if (table === 'letters') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockReturnThis(),
              limit: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({
                data: { sequence_number: 4 }, // previous max sequence was 4
              }),
              insert: vi.fn().mockReturnThis(),
              single: vi.fn().mockImplementation(() =>
                Promise.resolve({
                  data: {
                    id: 'letter-outgoing-uuid-5',
                    reference_number: '421.5/005/SMK-AF/IX/2026',
                    sequence_number: 5,
                    status: 'pending',
                  },
                  error: null,
                })
              ),
            };
          }
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          };
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

      const req = new NextRequest('http://localhost/api/letters/outgoing', {
        method: 'POST',
        body: JSON.stringify({
          date: '2026-09-22',
          recipient: 'Kepala Desa',
          subject: 'Pemberitahuan Praktik Kerja Lapangan',
          classificationCode: '421.5',
        }),
      });

      const res = await createOutgoing(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.reference_number).toBe('421.5/005/SMK-AF/IX/2026');
      expect(json.data.sequence_number).toBe(5);
    });
  });

  describe('PATCH /api/letters/[id]/status', () => {
    it('should allow Kepala Sekolah to approve letter with disposition notes', async () => {
      vi.spyOn(sessionModule, 'getCurrentUser').mockResolvedValue({
        id: principalId,
        email: 'kepala@example.com',
        profile: {
          id: principalId,
          email: 'kepala@example.com',
          full_name: 'Dedi Irawan (Kepala Sekolah)',
          role: 'kepala_sekolah',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      const mockSupabase = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'letters') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'letter-outgoing-uuid-5',
                  reference_number: '421.5/005/SMK-AF/IX/2026',
                  status: 'pending',
                },
                error: null,
              }),
              update: vi.fn().mockReturnThis(),
            };
          }
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          };
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

      const req = new NextRequest('http://localhost/api/letters/letter-outgoing-uuid-5/status', {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'approved',
          dispositionNotes: 'Disetujui untuk dikirimkan segera.',
        }),
      });

      const res = await updateStatus(req, {
        params: Promise.resolve({ id: 'letter-outgoing-uuid-5' }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });
  });
});

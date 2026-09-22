import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { UserRole } from '@/lib/types/database';
import { loginPayloadSchema, getLoginSchemaForRole } from '@/lib/validators/auth';

export const dynamic = 'force-dynamic';

// ─── Demo credential registry ────────────────────────────────────────────────
// Admin TU  : identifier = email, password = any (demo: password123)
// Guru/Kepsek: identifier = NIP,   password = birthdate YYYYMMDD
// Siswa     : identifier = NISN,   password = birthdate YYYYMMDD

interface DemoUser {
  role: UserRole;
  name: string;
  /** canonical email stored in cookie for display; not used as login key */
  email: string;
  /** password that must be supplied; e.g. birthdate or explicit password */
  password: string;
}

const DEMO_USERS_BY_IDENTIFIER: Record<string, DemoUser> = {
  // ── Admin TU (login with email) ──────────────────────────────────────────
  'tu@smk-alfalah.sch.id': {
    role: 'admin_tu',
    name: 'Ibrahim (Operator TU)',
    email: 'tu@smk-alfalah.sch.id',
    password: 'password123',
  },

  // ── Kepala Sekolah (login with NIP) ─────────────────────────────────────
  // NIP: 197509152005011002  — password: birthdate 19750915
  '197509152005011002': {
    role: 'kepala_sekolah',
    name: 'Dedi Irawan, S.Pd (Kepala Sekolah)',
    email: 'kepsek@smk-alfalah.sch.id',
    password: '19750915',
  },

  // ── Guru / Wali Kelas (login with NIP) ──────────────────────────────────
  // NIP: 198509232010011003  — password: birthdate 19850923
  '198509232010011003': {
    role: 'guru',
    name: 'M. Syaifullah, S.Pd (Wali Kelas)',
    email: 'guru@smk-alfalah.sch.id',
    password: '19850923',
  },

  // ── Siswa (login with NISN) ──────────────────────────────────────────────
  // NISN: 0089876543  — password: birthdate 20080512
  '0089876543': {
    role: 'siswa_ortu',
    name: 'Rizki Ramadhan (XII TBSM)',
    email: 'siswa@smk-alfalah.sch.id',
    password: '20080512',
  },
};

// Helper: map role to its canonical home path for redirect
function getRoleRedirectPath(role: UserRole): string {
  switch (role) {
    case 'admin_tu':       return '/admin';
    case 'kepala_sekolah': return '/kepala-sekolah';
    case 'guru':           return '/guru';
    case 'siswa_ortu':     return '/siswa';
    default:               return '/dashboard';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Phase 1: Basic payload validation (non-empty fields) ────────────────
    const payloadResult = loginPayloadSchema.safeParse(body);
    if (!payloadResult.success) {
      const firstError = payloadResult.error.errors[0]?.message ?? 'Input tidak valid.';
      return NextResponse.json({ status: 'error', message: firstError }, { status: 400 });
    }

    const { identifier, password } = payloadResult.data;
    const key = identifier.trim().toLowerCase();

    // ── Phase 2: Look up in demo registry ────────────────────────────────────
    // Try lowercased key first (catches email); then exact case (catches NIP/NISN)
    const matched =
      DEMO_USERS_BY_IDENTIFIER[key] ||
      DEMO_USERS_BY_IDENTIFIER[identifier.trim()];

    if (matched) {
      // ── Phase 3: Role-specific format validation ─────────────────────────
      const roleSchema = getLoginSchemaForRole(matched.role);
      const roleResult = roleSchema.safeParse({ identifier: identifier.trim(), password });
      if (!roleResult.success) {
        const firstError = roleResult.error.errors[0]?.message ?? 'Format identitas atau kata sandi tidak valid.';
        return NextResponse.json({ status: 'error', message: firstError }, { status: 400 });
      }

      // ── Phase 4: Credential match check ─────────────────────────────────
      if (password !== matched.password) {
        return NextResponse.json(
          { status: 'error', message: 'Kata sandi / tanggal lahir tidak sesuai. Periksa kembali.' },
          { status: 401 }
        );
      }

      const userRole = matched.role;
      const redirectTo = getRoleRedirectPath(userRole);

      const response = NextResponse.json({
        status: 'ok',
        message: 'Login berhasil.',
        data: { role: userRole, name: matched.name, email: matched.email, redirectTo },
      });

      const cookieOpts = {
        path: '/',
        httpOnly: false,
        // 30-day persistent session so users (especially students) don't re-login
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax' as const,
      };

      response.cookies.set({ name: 'sims_role', value: userRole, ...cookieOpts });
      response.cookies.set({
        name: 'sims_user',
        value: JSON.stringify({ role: userRole, name: matched.name, email: matched.email }),
        ...cookieOpts,
      });

      return response;
    }

    // ── 2. Fallback: Try real Supabase auth (email-based) if configured ─────
    const hasSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (hasSupabase) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: key,
          password: password || '',
        });

        if (!authError && authData.user) {
          const { data: profile } = await (supabase.from('profiles') as any)
            .select('role, full_name, identifier')
            .eq('id', authData.user.id)
            .single();

          const userRole: UserRole = profile?.role ?? 'admin_tu';
          const userName: string = profile?.full_name ?? 'Pengguna SIMS';
          const redirectTo = getRoleRedirectPath(userRole);

          const response = NextResponse.json({
            status: 'ok',
            message: 'Login berhasil.',
            data: { role: userRole, name: userName, email: authData.user.email, redirectTo },
          });

          const cookieOpts = { path: '/', httpOnly: false, maxAge: 60 * 60 * 24 * 30, sameSite: 'lax' as const };
          response.cookies.set({ name: 'sims_role', value: userRole, ...cookieOpts });
          response.cookies.set({
            name: 'sims_user',
            value: JSON.stringify({ role: userRole, name: userName, email: authData.user.email }),
            ...cookieOpts,
          });

          return response;
        }
      } catch (err) {
        console.warn('Supabase auth error, falling through:', err);
      }
    }

    // ── 3. Nothing matched ──────────────────────────────────────────────────
    return NextResponse.json(
      {
        status: 'error',
        message:
          'Identitas tidak ditemukan. Pastikan email (TU), NIP (Guru/Kepsek), atau NISN (Siswa) yang Anda masukkan benar.',
      },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Login route error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Terjadi kesalahan sistem.' },
      { status: 500 }
    );
  }
}

import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { createUserSchema, userFilterQuerySchema } from '@/lib/validators/users';
import { Profile } from '@/lib/types/database';

export async function GET(req: NextRequest) {
  try {
    // 1. Auth check (Admin TU only)
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role } = currentUser.profile;
    if (role !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat melihat daftar pengguna.', 403);
    }

    // 2. Parse Query Params
    const { searchParams } = new URL(req.url);
    const rawQuery = {
      search: searchParams.get('search') ?? undefined,
      role: searchParams.get('role') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    };

    const validatedQuery = userFilterQuerySchema.parse(rawQuery);
    const { search, role: filterRole, page = 1, limit = 10 } = validatedQuery;

    const supabase = await createServerSupabaseClient();
    let query = (supabase.from('profiles') as any).select('*', { count: 'exact' });

    if (filterRole) {
      query = query.eq('role', filterRole);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,nip_or_nisn.ilike.%${search}%`);
    }

    const offset = (page - 1) * limit;
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: users, count, error: queryError } = await query;

    if (queryError) {
      console.error('Error fetching users:', queryError);
      return errorResponse('Gagal mengambil daftar pengguna', 500);
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return successResponse(
      {
        items: (users ?? []) as Profile[],
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      'Daftar pengguna berhasil diambil',
      200
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'query';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi parameter query gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in GET /api/users:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check (Admin TU only)
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role: adminRole, id: adminId } = currentUser.profile;
    if (adminRole !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat membuat pengguna baru.', 403);
    }

    // 2. Parse & Validate Body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = createUserSchema.parse(body);
    const { email, password, fullName, role: userRole, nipOrNisn, phone } = validatedData;

    const adminClient = createAdminClient();

    // 3. Create User in Supabase Auth via Admin API
    const { data: authUser, error: createAuthError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: userRole,
      },
    });

    if (createAuthError || !authUser.user) {
      console.error('Error creating auth user:', createAuthError);
      return errorResponse(createAuthError?.message || 'Gagal membuat akun otentikasi', 400);
    }

    const newUserId = authUser.user.id;

    // 4. Upsert User Profile Record
    const { data: newProfileRaw, error: profileError } = await (adminClient.from('profiles') as any)
      .upsert({
        id: newUserId,
        email,
        full_name: fullName,
        role: userRole,
        nip_or_nisn: nipOrNisn ?? null,
        phone: phone ?? null,
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (profileError || !newProfileRaw) {
      console.error('Error creating profile for user:', profileError);
      // Rollback auth user creation if profile creation failed
      await adminClient.auth.admin.deleteUser(newUserId);
      return errorResponse('Gagal membuat data profil pengguna', 500);
    }

    // 5. Audit Log (SYS-08)
    try {
      await (adminClient.from('activity_logs') as any).insert({
        user_id: adminId,
        action: 'USER_CREATE',
        details: { created_user_id: newUserId, email, role: userRole, full_name: fullName },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(newProfileRaw as Profile, 'Pengguna berhasil didaftarkan', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi data pengguna gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in POST /api/users:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

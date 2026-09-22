import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { createStudentSchema, studentFilterQuerySchema } from '@/lib/validators/students';
import { Student } from '@/lib/types/database';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role } = currentUser.profile;
    if (role !== 'admin_tu' && role !== 'guru' && role !== 'kepala_sekolah') {
      return errorResponse('Akses ditolak', 403);
    }

    const { searchParams } = new URL(req.url);
    const rawQuery = {
      classId: searchParams.get('classId') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      gender: searchParams.get('gender') ?? undefined,
      isActive: searchParams.get('isActive') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    };

    const validatedQuery = studentFilterQuerySchema.parse(rawQuery);
    const { classId, search, gender, isActive, page = 1, limit = 20 } = validatedQuery;

    const supabase = await createServerSupabaseClient();
    let query = (supabase.from('students') as any).select(
      `
        id,
        nisn,
        full_name,
        class_id,
        parent_user_id,
        gender,
        is_active,
        created_at,
        updated_at,
        classes:class_id (id, name, grade_level, academic_year),
        parents:parent_user_id (id, full_name, email, phone)
      `,
      { count: 'exact' }
    );

    if (classId) {
      query = query.eq('class_id', classId);
    }
    if (gender) {
      query = query.eq('gender', gender);
    }
    if (isActive !== undefined) {
      query = query.eq('is_active', isActive);
    }
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,nisn.ilike.%${search}%`);
    }

    const offset = (page - 1) * limit;
    query = query.order('full_name', { ascending: true }).range(offset, offset + limit - 1);

    const { data: students, count, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching students:', fetchError);
      return errorResponse('Gagal mengambil daftar siswa', 500);
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return successResponse(
      {
        items: (students ?? []) as Student[],
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      'Daftar siswa berhasil diambil',
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

    console.error('Unhandled error in GET /api/students:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role: adminRole, id: adminId } = currentUser.profile;
    if (adminRole !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat mendaftarkan siswa baru.', 403);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = createStudentSchema.parse(body);
    const { nisn, fullName, classId, gender, parentUserId } = validatedData;

    const supabase = await createServerSupabaseClient();

    // Check NISN uniqueness
    const { data: existingStudent } = await (supabase.from('students') as any)
      .select('id')
      .eq('nisn', nisn)
      .maybeSingle();

    if (existingStudent) {
      return errorResponse(`Siswa dengan NISN '${nisn}' sudah terdaftar`, 400);
    }

    // Verify Class
    const { data: classData } = await (supabase.from('classes') as any)
      .select('id')
      .eq('id', classId)
      .single();

    if (!classData) {
      return errorResponse('Kelas tidak ditemukan', 404);
    }

    // Insert Student
    const { data: newStudentRaw, error: insertError } = await (supabase.from('students') as any)
      .insert({
        nisn,
        full_name: fullName,
        class_id: classId,
        gender,
        parent_user_id: parentUserId ?? null,
        is_active: true,
      })
      .select('*')
      .single();

    if (insertError || !newStudentRaw) {
      console.error('Error inserting student:', insertError);
      return errorResponse('Gagal mendaftarkan siswa', 500);
    }

    // Audit Log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: adminId,
        action: 'STUDENT_CREATE',
        details: { student_id: (newStudentRaw as any).id, nisn, full_name: fullName, class_id: classId },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(newStudentRaw as Student, 'Siswa berhasil didaftarkan', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi data siswa gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in POST /api/students:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

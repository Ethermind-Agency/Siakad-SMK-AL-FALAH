import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { createClassSchema, classFilterQuerySchema } from '@/lib/validators/classes';
import { ClassItem } from '@/lib/types/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = {
      academicYear: searchParams.get('academicYear') ?? undefined,
      gradeLevel: searchParams.get('gradeLevel') ?? undefined,
    };

    const validatedQuery = classFilterQuerySchema.parse(rawQuery);
    const { academicYear, gradeLevel } = validatedQuery;

    const supabase = await createServerSupabaseClient();
    let query = (supabase.from('classes') as any).select(`
      id,
      name,
      grade_level,
      academic_year,
      homeroom_teacher_id,
      created_at,
      updated_at,
      profiles:homeroom_teacher_id (id, full_name, email, nip_or_nisn)
    `);

    if (academicYear) {
      query = query.eq('academic_year', academicYear);
    }
    if (gradeLevel) {
      query = query.eq('grade_level', gradeLevel);
    }

    const { data: classes, error: fetchError } = await query.order('grade_level', { ascending: true }).order('name', { ascending: true });

    if (fetchError) {
      console.error('Error fetching classes:', fetchError);
      return errorResponse('Gagal mengambil daftar kelas', 500);
    }

    return successResponse((classes ?? []) as ClassItem[], 'Daftar kelas berhasil diambil', 200);
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

    console.error('Unhandled error in GET /api/classes:', error);
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
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat membuat kelas baru.', 403);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = createClassSchema.parse(body);
    const { name, gradeLevel, academicYear, homeroomTeacherId } = validatedData;

    const supabase = await createServerSupabaseClient();

    // Verify homeroom teacher exists and is Guru
    const { data: teacherProfile } = await (supabase.from('profiles') as any)
      .select('id, role')
      .eq('id', homeroomTeacherId)
      .single();

    if (!teacherProfile || (teacherProfile.role !== 'guru' && teacherProfile.role !== 'admin_tu')) {
      return errorResponse('Wali kelas yang dipilih harus memiliki peran Guru', 400);
    }

    // Insert Class
    const { data: newClassRaw, error: insertError } = await (supabase.from('classes') as any)
      .insert({
        name,
        grade_level: gradeLevel,
        academic_year: academicYear,
        homeroom_teacher_id: homeroomTeacherId,
      })
      .select('*')
      .single();

    if (insertError || !newClassRaw) {
      console.error('Error inserting class:', insertError);
      return errorResponse('Gagal membuat kelas baru', 500);
    }

    // Audit Log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: adminId,
        action: 'CLASS_CREATE',
        details: { class_id: (newClassRaw as any).id, name, academic_year: academicYear },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(newClassRaw as ClassItem, 'Kelas baru berhasil dibuat', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi data kelas gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in POST /api/classes:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { assignClassSubjectSchema } from '@/lib/validators/subjects';
import { ClassSubject } from '@/lib/types/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const teacherId = searchParams.get('teacherId');
    const academicYear = searchParams.get('academicYear');

    const supabase = await createServerSupabaseClient();
    let query = (supabase.from('class_subjects') as any).select(`
      id,
      class_id,
      subject_id,
      teacher_id,
      academic_year,
      created_at,
      classes (id, name, grade_level),
      subjects (id, code, name),
      profiles:teacher_id (id, full_name, email)
    `);

    if (classId) {
      query = query.eq('class_id', classId);
    }
    if (teacherId) {
      query = query.eq('teacher_id', teacherId);
    }
    if (academicYear) {
      query = query.eq('academic_year', academicYear);
    }

    const { data: assignments, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching class subjects:', fetchError);
      return errorResponse('Gagal mengambil daftar penugasan mapel kelas', 500);
    }

    return successResponse(
      assignments ?? [],
      'Daftar penugasan mata pelajaran kelas berhasil diambil',
      200
    );
  } catch (error) {
    console.error('Unhandled error in GET /api/class-subjects:', error);
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

    const { role, id: userId } = currentUser.profile;
    if (role !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat menetapkan penugasan guru mapel.', 403);
    }

    // 2. Parse & Validate Body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = assignClassSubjectSchema.parse(body);
    const { classId, subjectId, teacherId, academicYear } = validatedData;

    const supabase = await createServerSupabaseClient();

    // Verify teacher role
    const { data: teacherProfile } = await (supabase.from('profiles') as any)
      .select('id, role')
      .eq('id', teacherId)
      .single();

    if (!teacherProfile || (teacherProfile.role !== 'guru' && teacherProfile.role !== 'admin_tu')) {
      return errorResponse('User yang ditugaskan harus berstatus Guru', 400);
    }

    // Check existing assignment
    const { data: existingAssignment } = await (supabase.from('class_subjects') as any)
      .select('id')
      .eq('class_id', classId)
      .eq('subject_id', subjectId)
      .eq('academic_year', academicYear)
      .maybeSingle();

    let result: ClassSubject;

    if (existingAssignment) {
      // Update existing teacher assignment
      const { data: updatedRaw, error: updateError } = await (supabase.from('class_subjects') as any)
        .update({
          teacher_id: teacherId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingAssignment.id)
        .select('*')
        .single();

      if (updateError || !updatedRaw) {
        return errorResponse('Gagal memperbarui penugasan guru mapel', 500);
      }
      result = updatedRaw as ClassSubject;
    } else {
      // Insert new assignment
      const { data: insertedRaw, error: insertError } = await (supabase.from('class_subjects') as any)
        .insert({
          class_id: classId,
          subject_id: subjectId,
          teacher_id: teacherId,
          academic_year: academicYear,
        })
        .select('*')
        .single();

      if (insertError || !insertedRaw) {
        return errorResponse('Gagal menetapkan penugasan guru mapel', 500);
      }
      result = insertedRaw as ClassSubject;
    }

    // Audit log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: userId,
        action: 'CLASS_SUBJECT_ASSIGN',
        details: { class_id: classId, subject_id: subjectId, teacher_id: teacherId, academic_year: academicYear },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(result, 'Penugasan guru mapel berhasil disimpan', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi penugasan mapel gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in POST /api/class-subjects:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

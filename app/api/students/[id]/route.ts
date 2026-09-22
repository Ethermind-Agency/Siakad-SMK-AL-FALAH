import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { updateStudentSchema } from '@/lib/validators/students';
import { Student } from '@/lib/types/database';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { id: studentId } = await params;
    if (!studentId) {
      return errorResponse('ID siswa tidak valid', 400);
    }

    const supabase = await createServerSupabaseClient();
    const { data: studentRaw, error: fetchError } = await (supabase.from('students') as any)
      .select(`
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
      `)
      .eq('id', studentId)
      .single();

    if (fetchError || !studentRaw) {
      return errorResponse('Data siswa tidak ditemukan', 404);
    }

    return successResponse(studentRaw, 'Detail siswa berhasil diambil', 200);
  } catch (error) {
    console.error('Unhandled error in GET /api/students/[id]:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role: adminRole, id: adminId } = currentUser.profile;
    if (adminRole !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat memperbarui data siswa.', 403);
    }

    const { id: studentId } = await params;
    if (!studentId) {
      return errorResponse('ID siswa tidak valid', 400);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = updateStudentSchema.parse(body);
    const supabase = await createServerSupabaseClient();

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (validatedData.nisn !== undefined) updatePayload.nisn = validatedData.nisn;
    if (validatedData.fullName !== undefined) updatePayload.full_name = validatedData.fullName;
    if (validatedData.classId !== undefined) updatePayload.class_id = validatedData.classId;
    if (validatedData.gender !== undefined) updatePayload.gender = validatedData.gender;
    if (validatedData.parentUserId !== undefined) updatePayload.parent_user_id = validatedData.parentUserId;
    if (validatedData.isActive !== undefined) updatePayload.is_active = validatedData.isActive;

    const { data: updatedStudentRaw, error: updateError } = await (supabase.from('students') as any)
      .update(updatePayload)
      .eq('id', studentId)
      .select('*')
      .single();

    if (updateError || !updatedStudentRaw) {
      console.error('Error updating student:', updateError);
      return errorResponse('Gagal memperbarui data siswa', 500);
    }

    // Audit Log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: adminId,
        action: 'STUDENT_UPDATE',
        details: { student_id: studentId, updated_fields: Object.keys(updatePayload) },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(updatedStudentRaw as Student, 'Data siswa berhasil diperbarui', 200);
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

    console.error('Unhandled error in PUT /api/students/[id]:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role: adminRole, id: adminId } = currentUser.profile;
    if (adminRole !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat menonaktifkan siswa.', 403);
    }

    const { id: studentId } = await params;
    if (!studentId) {
      return errorResponse('ID siswa tidak valid', 400);
    }

    const supabase = await createServerSupabaseClient();

    // Soft delete student: mark is_active = false
    const { error: deactivateError } = await (supabase.from('students') as any)
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', studentId);

    if (deactivateError) {
      console.error('Error deactivating student:', deactivateError);
      return errorResponse('Gagal menonaktifkan siswa', 500);
    }

    // Audit Log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: adminId,
        action: 'STUDENT_DEACTIVATE',
        details: { student_id: studentId },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse({ id: studentId, is_active: false }, 'Siswa berhasil dinonaktifkan', 200);
  } catch (error) {
    console.error('Unhandled error in DELETE /api/students/[id]:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

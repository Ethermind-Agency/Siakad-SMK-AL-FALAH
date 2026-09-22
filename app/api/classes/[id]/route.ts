import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { updateClassSchema } from '@/lib/validators/classes';
import { ClassItem } from '@/lib/types/database';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: classId } = await params;
    if (!classId) {
      return errorResponse('ID kelas tidak valid', 400);
    }

    const supabase = await createServerSupabaseClient();
    const { data: classRaw, error: fetchError } = await (supabase.from('classes') as any)
      .select(`
        id,
        name,
        grade_level,
        academic_year,
        homeroom_teacher_id,
        created_at,
        updated_at,
        profiles:homeroom_teacher_id (id, full_name, email, phone),
        students (count)
      `)
      .eq('id', classId)
      .single();

    if (fetchError || !classRaw) {
      return errorResponse('Data kelas tidak ditemukan', 404);
    }

    return successResponse(classRaw, 'Detail kelas berhasil diambil', 200);
  } catch (error) {
    console.error('Unhandled error in GET /api/classes/[id]:', error);
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
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat mengubah data kelas.', 403);
    }

    const { id: classId } = await params;
    if (!classId) {
      return errorResponse('ID kelas tidak valid', 400);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = updateClassSchema.parse(body);
    const supabase = await createServerSupabaseClient();

    // If changing homeroom teacher, verify role
    if (validatedData.homeroomTeacherId) {
      const { data: teacherProfile } = await (supabase.from('profiles') as any)
        .select('id, role')
        .eq('id', validatedData.homeroomTeacherId)
        .single();

      if (!teacherProfile || (teacherProfile.role !== 'guru' && teacherProfile.role !== 'admin_tu')) {
        return errorResponse('Wali kelas yang dipilih harus memiliki peran Guru', 400);
      }
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (validatedData.name !== undefined) updatePayload.name = validatedData.name;
    if (validatedData.gradeLevel !== undefined) updatePayload.grade_level = validatedData.gradeLevel;
    if (validatedData.academicYear !== undefined) updatePayload.academic_year = validatedData.academicYear;
    if (validatedData.homeroomTeacherId !== undefined) {
      updatePayload.homeroom_teacher_id = validatedData.homeroomTeacherId;
    }

    const { data: updatedClassRaw, error: updateError } = await (supabase.from('classes') as any)
      .update(updatePayload)
      .eq('id', classId)
      .select('*')
      .single();

    if (updateError || !updatedClassRaw) {
      console.error('Error updating class:', updateError);
      return errorResponse('Gagal memperbarui data kelas', 500);
    }

    // Audit Log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: adminId,
        action: 'CLASS_UPDATE',
        details: { class_id: classId, updated_fields: Object.keys(updatePayload) },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(updatedClassRaw as ClassItem, 'Data kelas berhasil diperbarui', 200);
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

    console.error('Unhandled error in PUT /api/classes/[id]:', error);
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
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat menghapus kelas.', 403);
    }

    const { id: classId } = await params;
    if (!classId) {
      return errorResponse('ID kelas tidak valid', 400);
    }

    const supabase = await createServerSupabaseClient();

    // Check if class has active students
    const { count: studentCount } = await (supabase.from('students') as any)
      .select('id', { count: 'exact', head: true })
      .eq('class_id', classId)
      .eq('is_active', true);

    if (studentCount && studentCount > 0) {
      return errorResponse('Tidak dapat menghapus kelas yang masih memiliki siswa aktif terdaftar.', 400);
    }

    const { error: deleteError } = await (supabase.from('classes') as any)
      .delete()
      .eq('id', classId);

    if (deleteError) {
      console.error('Error deleting class:', deleteError);
      return errorResponse('Gagal menghapus data kelas', 500);
    }

    // Audit Log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: adminId,
        action: 'CLASS_DELETE',
        details: { class_id: classId },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse({ id: classId }, 'Data kelas berhasil dihapus', 200);
  } catch (error) {
    console.error('Unhandled error in DELETE /api/classes/[id]:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

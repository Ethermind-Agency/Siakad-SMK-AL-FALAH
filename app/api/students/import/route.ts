import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { importStudentsSchema } from '@/lib/validators/students';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check (Admin TU only)
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role: adminRole, id: adminId } = currentUser.profile;
    if (adminRole !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat melakukan import data siswa.', 403);
    }

    // 2. Parse & Validate Body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = importStudentsSchema.parse(body);
    const { classId, students } = validatedData;

    const supabase = await createServerSupabaseClient();

    // 3. Verify Class Exists
    const { data: classData } = await (supabase.from('classes') as any)
      .select('id, name')
      .eq('id', classId)
      .single();

    if (!classData) {
      return errorResponse('Data kelas tidak ditemukan', 404);
    }

    // 4. Check for existing NISNs in database
    const nisnList = students.map((s) => s.nisn);
    const { data: existingStudents } = await (supabase.from('students') as any)
      .select('nisn')
      .in('nisn', nisnList);

    if (existingStudents && existingStudents.length > 0) {
      const duplicateNisns = existingStudents.map((e: any) => e.nisn);
      return errorResponse(
        `Import gagal. Ditemukan NISN yang sudah terdaftar di sistem: ${duplicateNisns.join(', ')}`,
        400
      );
    }

    // 5. Batch Insert Students
    const recordsToInsert = students.map((s) => ({
      nisn: s.nisn,
      full_name: s.fullName,
      class_id: classId,
      gender: s.gender,
      is_active: true,
    }));

    const { data: insertedStudentsRaw, error: insertError } = await (supabase.from('students') as any)
      .insert(recordsToInsert)
      .select('id, nisn, full_name, gender');

    if (insertError || !insertedStudentsRaw) {
      console.error('Error during batch student import:', insertError);
      return errorResponse('Gagal melakukan import data siswa ke database', 500);
    }

    // 6. Audit Log (SYS-08)
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: adminId,
        action: 'STUDENT_BATCH_IMPORT',
        details: {
          class_id: classId,
          class_name: classData.name,
          total_imported: insertedStudentsRaw.length,
        },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(
      {
        classId,
        className: classData.name,
        totalImported: insertedStudentsRaw.length,
        students: insertedStudentsRaw,
      },
      `Berhasil mengimpor ${insertedStudentsRaw.length} data siswa ke kelas ${classData.name}`,
      201
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi data import siswa gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in POST /api/students/import:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

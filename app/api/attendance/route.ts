import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import {
  submitAttendanceSchema,
  getAttendanceQuerySchema,
} from '@/lib/validators/attendance';
import {
  isDateValidForAttendance,
  isModificationAllowed,
  calculateAttendanceStats,
} from '@/lib/utils/attendance-calc';
import { ClassItem, Student } from '@/lib/types/database';

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication & Role Authorization
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role, id: userId } = currentUser.profile;
    if (role !== 'guru' && role !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Guru atau Admin TU yang dapat menginput absensi.', 403);
    }

    // 2. Parse and Validate Request Body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = submitAttendanceSchema.parse(body);
    const { classId, subjectId, date, records } = validatedData;

    // 3. Date Validation (cannot mark future attendance)
    if (!isDateValidForAttendance(date)) {
      return errorResponse('Tanggal absensi tidak boleh di masa mendatang', 400);
    }

    const supabase = await createServerSupabaseClient();

    // 4. Verify Class
    const { data: classDataRaw, error: classError } = await (supabase.from('classes') as any)
      .select('id, name, homeroom_teacher_id')
      .eq('id', classId)
      .single();

    if (classError || !classDataRaw) {
      return errorResponse('Data kelas tidak ditemukan', 404);
    }

    const classData = classDataRaw as Pick<ClassItem, 'id' | 'name' | 'homeroom_teacher_id'>;

    // 4b. RBAC: Subject Teacher vs Homeroom Teacher Permission Check
    let subjectName: string | undefined;
    if (subjectId) {
      // Absensi per Mapel: Check if subject exists and user is assigned
      const { data: subjectData } = await (supabase.from('subjects') as any)
        .select('id, name')
        .eq('id', subjectId)
        .single();

      if (!subjectData) {
        return errorResponse('Mata pelajaran tidak ditemukan', 404);
      }
      subjectName = subjectData.name;

      if (role === 'guru') {
        const { data: assignment } = await (supabase.from('class_subjects') as any)
          .select('id')
          .eq('class_id', classId)
          .eq('subject_id', subjectId)
          .eq('teacher_id', userId)
          .maybeSingle();

        if (!assignment) {
          return errorResponse(
            'Akses ditolak. Anda tidak ditugaskan sebagai guru pengampu mata pelajaran ini di kelas terkait.',
            403
          );
        }
      }
    } else {
      // Absensi Harian: Check homeroom teacher
      if (role === 'guru' && classData.homeroom_teacher_id !== userId) {
        return errorResponse('Akses ditolak. Anda hanya dapat mengisi absensi harian untuk kelas yang Anda ampu.', 403);
      }
    }

    // 5. Verify All Students Belong to the Class and are Active
    const studentIds = records.map((r) => r.studentId);
    const { data: validStudentsRaw, error: studentsError } = await (supabase.from('students') as any)
      .select('id')
      .eq('class_id', classId)
      .eq('is_active', true)
      .in('id', studentIds);

    if (studentsError) {
      return errorResponse('Gagal memverifikasi daftar siswa', 500);
    }

    const validStudents = (validStudentsRaw ?? []) as Pick<Student, 'id'>[];

    if (validStudents.length !== studentIds.length) {
      return errorResponse(
        'Satu atau lebih siswa tidak terdaftar di kelas ini atau berstatus tidak aktif',
        400
      );
    }

    // 6. Check for Existing Attendance for (classId, subjectId, date)
    let existingQuery = (supabase.from('attendances') as any)
      .select('id, date, created_at')
      .eq('class_id', classId)
      .eq('date', date);

    if (subjectId) {
      existingQuery = existingQuery.eq('subject_id', subjectId);
    } else {
      existingQuery = existingQuery.is('subject_id', null);
    }

    const { data: existingAttendanceRaw } = await existingQuery.maybeSingle();

    let attendanceId: string;
    let isUpdate = false;

    if (existingAttendanceRaw) {
      const existingAttendance = existingAttendanceRaw as { id: string; date: string; created_at: string };

      // ABS-02 & ABS-03: Modification rules
      if (!isModificationAllowed(date)) {
        return errorResponse(
          'Batas waktu pengubahan absensi telah lewat. Absensi hanya dapat diubah pada hari yang sama sebelum pukul 23:59.',
          403
        );
      }

      attendanceId = existingAttendance.id;
      isUpdate = true;

      // Update timestamp and recorder
      const { error: updateAttendanceError } = await (supabase.from('attendances') as any)
        .update({
          recorded_by: userId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', attendanceId);

      if (updateAttendanceError) {
        return errorResponse('Gagal memperbarui header absensi', 500);
      }

      // Delete old records before batch inserting updated records
      const { error: deleteRecordsError } = await (supabase.from('attendance_records') as any)
        .delete()
        .eq('attendance_id', attendanceId);

      if (deleteRecordsError) {
        return errorResponse('Gagal membersihkan data absensi sebelumnya', 500);
      }
    } else {
      // Insert new attendance header
      const { data: newAttendanceRaw, error: insertAttendanceError } = await (supabase.from('attendances') as any)
        .insert({
          class_id: classId,
          subject_id: subjectId ?? null,
          date,
          recorded_by: userId,
        })
        .select('id')
        .single();

      if (insertAttendanceError || !newAttendanceRaw) {
        return errorResponse('Gagal membuat catatan absensi baru', 500);
      }

      const newAttendance = newAttendanceRaw as { id: string };
      attendanceId = newAttendance.id;
    }

    // 7. Insert Batch Attendance Records
    const recordsToInsert = records.map((r) => ({
      attendance_id: attendanceId,
      student_id: r.studentId,
      status: r.status,
      notes: r.notes ?? null,
    }));

    const { error: insertRecordsError } = await (supabase.from('attendance_records') as any)
      .insert(recordsToInsert);

    if (insertRecordsError) {
      return errorResponse('Gagal menyimpan detail presensi siswa', 500);
    }

    // 8. Audit Log (SYS-08)
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: userId,
        action: isUpdate ? 'ATTENDANCE_UPDATE' : 'ATTENDANCE_SUBMIT',
        details: {
          attendance_id: attendanceId,
          class_id: classId,
          class_name: classData.name,
          subject_id: subjectId ?? null,
          subject_name: subjectName ?? 'Absensi Harian',
          date,
          total_records: records.length,
          stats: calculateAttendanceStats(records.map((r) => r.status)),
        },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    const stats = calculateAttendanceStats(records.map((r) => r.status));

    return successResponse(
      {
        attendanceId,
        classId,
        className: classData.name,
        subjectId: subjectId ?? null,
        subjectName: subjectName ?? null,
        date,
        isUpdate,
        stats,
      },
      isUpdate ? 'Data absensi berhasil diperbarui' : 'Data absensi berhasil disimpan',
      isUpdate ? 200 : 201
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi input gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in POST /api/attendance:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role, id: userId } = currentUser.profile;

    // 2. Parse Query Parameters
    const { searchParams } = new URL(req.url);
    const queryParams = {
      classId: searchParams.get('classId') ?? undefined,
      subjectId: searchParams.get('subjectId') ?? undefined,
      date: searchParams.get('date') ?? undefined,
    };

    const validatedQuery = getAttendanceQuerySchema.parse(queryParams);
    const { classId, subjectId, date } = validatedQuery;

    const supabase = await createServerSupabaseClient();

    // 3. Class Verification
    const { data: classDataRaw, error: classError } = await (supabase.from('classes') as any)
      .select('id, name, grade_level, academic_year, homeroom_teacher_id')
      .eq('id', classId)
      .single();

    if (classError || !classDataRaw) {
      return errorResponse('Data kelas tidak ditemukan', 404);
    }

    const classData = classDataRaw as ClassItem;

    // 4. Fetch Attendance Header & Detail Records
    let query = (supabase.from('attendances') as any)
      .select(`
        id,
        date,
        subject_id,
        recorded_by,
        created_at,
        updated_at,
        profiles:recorded_by (full_name),
        subjects (id, code, name),
        attendance_records (
          id,
          student_id,
          status,
          notes,
          students (
            id,
            nisn,
            full_name,
            gender,
            parent_user_id
          )
        )
      `)
      .eq('class_id', classId)
      .eq('date', date);

    if (subjectId) {
      query = query.eq('subject_id', subjectId);
    } else {
      query = query.is('subject_id', null);
    }

    const { data: attendanceDataRaw, error: attendanceError } = await query.maybeSingle();

    if (attendanceError) {
      return errorResponse('Gagal mengambil data absensi', 500);
    }

    const attendanceData = attendanceDataRaw as any;

    if (!attendanceData) {
      return successResponse(
        {
          class: classData,
          subjectId: subjectId ?? null,
          date,
          hasData: false,
          attendance: null,
          records: [],
        },
        'Belum ada data presensi untuk kelas dan tanggal ini',
        200
      );
    }

    // If role is siswa_ortu, filter to only their student (PRD SYS-05)
    let records = attendanceData.attendance_records ?? [];
    if (role === 'siswa_ortu') {
      records = records.filter(
        (r: any) => r.students?.parent_user_id === userId || r.students?.id === userId
      );
    }

    return successResponse(
      {
        class: classData,
        subject: attendanceData.subjects ?? null,
        date,
        hasData: true,
        attendanceId: attendanceData.id,
        recordedBy: attendanceData.profiles,
        updatedAt: attendanceData.updated_at,
        records,
      },
      'Data absensi berhasil diambil',
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

    console.error('Unhandled error in GET /api/attendance:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

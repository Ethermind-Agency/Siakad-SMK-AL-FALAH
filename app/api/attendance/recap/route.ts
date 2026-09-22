import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { getRecapQuerySchema } from '@/lib/validators/attendance';
import { calculateAttendanceStats } from '@/lib/utils/attendance-calc';
import { AttendanceStatus, ClassItem, Student } from '@/lib/types/database';
import {
  StudentRecapItem,
  ClassAttendanceRecapResponse,
  IndividualStudentRecapResponse,
} from '@/lib/types/api';

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role, id: userId } = currentUser.profile;

    // 2. Parse and Validate Query Parameters
    const { searchParams } = new URL(req.url);
    const rawQuery = {
      classId: searchParams.get('classId') ?? undefined,
      subjectId: searchParams.get('subjectId') ?? undefined,
      studentId: searchParams.get('studentId') ?? undefined,
      startDate: searchParams.get('startDate') ?? undefined,
      endDate: searchParams.get('endDate') ?? undefined,
      month: searchParams.get('month') ?? undefined,
      year: searchParams.get('year') ?? undefined,
    };

    const validatedQuery = getRecapQuerySchema.parse(rawQuery);
    const { classId, subjectId, studentId, startDate, endDate, month, year } = validatedQuery;

    const supabase = await createServerSupabaseClient();

    // Fetch subject details if requested
    let subjectName: string | undefined;
    if (subjectId) {
      const { data: subjectData } = await (supabase.from('subjects') as any)
        .select('name')
        .eq('id', subjectId)
        .single();
      subjectName = subjectData?.name;
    }

    // 3. Scenario A: Individual Student Recap Request
    if (studentId) {
      const { data: studentRaw, error: studentError } = await (supabase.from('students') as any)
        .select(`
          id,
          nisn,
          full_name,
          parent_user_id,
          classes:class_id (
            id,
            name,
            homeroom_teacher_id
          )
        `)
        .eq('id', studentId)
        .single();

      if (studentError || !studentRaw) {
        return errorResponse('Data siswa tidak ditemukan', 404);
      }

      const student = studentRaw as any;
      const studentClass = student.classes;

      if (role === 'siswa_ortu' && student.parent_user_id !== userId && student.id !== userId) {
        return errorResponse('Akses ditolak. Anda hanya dapat melihat rekap absensi diri sendiri atau anak Anda.', 403);
      }

      // Query attendance records for this student
      let recordsQuery = (supabase.from('attendance_records') as any)
        .select(`
          id,
          status,
          notes,
          attendances!inner (
            date,
            subject_id
          )
        `)
        .eq('student_id', studentId);

      if (subjectId) {
        recordsQuery = recordsQuery.eq('attendances.subject_id', subjectId);
      } else {
        recordsQuery = recordsQuery.is('attendances.subject_id', null);
      }

      if (startDate) {
        recordsQuery = recordsQuery.gte('attendances.date', startDate);
      }
      if (endDate) {
        recordsQuery = recordsQuery.lte('attendances.date', endDate);
      }
      if (month && year) {
        const monthStr = month.toString().padStart(2, '0');
        const startOfMonth = `${year}-${monthStr}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const endOfMonth = `${year}-${monthStr}-${lastDay.toString().padStart(2, '0')}`;
        recordsQuery = recordsQuery.gte('attendances.date', startOfMonth).lte('attendances.date', endOfMonth);
      }

      const { data: recordsData, error: recordsError } = await recordsQuery;

      if (recordsError) {
        return errorResponse('Gagal mengambil catatan absensi siswa', 500);
      }

      const formattedRecords = ((recordsData as any[]) || []).map((r: any) => ({
        date: r.attendances?.date as string,
        status: r.status as AttendanceStatus,
        notes: (r.notes ?? null) as string | null,
      })).sort((a, b) => a.date.localeCompare(b.date));

      const stats = calculateAttendanceStats(formattedRecords.map((r) => r.status));

      const responseData: IndividualStudentRecapResponse = {
        studentId: student.id,
        nisn: student.nisn,
        fullName: student.full_name,
        className: studentClass?.name ?? '-',
        subjectId: subjectId ?? undefined,
        subjectName: subjectName ?? undefined,
        period: {
          startDate,
          endDate,
          month,
          year,
        },
        stats,
        records: formattedRecords,
      };

      return successResponse(responseData, 'Rekap absensi siswa berhasil diambil', 200);
    }

    // 4. Scenario B: Class Attendance Recap Request
    if (classId) {
      const { data: classDataRaw, error: classError } = await (supabase.from('classes') as any)
        .select('id, name, academic_year, homeroom_teacher_id')
        .eq('id', classId)
        .single();

      if (classError || !classDataRaw) {
        return errorResponse('Data kelas tidak ditemukan', 404);
      }

      const classData = classDataRaw as Pick<ClassItem, 'id' | 'name' | 'academic_year' | 'homeroom_teacher_id'>;

      if (role === 'siswa_ortu') {
        return errorResponse(
          'Akses ditolak. Akun siswa/orang tua hanya dapat mengakses rekap individual via parameter studentId.',
          403
        );
      }

      const { data: studentsRaw, error: studentsError } = await (supabase.from('students') as any)
        .select('id, nisn, full_name, gender')
        .eq('class_id', classId)
        .eq('is_active', true)
        .order('full_name', { ascending: true });

      if (studentsError || !studentsRaw) {
        return errorResponse('Gagal mengambil daftar siswa kelas', 500);
      }

      const students = studentsRaw as Pick<Student, 'id' | 'nisn' | 'full_name' | 'gender'>[];

      // Query attendance headers for the date range
      let attendancesQuery = (supabase.from('attendances') as any)
        .select(`
          id,
          date,
          subject_id,
          attendance_records (
            student_id,
            status
          )
        `)
        .eq('class_id', classId);

      if (subjectId) {
        attendancesQuery = attendancesQuery.eq('subject_id', subjectId);
      } else {
        attendancesQuery = attendancesQuery.is('subject_id', null);
      }

      if (startDate) {
        attendancesQuery = attendancesQuery.gte('date', startDate);
      }
      if (endDate) {
        attendancesQuery = attendancesQuery.lte('date', endDate);
      }
      if (month && year) {
        const monthStr = month.toString().padStart(2, '0');
        const startOfMonth = `${year}-${monthStr}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const endOfMonth = `${year}-${monthStr}-${lastDay.toString().padStart(2, '0')}`;
        attendancesQuery = attendancesQuery.gte('date', startOfMonth).lte('date', endOfMonth);
      }

      const { data: attendancesDataRaw, error: attendancesError } = await attendancesQuery;

      if (attendancesError) {
        return errorResponse('Gagal mengambil data presensi kelas', 500);
      }

      const attendancesData = (attendancesDataRaw as any[]) || [];
      const totalEffectiveDays = attendancesData.length;

      const studentStatusesMap = new Map<string, AttendanceStatus[]>();
      students.forEach((s) => studentStatusesMap.set(s.id, []));

      attendancesData.forEach((att: any) => {
        att.attendance_records?.forEach((rec: any) => {
          const arr = studentStatusesMap.get(rec.student_id);
          if (arr) {
            arr.push(rec.status as AttendanceStatus);
          }
        });
      });

      let sumPercentages = 0;
      const studentRecaps: StudentRecapItem[] = students.map((s) => {
        const statuses = studentStatusesMap.get(s.id) || [];
        const stats = calculateAttendanceStats(statuses);
        sumPercentages += stats.percentage;

        return {
          studentId: s.id,
          nisn: s.nisn,
          fullName: s.full_name,
          gender: s.gender,
          stats,
        };
      });

      const classOverallPercentage =
        studentRecaps.length > 0
          ? Math.round((sumPercentages / studentRecaps.length) * 100) / 100
          : 0;

      const responseData: ClassAttendanceRecapResponse = {
        classId: classData.id,
        className: classData.name,
        subjectId: subjectId ?? undefined,
        subjectName: subjectName ?? undefined,
        academicYear: classData.academic_year,
        period: {
          startDate,
          endDate,
          month,
          year,
        },
        totalEffectiveDays,
        classOverallPercentage,
        students: studentRecaps,
      };

      return successResponse(responseData, 'Rekap absensi kelas berhasil diambil', 200);
    }

    return errorResponse('Parameter classId atau studentId harus disediakan', 400);
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

    console.error('Unhandled error in GET /api/attendance/recap:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

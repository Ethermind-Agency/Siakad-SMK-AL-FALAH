import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { errorResponse } from '@/lib/utils/api-response';
import { exportAttendanceQuerySchema } from '@/lib/validators/export';
import { calculateAttendanceStats } from '@/lib/utils/attendance-calc';
import { generateAttendanceCsv } from '@/lib/utils/csv-exporter';
import { AttendanceStatus, ClassItem, Student } from '@/lib/types/database';
import { StudentRecapItem } from '@/lib/types/api';

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication & RBAC Check
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role, id: userId } = currentUser.profile;
    if (role !== 'admin_tu' && role !== 'kepala_sekolah' && role !== 'guru') {
      return errorResponse('Akses ditolak. Siswa/Orang tua tidak memiliki izin untuk mengekspor rekap kelas.', 403);
    }

    // 2. Parse & Validate Query Parameters
    const { searchParams } = new URL(req.url);
    const rawQuery = {
      classId: searchParams.get('classId') ?? undefined,
      subjectId: searchParams.get('subjectId') ?? undefined,
      startDate: searchParams.get('startDate') ?? undefined,
      endDate: searchParams.get('endDate') ?? undefined,
      month: searchParams.get('month') ?? undefined,
      year: searchParams.get('year') ?? undefined,
      format: searchParams.get('format') ?? undefined,
    };

    const validatedQuery = exportAttendanceQuerySchema.parse(rawQuery);
    const { classId, subjectId, startDate, endDate, month, year } = validatedQuery;

    const supabase = await createServerSupabaseClient();

    // 3. Fetch Class Data
    const { data: classDataRaw, error: classError } = await (supabase.from('classes') as any)
      .select('id, name, grade_level, academic_year, homeroom_teacher_id')
      .eq('id', classId)
      .single();

    if (classError || !classDataRaw) {
      return errorResponse('Data kelas tidak ditemukan', 404);
    }

    const classData = classDataRaw as ClassItem;

    // RBAC check for Guru role
    let subjectName: string | undefined;
    if (subjectId) {
      const { data: subjectData } = await (supabase.from('subjects') as any)
        .select('name')
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

        if (!assignment && classData.homeroom_teacher_id !== userId) {
          return errorResponse('Akses ditolak. Anda bukan guru pengampu atau wali kelas terkait.', 403);
        }
      }
    } else {
      if (role === 'guru' && classData.homeroom_teacher_id !== userId) {
        return errorResponse('Akses ditolak. Anda hanya dapat mengekspor rekap kelas yang Anda ampu.', 403);
      }
    }

    // 4. Fetch School Profile for Header Metadata
    const { data: schoolProfileRaw } = await (supabase.from('school_profile') as any)
      .select('name, npsn')
      .limit(1)
      .maybeSingle();

    const schoolName = schoolProfileRaw?.name ?? 'SMKS AL-FALAH';
    const npsn = schoolProfileRaw?.npsn ?? '69984368';

    // 5. Fetch Class Students
    const { data: studentsRaw, error: studentsError } = await (supabase.from('students') as any)
      .select('id, nisn, full_name, gender')
      .eq('class_id', classId)
      .eq('is_active', true)
      .order('full_name', { ascending: true });

    if (studentsError || !studentsRaw) {
      return errorResponse('Gagal mengambil daftar siswa kelas', 500);
    }

    const students = studentsRaw as Pick<Student, 'id' | 'nisn' | 'full_name' | 'gender'>[];

    // 6. Query Attendance Records
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

    let periodLabel = 'Semua Periode';
    if (startDate && endDate) {
      attendancesQuery = attendancesQuery.gte('date', startDate).lte('date', endDate);
      periodLabel = `${startDate} s/d ${endDate}`;
    } else if (month && year) {
      const monthStr = month.toString().padStart(2, '0');
      const startOfMonth = `${year}-${monthStr}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endOfMonth = `${year}-${monthStr}-${lastDay.toString().padStart(2, '0')}`;
      attendancesQuery = attendancesQuery.gte('date', startOfMonth).lte('date', endOfMonth);
      periodLabel = `Bulan ${monthStr}/${year}`;
    }

    const { data: attendancesDataRaw, error: attendancesError } = await attendancesQuery;

    if (attendancesError) {
      console.error('Error querying attendances for export:', attendancesError);
      return errorResponse('Gagal mengambil data absensi untuk diekspor', 500);
    }

    const attendancesData = (attendancesDataRaw as any[]) || [];
    const totalEffectiveDays = attendancesData.length;

    // 7. Calculate Student Stats
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

    // 8. Generate CSV String
    const csvContent = generateAttendanceCsv({
      schoolName,
      npsn,
      className: classData.name,
      subjectName,
      academicYear: classData.academic_year,
      periodLabel,
      totalEffectiveDays,
      classOverallPercentage,
      students: studentRecaps,
    });

    // 9. Format Filename
    const sanitizedClassName = classData.name.replace(/[^a-zA-Z0-9]/g, '_');
    const sanitizedSubject = (subjectName ?? 'Harian').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `rekap_absensi_${sanitizedClassName}_${sanitizedSubject}_${Date.now()}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'query';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi parameter ekspor gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in GET /api/attendance/export:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

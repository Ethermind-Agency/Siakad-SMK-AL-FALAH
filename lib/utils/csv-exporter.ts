import { StudentRecapItem } from '@/lib/types/api';

export interface AttendanceCsvExportOptions {
  schoolName: string;
  npsn: string;
  className: string;
  subjectName?: string;
  academicYear: string;
  periodLabel: string;
  totalEffectiveDays: number;
  classOverallPercentage: number;
  students: StudentRecapItem[];
}

/**
 * Escapes a cell value for CSV format.
 * If the value contains commas, quotes, or newlines, it wraps it in double quotes and escapes inner quotes.
 */
export function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Formats attendance recap data into an official CSV report string with UTF-8 BOM for Microsoft Excel.
 */
export function generateAttendanceCsv(options: AttendanceCsvExportOptions): string {
  const {
    schoolName,
    npsn,
    className,
    subjectName,
    academicYear,
    periodLabel,
    totalEffectiveDays,
    classOverallPercentage,
    students,
  } = options;

  const lines: string[] = [];

  // 1. School Header Metadata
  lines.push(`LAPORAN REKAPITULASI PRESENSI SISWA`);
  lines.push(`${escapeCsvCell(schoolName)} (NPSN: ${escapeCsvCell(npsn)})`);
  lines.push(``);
  lines.push(`Kelas,${escapeCsvCell(className)}`);
  lines.push(`Tahun Ajaran,${escapeCsvCell(academicYear)}`);
  lines.push(`Mata Pelajaran,${escapeCsvCell(subjectName ?? 'Absensi Harian')}`);
  lines.push(`Periode,${escapeCsvCell(periodLabel)}`);
  lines.push(`Total Hari/Sesi KBM,${totalEffectiveDays}`);
  lines.push(``);

  // 2. Table Column Headers
  lines.push(
    `No,NISN,Nama Siswa,L/P,Hadir (H),Izin (I),Sakit (S),Alpa (A),Total Presensi,Persentase Kehadiran (%)`
  );

  // 3. Student Records Rows
  students.forEach((student, index) => {
    const row = [
      index + 1,
      escapeCsvCell(student.nisn),
      escapeCsvCell(student.fullName),
      student.gender,
      student.stats.hadir,
      student.stats.izin,
      student.stats.sakit,
      student.stats.alpa,
      student.stats.total,
      `${student.stats.percentage}%`,
    ];
    lines.push(row.join(','));
  });

  // 4. Summary Footer Row
  lines.push(``);
  lines.push(`Rata-rata Kehadiran Kelas,,,,,,,,,${classOverallPercentage}%`);

  // Prefix with UTF-8 BOM (\uFEFF) for Excel compatibility
  return '\uFEFF' + lines.join('\r\n');
}

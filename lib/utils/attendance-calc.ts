import { AttendanceStatus } from '@/lib/types/database';
import { AttendanceSummaryStat } from '@/lib/types/api';

/**
 * Calculates attendance statistics and percentage.
 * Formula: Attendance Rate (%) = ((Hadir + Izin) / Total Effective Days) * 100
 * Or strictly Hadir based on policy. In SMKS standard: Hadir counts as 100%, Izin/Sakit may be excused, Alpa is unexcused absence.
 * Standardized formula: percentage = (hadir / total) * 100 (rounded to 2 decimal places).
 */
export function calculateAttendanceStats(statuses: AttendanceStatus[]): AttendanceSummaryStat {
  const total = statuses.length;
  if (total === 0) {
    return {
      total: 0,
      hadir: 0,
      izin: 0,
      sakit: 0,
      alpa: 0,
      percentage: 0,
    };
  }

  let hadir = 0;
  let izin = 0;
  let sakit = 0;
  let alpa = 0;

  for (const status of statuses) {
    switch (status) {
      case 'HADIR':
        hadir++;
        break;
      case 'IZIN':
        izin++;
        break;
      case 'SAKIT':
        sakit++;
        break;
      case 'ALPA':
        alpa++;
        break;
    }
  }

  // Attendance rate calculation (Hadir percentage)
  const percentage = Math.round((hadir / total) * 10000) / 100;

  return {
    total,
    hadir,
    izin,
    sakit,
    alpa,
    percentage,
  };
}

/**
 * Validates if the given date string is today or before today (cannot mark attendance in the future).
 */
export function isDateValidForAttendance(dateStr: string): boolean {
  const inputDate = new Date(dateStr);
  if (isNaN(inputDate.getTime())) return false;

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return inputDate <= today;
}

/**
 * Checks if modification is allowed on the given attendance date (e.g. within current day before 23:59).
 */
export function isModificationAllowed(attendanceDate: string): boolean {
  const todayStr = new Date().toISOString().split('T')[0];
  return attendanceDate === todayStr;
}

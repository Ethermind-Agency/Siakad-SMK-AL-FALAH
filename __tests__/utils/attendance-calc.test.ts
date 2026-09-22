import { describe, it, expect } from 'vitest';
import {
  calculateAttendanceStats,
  isDateValidForAttendance,
  isModificationAllowed,
} from '@/lib/utils/attendance-calc';
import { AttendanceStatus } from '@/lib/types/database';

describe('Attendance Calculation & Date Utilities', () => {
  describe('calculateAttendanceStats', () => {
    it('should return 0 stats for empty status array', () => {
      const stats = calculateAttendanceStats([]);
      expect(stats).toEqual({
        total: 0,
        hadir: 0,
        izin: 0,
        sakit: 0,
        alpa: 0,
        percentage: 0,
      });
    });

    it('should calculate 100% when all statuses are HADIR', () => {
      const statuses: AttendanceStatus[] = ['HADIR', 'HADIR', 'HADIR', 'HADIR'];
      const stats = calculateAttendanceStats(statuses);
      expect(stats).toEqual({
        total: 4,
        hadir: 4,
        izin: 0,
        sakit: 0,
        alpa: 0,
        percentage: 100,
      });
    });

    it('should accurately calculate percentages for mixed attendance statuses', () => {
      // 10 entries: 7 HADIR, 1 IZIN, 1 SAKIT, 1 ALPA -> 70%
      const statuses: AttendanceStatus[] = [
        'HADIR',
        'HADIR',
        'HADIR',
        'HADIR',
        'HADIR',
        'HADIR',
        'HADIR',
        'IZIN',
        'SAKIT',
        'ALPA',
      ];
      const stats = calculateAttendanceStats(statuses);
      expect(stats.total).toBe(10);
      expect(stats.hadir).toBe(7);
      expect(stats.izin).toBe(1);
      expect(stats.sakit).toBe(1);
      expect(stats.alpa).toBe(1);
      expect(stats.percentage).toBe(70);
    });

    it('should calculate 0% when there is no HADIR', () => {
      const statuses: AttendanceStatus[] = ['ALPA', 'ALPA', 'SAKIT', 'IZIN'];
      const stats = calculateAttendanceStats(statuses);
      expect(stats.total).toBe(4);
      expect(stats.hadir).toBe(0);
      expect(stats.percentage).toBe(0);
    });
  });

  describe('isDateValidForAttendance', () => {
    it('should accept current date and past dates', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(isDateValidForAttendance(today)).toBe(true);
      expect(isDateValidForAttendance('2020-01-01')).toBe(true);
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const futureDateStr = futureDate.toISOString().split('T')[0];
      expect(isDateValidForAttendance(futureDateStr)).toBe(false);
    });

    it('should reject malformed date strings', () => {
      expect(isDateValidForAttendance('invalid-date')).toBe(false);
    });
  });

  describe('isModificationAllowed', () => {
    it('should allow modification only for today date', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(isModificationAllowed(today)).toBe(true);
      expect(isModificationAllowed('2020-01-01')).toBe(false);
    });
  });
});

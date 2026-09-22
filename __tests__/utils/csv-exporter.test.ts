import { describe, it, expect } from 'vitest';
import { escapeCsvCell, generateAttendanceCsv } from '@/lib/utils/csv-exporter';

describe('CSV Exporter Utility', () => {
  describe('escapeCsvCell', () => {
    it('should leave normal strings unchanged', () => {
      expect(escapeCsvCell('Ahmad Dahlan')).toBe('Ahmad Dahlan');
      expect(escapeCsvCell(100)).toBe('100');
    });

    it('should wrap in quotes and escape internal double quotes when string contains commas or quotes', () => {
      expect(escapeCsvCell('Budi, S.Kom')).toBe('"Budi, S.Kom"');
      expect(escapeCsvCell('Kata "Kunci"')).toBe('"Kata ""Kunci"""');
    });

    it('should handle null and undefined safely', () => {
      expect(escapeCsvCell(null)).toBe('');
      expect(escapeCsvCell(undefined)).toBe('');
    });
  });

  describe('generateAttendanceCsv', () => {
    it('should generate properly formatted CSV string with UTF-8 BOM and student records', () => {
      const csv = generateAttendanceCsv({
        schoolName: 'SMKS AL-FALAH',
        npsn: '69984368',
        className: 'X TKJ 1',
        academicYear: '2026/2027',
        periodLabel: 'Bulan 09/2026',
        totalEffectiveDays: 20,
        classOverallPercentage: 95.5,
        students: [
          {
            studentId: 'st-1',
            nisn: '0081234567',
            fullName: 'Ahmad, Siswa',
            gender: 'L',
            stats: {
              total: 20,
              hadir: 19,
              izin: 1,
              sakit: 0,
              alpa: 0,
              percentage: 95,
            },
          },
        ],
      });

      // Starts with UTF-8 BOM
      expect(csv.charCodeAt(0)).toBe(0xfeff);

      // Contains header info
      expect(csv).toContain('SMKS AL-FALAH');
      expect(csv).toContain('69984368');
      expect(csv).toContain('X TKJ 1');
      expect(csv).toContain('"Ahmad, Siswa"');
      expect(csv).toContain('95.5%');
    });
  });
});

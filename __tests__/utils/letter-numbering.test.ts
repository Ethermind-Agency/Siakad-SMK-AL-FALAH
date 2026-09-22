import { describe, it, expect } from 'vitest';
import { getRomanMonth, formatOutgoingLetterNumber } from '@/lib/utils/letter-numbering';

describe('Letter Numbering Utilities', () => {
  describe('getRomanMonth', () => {
    it('should correctly convert months 1 through 12 to Roman numerals', () => {
      expect(getRomanMonth(1)).toBe('I');
      expect(getRomanMonth(2)).toBe('II');
      expect(getRomanMonth(3)).toBe('III');
      expect(getRomanMonth(4)).toBe('IV');
      expect(getRomanMonth(5)).toBe('V');
      expect(getRomanMonth(6)).toBe('VI');
      expect(getRomanMonth(7)).toBe('VII');
      expect(getRomanMonth(8)).toBe('VIII');
      expect(getRomanMonth(9)).toBe('IX');
      expect(getRomanMonth(10)).toBe('X');
      expect(getRomanMonth(11)).toBe('XI');
      expect(getRomanMonth(12)).toBe('XII');
    });

    it('should throw an error for invalid month numbers', () => {
      expect(() => getRomanMonth(0)).toThrow();
      expect(() => getRomanMonth(13)).toThrow();
      expect(() => getRomanMonth(-1)).toThrow();
    });
  });

  describe('formatOutgoingLetterNumber', () => {
    it('should format outgoing letter number accurately with 3-digit padding', () => {
      const result1 = formatOutgoingLetterNumber('421.5', 1, 9, 2026);
      expect(result1).toBe('421.5/001/SMK-AF/IX/2026');

      const result2 = formatOutgoingLetterNumber('005', 42, 1, 2026);
      expect(result2).toBe('005/042/SMK-AF/I/2026');

      const result3 = formatOutgoingLetterNumber('800', 123, 12, 2026);
      expect(result3).toBe('800/123/SMK-AF/XII/2026');
    });
  });
});

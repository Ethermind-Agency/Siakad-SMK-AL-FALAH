import { describe, it, expect } from 'vitest';
import { slugify } from '@/lib/utils/slug';

describe('Slug Utilities', () => {
  it('should transform standard text into clean lowercase slug', () => {
    expect(slugify('Peringatan Hari Guru Nasional 2026')).toBe('peringatan-hari-guru-nasional-2026');
  });

  it('should remove special characters and punctuation', () => {
    expect(slugify('Selamat & Sukses! Lomba LKS SMK Tingkat Provinsi (Kalbar) #1')).toBe(
      'selamat-sukses-lomba-lks-smk-tingkat-provinsi-kalbar-1'
    );
  });

  it('should handle diacritics and multiple whitespace', () => {
    expect(slugify('  Sosialisasi    Kurikulum  Merdeka  ')).toBe('sosialisasi-kurikulum-merdeka');
  });
});

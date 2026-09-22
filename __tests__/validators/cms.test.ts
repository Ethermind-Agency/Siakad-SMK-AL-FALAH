import { describe, it, expect } from 'vitest';
import {
  createNewsSchema,
  createFacilitySchema,
  updateSchoolProfileSchema,
  newsFilterQuerySchema,
} from '@/lib/validators/cms';

describe('CMS Zod Validators', () => {
  describe('createNewsSchema', () => {
    it('should validate valid news article data', () => {
      const payload = {
        title: 'Pembagian Raport Semester Ganjil',
        content: 'Kegiatan pembagian raport akan dilaksanakan pada hari Sabtu...',
        excerpt: 'Jadwal pembagian raport semester ganjil',
        featuredImageUrl: 'https://supabase.co/storage/v1/object/public/news/raport.jpg',
        status: 'published',
      };

      const result = createNewsSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should fail when title or content is too short', () => {
      const payload = {
        title: 'Hi',
        content: 'Short',
      };

      const result = createNewsSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('createFacilitySchema', () => {
    it('should validate valid facility data', () => {
      const payload = {
        name: 'Bengkel Praktik TBSM',
        description: 'Bengkel praktik kejuruan teknik dan bisnis sepeda motor',
        condition: 'baik',
        imageUrl: 'https://supabase.co/storage/v1/object/public/facilities/bengkel.jpg',
      };

      const result = createFacilitySchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should reject invalid condition string', () => {
      const payload = {
        name: 'Laboratorium Komputer',
        condition: 'hancur', // invalid condition
      };

      const result = createFacilitySchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('updateSchoolProfileSchema', () => {
    it('should validate partial school profile update', () => {
      const payload = {
        vision: 'Mencetak generasi unggul dan berakhlak mulia di Kalimantan Barat',
        mission: ['Meningkatkan mutu pengajaran', 'Membangun jejaring industri'],
        email: 'kontak@smks-alfalah.sch.id',
      };

      const result = updateSchoolProfileSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should fail on malformed email format', () => {
      const payload = {
        email: 'not-an-email',
      };

      const result = updateSchoolProfileSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('newsFilterQuerySchema', () => {
    it('should accept valid filter parameters', () => {
      const result = newsFilterQuerySchema.safeParse({
        search: 'LKS',
        status: 'published',
        page: '2',
        limit: '15',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(15);
      }
    });
  });
});

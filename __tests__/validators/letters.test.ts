import { describe, it, expect } from 'vitest';
import {
  createIncomingLetterSchema,
  createOutgoingLetterSchema,
  updateLetterStatusSchema,
  letterFilterQuerySchema,
} from '@/lib/validators/letters';

describe('Letter Zod Validators', () => {
  describe('createIncomingLetterSchema', () => {
    it('should validate valid incoming letter payload', () => {
      const payload = {
        referenceNumber: '005/DISDIK/IX/2026',
        date: '2026-09-22',
        sender: 'Dinas Pendidikan Kab. Kubu Raya',
        subject: 'Undangan Sosialisasi Akreditasi',
        classificationCode: '005',
        summary: 'Menghadiri rapat persiapan akreditasi',
        fileUrl: 'https://supabase.co/storage/v1/object/public/letters/doc.pdf',
        fileSizeBytes: 1024 * 1024,
      };

      const result = createIncomingLetterSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.referenceNumber).toBe('005/DISDIK/IX/2026');
      }
    });

    it('should fail when referenceNumber or sender is too short', () => {
      const payload = {
        referenceNumber: 'a',
        date: '2026-09-22',
        sender: 'b',
        subject: 'Perihal',
        classificationCode: '005',
      };

      const result = createIncomingLetterSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should fail when fileSizeBytes exceeds 5MB', () => {
      const payload = {
        referenceNumber: '005/DISDIK/IX/2026',
        date: '2026-09-22',
        sender: 'Dinas Pendidikan',
        subject: 'Undangan',
        classificationCode: '005',
        fileSizeBytes: 6 * 1024 * 1024, // 6MB
      };

      const result = createIncomingLetterSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('createOutgoingLetterSchema', () => {
    it('should validate valid outgoing letter payload', () => {
      const payload = {
        date: '2026-09-22',
        recipient: 'Kepala Desa Sungai Deras',
        subject: 'Pemberitahuan Kegiatan PKL Siswa',
        classificationCode: '421.5',
        summary: 'Rencana pelaksanaan PKL periode Oktober - Desember',
      };

      const result = createOutgoingLetterSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should fail when date is invalid format', () => {
      const payload = {
        date: '22-09-2026',
        recipient: 'Kepala Desa',
        subject: 'Pemberitahuan',
        classificationCode: '421.5',
      };

      const result = createOutgoingLetterSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('updateLetterStatusSchema', () => {
    it('should accept valid status with disposition notes', () => {
      const payload = {
        status: 'approved',
        dispositionNotes: 'Disetujui untuk diproses dan dicetak',
      };

      const result = updateLetterStatusSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status string', () => {
      const payload = {
        status: 'invalid_status',
      };

      const result = updateLetterStatusSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('letterFilterQuerySchema', () => {
    it('should parse and apply default pagination values', () => {
      const query = {
        search: 'Undangan',
        status: 'pending',
      };

      const result = letterFilterQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });
  });
});

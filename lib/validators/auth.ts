/**
 * lib/validators/auth.ts
 *
 * Zod schemas for SIMS login credential validation.
 *
 * Rules per role:
 *  - admin_tu       → identifier: email, password: ≥6 chars
 *  - kepala_sekolah → identifier: NIP (18 digit numeric), password: birthdate YYYYMMDD
 *  - guru           → identifier: NIP (18 digit numeric), password: birthdate YYYYMMDD
 *  - siswa_ortu     → identifier: NISN (exactly 10 digit numeric), password: birthdate YYYYMMDD
 *
 * These schemas are safe to import in both server (API routes) and client
 * (login page) code because they have zero server-side dependencies.
 */

import { z } from 'zod';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Validates a birthdate string in YYYYMMDD format as a real calendar date. */
function isValidBirthdate(value: string): boolean {
  // Must be exactly 8 digits
  if (!/^\d{8}$/.test(value)) return false;

  const year = parseInt(value.slice(0, 4), 10);
  const month = parseInt(value.slice(4, 6), 10);
  const day = parseInt(value.slice(6, 8), 10);

  // Reasonable range for school staff / students
  if (year < 1940 || year > 2020) return false;
  if (month < 1 || month > 12) return false;

  // Check actual days in month (handles leap years)
  const lastDay = new Date(year, month, 0).getDate();
  if (day < 1 || day > lastDay) return false;

  return true;
}

// ── Atomic field schemas ──────────────────────────────────────────────────────

/**
 * NIP — Nomor Induk Pegawai
 * Standard BKN format: 18 numeric characters
 * Format: YYYYMMDD YYYYMM GG NNNN  (no spaces stored)
 * Example: 197509152005011002
 */
export const nipSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, { message: 'NIP hanya boleh berisi angka.' })
  .length(18, { message: 'NIP harus tepat 18 digit angka sesuai format BKN.' });

/**
 * NISN — Nomor Induk Siswa Nasional
 * Exactly 10 numeric digits (national standard Kemdikbudristek).
 * May start with 0 (e.g., 0089876543).
 */
export const nisnSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, { message: 'NISN hanya boleh berisi angka.' })
  .length(10, { message: 'NISN harus tepat 10 digit angka.' });

/**
 * Birthdate password — format YYYYMMDD
 * Used as the default password for Guru, Kepala Sekolah, and Siswa.
 */
export const birthdatePasswordSchema = z
  .string()
  .trim()
  .regex(/^\d{8}$/, { message: 'Tanggal lahir harus 8 digit angka (YYYYMMDD, contoh: 19850923).' })
  .refine(isValidBirthdate, {
    message: 'Tanggal lahir tidak valid. Periksa tahun (1940–2020), bulan (01–12), dan hari.',
  });

/**
 * Admin TU email identifier.
 */
export const emailIdentifierSchema = z
  .string()
  .trim()
  .email({ message: 'Format email tidak valid (contoh: tu@smk-alfalah.sch.id).' })
  .toLowerCase();

/**
 * Admin TU password — free-form, min 6 chars.
 */
export const adminPasswordSchema = z
  .string()
  .min(6, { message: 'Kata sandi minimal 6 karakter.' })
  .max(100, { message: 'Kata sandi terlalu panjang.' });

// ── Composite login schemas ───────────────────────────────────────────────────

/** Login schema for Admin / Operator TU */
export const loginAdminTuSchema = z.object({
  identifier: emailIdentifierSchema,
  password: adminPasswordSchema,
});

/** Login schema for Kepala Sekolah */
export const loginKepalaSekolahSchema = z.object({
  identifier: nipSchema,
  password: birthdatePasswordSchema,
});

/** Login schema for Guru / Wali Kelas */
export const loginGuruSchema = z.object({
  identifier: nipSchema,
  password: birthdatePasswordSchema,
});

/** Login schema for Siswa / Orang Tua */
export const loginSiswaSchema = z.object({
  identifier: nisnSchema,
  password: birthdatePasswordSchema,
});

// ── Generic login payload schema ──────────────────────────────────────────────

/**
 * Minimal schema used at the API level before role is known.
 * Enforces only that both fields are non-empty strings.
 * Role-specific validation happens after the identifier lookup.
 */
export const loginPayloadSchema = z.object({
  identifier: z.string().trim().min(1, { message: 'Identitas (Email / NIP / NISN) wajib diisi.' }),
  password: z.string().min(1, { message: 'Kata sandi wajib diisi.' }),
});

// ── Client-side per-role validator ────────────────────────────────────────────

import type { UserRole } from '@/lib/types/database';

/**
 * Returns a role-specific Zod schema for client-side validation.
 * Call `.safeParse({ identifier, password })` on the result.
 */
export function getLoginSchemaForRole(role: UserRole) {
  switch (role) {
    case 'admin_tu':       return loginAdminTuSchema;
    case 'kepala_sekolah': return loginKepalaSekolahSchema;
    case 'guru':           return loginGuruSchema;
    case 'siswa_ortu':     return loginSiswaSchema;
    default:               return loginPayloadSchema;
  }
}

export type LoginPayload = z.infer<typeof loginPayloadSchema>;

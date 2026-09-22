import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_MIME_TYPES = ['application/pdf'];

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication & RBAC (Admin TU & Kepala Sekolah)
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role } = currentUser.profile;
    if (role !== 'admin_tu' && role !== 'kepala_sekolah') {
      return errorResponse('Akses ditolak. Anda tidak memiliki izin untuk mengunggah dokumen surat.', 403);
    }

    // 2. Parse Multipart Form Data
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return errorResponse('Format form data tidak valid', 400);
    }

    const file = formData.get('file') as File | null;
    if (!file) {
      return errorResponse('Berkas PDF tidak ditemukan dalam form submission', 400);
    }

    // 3. Server-side File Validation (SRT-10)
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return errorResponse('Format berkas tidak didukung. Hanya berkas PDF (.pdf) yang diperbolehkan.', 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse('Ukuran berkas melebihi batas maksimum 5MB.', 400);
    }

    if (file.size === 0) {
      return errorResponse('Berkas tidak boleh kosong (0 bytes).', 400);
    }

    // 4. Generate Unique Filename & Path
    const timestamp = Date.now();
    const sanitizedOriginalName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase();
    const storagePath = `letters/${timestamp}-${sanitizedOriginalName}`;

    // Convert file to ArrayBuffer/Buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 5. Upload to Supabase Storage Bucket 'letters' (SYS-06)
    const supabase = await createServerSupabaseClient();
    const { error: uploadError } = await supabase.storage
      .from('letters')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading file to Supabase Storage:', uploadError);
      return errorResponse('Gagal mengunggah berkas ke cloud storage', 500);
    }

    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from('letters')
      .getPublicUrl(storagePath);

    return successResponse(
      {
        fileName: file.name,
        storagePath,
        fileUrl: publicUrlData.publicUrl,
        fileSizeBytes: file.size,
        mimeType: file.type,
      },
      'Berkas PDF berhasil diunggah',
      201
    );
  } catch (error) {
    console.error('Unhandled error in POST /api/upload/letter-file:', error);
    return errorResponse('Terjadi kesalahan internal pada server saat mengunggah berkas', 500);
  }
}

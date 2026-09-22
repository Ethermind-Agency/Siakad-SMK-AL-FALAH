import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB limit before compression
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_BUCKETS = ['gallery', 'facilities', 'news', 'general'];

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check (Admin TU)
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role } = currentUser.profile;
    if (role !== 'admin_tu' && role !== 'kepala_sekolah') {
      return errorResponse('Akses ditolak. Anda tidak memiliki izin untuk mengunggah media gambar.', 403);
    }

    // 2. Parse Form Data
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return errorResponse('Format form data tidak valid', 400);
    }

    const file = formData.get('file') as File | null;
    const requestedBucket = (formData.get('bucket') as string | null) ?? 'gallery';

    if (!file) {
      return errorResponse('Berkas gambar tidak ditemukan', 400);
    }

    const bucket = ALLOWED_BUCKETS.includes(requestedBucket) ? requestedBucket : 'gallery';

    // 3. Server-side Image Validation (CMS-10, CMS-13)
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return errorResponse('Format gambar tidak didukung. Gunakan format JPEG, PNG, atau WebP.', 400);
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return errorResponse('Ukuran gambar melebihi batas maksimum 10MB.', 400);
    }

    if (file.size === 0) {
      return errorResponse('Berkas gambar kosong (0 bytes).', 400);
    }

    // 4. Generate Path
    const timestamp = Date.now();
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase();
    const storagePath = `${timestamp}-${sanitizedName}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 5. Upload to Supabase Storage
    const supabase = await createServerSupabaseClient();
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading image to Supabase Storage:', uploadError);
      return errorResponse('Gagal mengunggah gambar ke cloud storage', 500);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    return successResponse(
      {
        fileName: file.name,
        bucket,
        storagePath,
        fileUrl: publicUrlData.publicUrl,
        fileSizeBytes: file.size,
        mimeType: file.type,
      },
      'Gambar berhasil diunggah',
      201
    );
  } catch (error) {
    console.error('Unhandled error in POST /api/upload/image:', error);
    return errorResponse('Terjadi kesalahan internal pada server saat mengunggah gambar', 500);
  }
}

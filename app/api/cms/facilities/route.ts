import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { createFacilitySchema } from '@/lib/validators/cms';
import { Facility } from '@/lib/types/database';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: facilities, error: fetchError } = await (supabase.from('facilities') as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching facilities:', fetchError);
      return errorResponse('Gagal mengambil daftar fasilitas', 500);
    }

    return successResponse(
      (facilities ?? []) as Facility[],
      'Daftar fasilitas sekolah berhasil diambil',
      200
    );
  } catch (error) {
    console.error('Unhandled error in GET /api/cms/facilities:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role, id: userId } = currentUser.profile;
    if (role !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat menambahkan fasilitas.', 403);
    }

    // 2. Body validation
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = createFacilitySchema.parse(body);
    const { name, description, condition, imageUrl } = validatedData;

    const supabase = await createServerSupabaseClient();
    const { data: newFacilityRaw, error: insertError } = await (supabase.from('facilities') as any)
      .insert({
        name,
        description: description ?? null,
        condition,
        image_url: imageUrl ?? null,
      })
      .select('*')
      .single();

    if (insertError || !newFacilityRaw) {
      console.error('Error inserting facility:', insertError);
      return errorResponse('Gagal menambahkan fasilitas', 500);
    }

    // 3. Audit log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: userId,
        action: 'FACILITY_CREATE',
        details: { facility_id: (newFacilityRaw as any).id, name },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(newFacilityRaw as Facility, 'Fasilitas berhasil ditambahkan', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi data fasilitas gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in POST /api/cms/facilities:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

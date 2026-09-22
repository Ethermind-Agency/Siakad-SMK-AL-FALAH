import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { updateFacilitySchema } from '@/lib/validators/cms';
import { Facility } from '@/lib/types/database';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role, id: userId } = currentUser.profile;
    if (role !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat mengubah fasilitas.', 403);
    }

    const { id: facilityId } = await params;
    if (!facilityId) {
      return errorResponse('ID fasilitas tidak valid', 400);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = updateFacilitySchema.parse(body);
    const supabase = await createServerSupabaseClient();

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (validatedData.name !== undefined) updatePayload.name = validatedData.name;
    if (validatedData.description !== undefined) updatePayload.description = validatedData.description;
    if (validatedData.condition !== undefined) updatePayload.condition = validatedData.condition;
    if (validatedData.imageUrl !== undefined) updatePayload.image_url = validatedData.imageUrl;

    const { data: updatedFacilityRaw, error: updateError } = await (supabase.from('facilities') as any)
      .update(updatePayload)
      .eq('id', facilityId)
      .select('*')
      .single();

    if (updateError || !updatedFacilityRaw) {
      console.error('Error updating facility:', updateError);
      return errorResponse('Gagal memperbarui fasilitas', 500);
    }

    // Audit log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: userId,
        action: 'FACILITY_UPDATE',
        details: { facility_id: facilityId, updated_fields: Object.keys(updatePayload) },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(updatedFacilityRaw as Facility, 'Fasilitas berhasil diperbarui', 200);
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

    console.error('Unhandled error in PUT /api/cms/facilities/[id]:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role, id: userId } = currentUser.profile;
    if (role !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat menghapus fasilitas.', 403);
    }

    const { id: facilityId } = await params;
    if (!facilityId) {
      return errorResponse('ID fasilitas tidak valid', 400);
    }

    const supabase = await createServerSupabaseClient();
    const { error: deleteError } = await (supabase.from('facilities') as any)
      .delete()
      .eq('id', facilityId);

    if (deleteError) {
      console.error('Error deleting facility:', deleteError);
      return errorResponse('Gagal menghapus fasilitas', 500);
    }

    // Audit log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: userId,
        action: 'FACILITY_DELETE',
        details: { facility_id: facilityId },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse({ id: facilityId }, 'Fasilitas berhasil dihapus', 200);
  } catch (error) {
    console.error('Unhandled error in DELETE /api/cms/facilities/[id]:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

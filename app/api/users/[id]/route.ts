import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { updateUserSchema } from '@/lib/validators/users';
import { Profile } from '@/lib/types/database';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { id: targetUserId } = await params;
    const { role, id: currentUserId } = currentUser.profile;

    // Only Admin TU or the user themselves can view their user details
    if (role !== 'admin_tu' && currentUserId !== targetUserId) {
      return errorResponse('Akses ditolak', 403);
    }

    const supabase = await createServerSupabaseClient();
    const { data: profileRaw, error: fetchError } = await (supabase.from('profiles') as any)
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (fetchError || !profileRaw) {
      return errorResponse('Pengguna tidak ditemukan', 404);
    }

    return successResponse(profileRaw as Profile, 'Detail pengguna berhasil diambil', 200);
  } catch (error) {
    console.error('Unhandled error in GET /api/users/[id]:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { id: targetUserId } = await params;
    const { role: adminRole, id: adminId } = currentUser.profile;

    if (adminRole !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat mengubah akun pengguna.', 403);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = updateUserSchema.parse(body);
    const { fullName, role: newRole, nipOrNisn, phone, password } = validatedData;

    const adminClient = createAdminClient();

    // Update Auth User password if requested
    if (password) {
      const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(
        targetUserId,
        { password }
      );

      if (authUpdateError) {
        return errorResponse('Gagal memperbarui kata sandi akun', 500);
      }
    }

    // Update Profile Record
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (fullName !== undefined) updatePayload.full_name = fullName;
    if (newRole !== undefined) updatePayload.role = newRole;
    if (nipOrNisn !== undefined) updatePayload.nip_or_nisn = nipOrNisn;
    if (phone !== undefined) updatePayload.phone = phone;

    const { data: updatedProfileRaw, error: profileUpdateError } = await (adminClient.from('profiles') as any)
      .update(updatePayload)
      .eq('id', targetUserId)
      .select('*')
      .single();

    if (profileUpdateError || !updatedProfileRaw) {
      return errorResponse('Gagal memperbarui data profil pengguna', 500);
    }

    // Audit Log
    try {
      await (adminClient.from('activity_logs') as any).insert({
        user_id: adminId,
        action: 'USER_UPDATE',
        details: { target_user_id: targetUserId, updated_fields: Object.keys(updatePayload) },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(updatedProfileRaw as Profile, 'Pengguna berhasil diperbarui', 200);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi update pengguna gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in PUT /api/users/[id]:', error);
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

    const { id: targetUserId } = await params;
    const { role: adminRole, id: adminId } = currentUser.profile;

    if (adminRole !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat menghapus akun pengguna.', 403);
    }

    if (targetUserId === adminId) {
      return errorResponse('Tidak dapat menghapus akun sendiri', 400);
    }

    const adminClient = createAdminClient();

    // Delete Auth User (cascades or delete profile)
    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(targetUserId);

    if (deleteAuthError) {
      console.error('Error deleting auth user:', deleteAuthError);
      return errorResponse('Gagal menghapus pengguna dari autentikasi', 500);
    }

    // Delete Profile Record
    await (adminClient.from('profiles') as any).delete().eq('id', targetUserId);

    // Audit Log
    try {
      await (adminClient.from('activity_logs') as any).insert({
        user_id: adminId,
        action: 'USER_DELETE',
        details: { deleted_user_id: targetUserId },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse({ id: targetUserId }, 'Pengguna berhasil dihapus', 200);
  } catch (error) {
    console.error('Unhandled error in DELETE /api/users/[id]:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

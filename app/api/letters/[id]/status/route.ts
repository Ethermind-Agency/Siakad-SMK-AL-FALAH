import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { updateLetterStatusSchema } from '@/lib/validators/letters';
import { Letter, LetterStatus } from '@/lib/types/database';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authentication & RBAC (Kepala Sekolah & Admin TU)
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role, id: userId } = currentUser.profile;
    if (role !== 'kepala_sekolah' && role !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Kepala Sekolah atau Admin TU yang dapat memperbarui status surat.', 403);
    }

    const { id: letterId } = await params;
    if (!letterId) {
      return errorResponse('ID surat tidak valid', 400);
    }

    // 2. Parse & Validate Body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = updateLetterStatusSchema.parse(body);
    const { status: newStatus, dispositionNotes } = validatedData;

    const supabase = await createServerSupabaseClient();

    // 3. Check Existing Letter
    const { data: existingLetterRaw, error: fetchError } = await (supabase.from('letters') as any)
      .select('*')
      .eq('id', letterId)
      .single();

    if (fetchError || !existingLetterRaw) {
      return errorResponse('Surat tidak ditemukan', 404);
    }

    const existingLetter = existingLetterRaw as Letter;
    const oldStatus = existingLetter.status;

    // RBAC Business Rules:
    // - Only Kepala Sekolah can set status to 'approved' or 'rejected' and give official disposition
    if ((newStatus === 'approved' || newStatus === 'rejected') && role !== 'kepala_sekolah') {
      return errorResponse('Akses ditolak. Hanya Kepala Sekolah yang berwenang menyetujui atau menolak surat.', 403);
    }

    // - Only Admin TU / Kepala Sekolah can archive an approved letter
    if (newStatus === 'archived' && oldStatus !== 'approved' && oldStatus !== 'pending') {
      return errorResponse('Hanya surat yang telah disetujui atau terdaftar yang dapat diarsipkan.', 400);
    }

    // 4. Update Letter
    const updatePayload: Record<string, any> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (dispositionNotes !== undefined) {
      updatePayload.disposition_notes = dispositionNotes;
      if (role === 'kepala_sekolah') {
        updatePayload.disposition_by = userId;
      }
    }

    const { data: updatedLetterRaw, error: updateError } = await (supabase.from('letters') as any)
      .update(updatePayload)
      .eq('id', letterId)
      .select('*')
      .single();

    if (updateError || !updatedLetterRaw) {
      console.error('Error updating letter status:', updateError);
      return errorResponse('Gagal memperbarui status surat', 500);
    }

    const updatedLetter = updatedLetterRaw as Letter;

    // 5. Record Status History (SRT-09 Audit Trail)
    try {
      await (supabase.from('letter_status_histories') as any).insert({
        letter_id: letterId,
        from_status: oldStatus,
        to_status: newStatus,
        changed_by: userId,
        notes: dispositionNotes ?? `Status diubah dari ${oldStatus} menjadi ${newStatus}`,
      });
    } catch (histErr) {
      console.warn('Failed to insert letter status history:', histErr);
    }

    // 6. Audit Log (SYS-08)
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: userId,
        action: 'LETTER_STATUS_CHANGE',
        details: {
          letter_id: letterId,
          reference_number: existingLetter.reference_number,
          from_status: oldStatus,
          to_status: newStatus,
          disposition_notes: dispositionNotes ?? null,
        },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(
      updatedLetter,
      `Status surat berhasil diubah menjadi ${newStatus}`,
      200
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi perubahan status surat gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in PATCH /api/letters/[id]/status:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

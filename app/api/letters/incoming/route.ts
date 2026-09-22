import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import {
  createIncomingLetterSchema,
  letterFilterQuerySchema,
} from '@/lib/validators/letters';
import { Letter } from '@/lib/types/database';

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication & RBAC (Admin TU only)
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role, id: userId } = currentUser.profile;
    if (role !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat mencatat surat masuk.', 403);
    }

    // 2. Parse & Validate Body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = createIncomingLetterSchema.parse(body);
    const { referenceNumber, date, sender, subject, classificationCode, summary, fileUrl, fileSizeBytes } =
      validatedData;

    const year = parseInt(date.split('-')[0], 10);
    const supabase = await createServerSupabaseClient();

    // 3. Insert Incoming Letter
    const { data: newLetterRaw, error: insertError } = await (supabase.from('letters') as any)
      .insert({
        type: 'incoming',
        reference_number: referenceNumber,
        date,
        sender_or_recipient: sender,
        subject,
        classification_code: classificationCode,
        summary: summary ?? null,
        file_url: fileUrl ?? null,
        file_size_bytes: fileSizeBytes ?? null,
        status: 'pending',
        year,
        created_by: userId,
      })
      .select('id, reference_number, date, sender_or_recipient, subject, status, created_at')
      .single();

    if (insertError || !newLetterRaw) {
      console.error('Error inserting incoming letter:', insertError);
      return errorResponse('Gagal mencatat surat masuk', 500);
    }

    const newLetter = newLetterRaw as Pick<Letter, 'id' | 'reference_number' | 'date' | 'sender_or_recipient' | 'subject' | 'status' | 'created_at'>;

    // 4. Record Initial Status History
    try {
      await (supabase.from('letter_status_histories') as any).insert({
        letter_id: newLetter.id,
        from_status: null,
        to_status: 'pending',
        changed_by: userId,
        notes: 'Surat masuk dicatat oleh Admin TU',
      });
    } catch (histErr) {
      console.warn('Failed to insert letter status history:', histErr);
    }

    // 5. Audit Log (SYS-08)
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: userId,
        action: 'LETTER_INCOMING_CREATE',
        details: {
          letter_id: newLetter.id,
          reference_number: referenceNumber,
          sender,
          subject,
        },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(newLetter, 'Surat masuk berhasil dicatat', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi data surat masuk gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in POST /api/letters/incoming:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication & RBAC (Admin TU & Kepala Sekolah)
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role } = currentUser.profile;
    if (role !== 'admin_tu' && role !== 'kepala_sekolah') {
      return errorResponse('Akses ditolak. Anda tidak memiliki izin untuk melihat arsip surat masuk.', 403);
    }

    // 2. Parse Query Params
    const { searchParams } = new URL(req.url);
    const rawQuery = {
      search: searchParams.get('search') ?? undefined,
      classificationCode: searchParams.get('classificationCode') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      startDate: searchParams.get('startDate') ?? undefined,
      endDate: searchParams.get('endDate') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    };

    const validatedQuery = letterFilterQuerySchema.parse(rawQuery);
    const { search, classificationCode, status, startDate, endDate, page = 1, limit = 10 } = validatedQuery;

    const supabase = await createServerSupabaseClient();

    // 3. Build Query
    let query = (supabase.from('letters') as any)
      .select('*', { count: 'exact' })
      .eq('type', 'incoming');

    if (search) {
      query = query.or(`reference_number.ilike.%${search}%,subject.ilike.%${search}%,sender_or_recipient.ilike.%${search}%`);
    }

    if (classificationCode) {
      query = query.eq('classification_code', classificationCode);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: letters, count, error: queryError } = await query;

    if (queryError) {
      console.error('Error fetching incoming letters:', queryError);
      return errorResponse('Gagal mengambil daftar surat masuk', 500);
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return successResponse(
      {
        items: (letters ?? []) as Letter[],
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      'Daftar surat masuk berhasil diambil',
      200
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'query';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi parameter query gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in GET /api/letters/incoming:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

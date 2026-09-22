import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import {
  createOutgoingLetterSchema,
  letterFilterQuerySchema,
} from '@/lib/validators/letters';
import { formatOutgoingLetterNumber } from '@/lib/utils/letter-numbering';
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
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat membuat draft surat keluar.', 403);
    }

    // 2. Parse & Validate Body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = createOutgoingLetterSchema.parse(body);
    const { date, recipient, subject, classificationCode, summary } = validatedData;

    const dateParts = date.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);

    const supabase = await createServerSupabaseClient();

    // 3. Deterministic / Atomic Sequence Number Calculation for Current Year (SRT-04)
    const { data: latestLetterRaw } = await (supabase.from('letters') as any)
      .select('sequence_number')
      .eq('type', 'outgoing')
      .eq('year', year)
      .order('sequence_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    const maxSequence = latestLetterRaw?.sequence_number ?? 0;
    const nextSequence = maxSequence + 1;

    // Generate standard reference number
    const generatedReferenceNumber = formatOutgoingLetterNumber(
      classificationCode,
      nextSequence,
      month,
      year
    );

    // 4. Insert Outgoing Letter Draft
    const { data: newLetterRaw, error: insertError } = await (supabase.from('letters') as any)
      .insert({
        type: 'outgoing',
        reference_number: generatedReferenceNumber,
        date,
        sender_or_recipient: recipient,
        subject,
        classification_code: classificationCode,
        summary: summary ?? null,
        status: 'pending',
        sequence_number: nextSequence,
        year,
        created_by: userId,
      })
      .select('*')
      .single();

    if (insertError || !newLetterRaw) {
      console.error('Error inserting outgoing letter:', insertError);
      return errorResponse('Gagal membuat surat keluar', 500);
    }

    const newLetter = newLetterRaw as Letter;

    // 5. Record Initial Status History
    try {
      await (supabase.from('letter_status_histories') as any).insert({
        letter_id: newLetter.id,
        from_status: null,
        to_status: 'pending',
        changed_by: userId,
        notes: 'Draft surat keluar dibuat oleh Admin TU dengan nomor otomatis',
      });
    } catch (histErr) {
      console.warn('Failed to insert letter status history:', histErr);
    }

    // 6. Audit Log (SYS-08)
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: userId,
        action: 'LETTER_OUTGOING_CREATE',
        details: {
          letter_id: newLetter.id,
          reference_number: generatedReferenceNumber,
          recipient,
          subject,
          sequence_number: nextSequence,
        },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(newLetter, 'Surat keluar berhasil dibuat', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi data surat keluar gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in POST /api/letters/outgoing:', error);
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
      return errorResponse('Akses ditolak. Anda tidak memiliki izin untuk melihat arsip surat keluar.', 403);
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
      .eq('type', 'outgoing');

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
      console.error('Error fetching outgoing letters:', queryError);
      return errorResponse('Gagal mengambil daftar surat keluar', 500);
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
      'Daftar surat keluar berhasil diambil',
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

    console.error('Unhandled error in GET /api/letters/outgoing:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

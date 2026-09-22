import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { createSubjectSchema } from '@/lib/validators/subjects';
import { Subject } from '@/lib/types/database';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: subjects, error: fetchError } = await (supabase.from('subjects') as any)
      .select('*')
      .order('name', { ascending: true });

    if (fetchError) {
      console.error('Error fetching subjects:', fetchError);
      return errorResponse('Gagal mengambil daftar mata pelajaran', 500);
    }

    return successResponse(
      (subjects ?? []) as Subject[],
      'Daftar mata pelajaran berhasil diambil',
      200
    );
  } catch (error) {
    console.error('Unhandled error in GET /api/subjects:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check (Admin TU only)
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role, id: userId } = currentUser.profile;
    if (role !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat menambahkan mata pelajaran.', 403);
    }

    // 2. Parse & Validate Body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = createSubjectSchema.parse(body);
    const { code, name, description } = validatedData;

    const supabase = await createServerSupabaseClient();

    // Check code uniqueness
    const { data: existingCode } = await (supabase.from('subjects') as any)
      .select('id')
      .eq('code', code)
      .maybeSingle();

    if (existingCode) {
      return errorResponse(`Mata pelajaran dengan kode '${code}' sudah terdaftar`, 400);
    }

    // 3. Insert Subject
    const { data: newSubjectRaw, error: insertError } = await (supabase.from('subjects') as any)
      .insert({
        code,
        name,
        description: description ?? null,
      })
      .select('*')
      .single();

    if (insertError || !newSubjectRaw) {
      console.error('Error inserting subject:', insertError);
      return errorResponse('Gagal menambahkan mata pelajaran', 500);
    }

    // 4. Audit Log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: userId,
        action: 'SUBJECT_CREATE',
        details: { subject_id: (newSubjectRaw as any).id, code, name },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(newSubjectRaw as Subject, 'Mata pelajaran berhasil ditambahkan', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi data mata pelajaran gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in POST /api/subjects:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

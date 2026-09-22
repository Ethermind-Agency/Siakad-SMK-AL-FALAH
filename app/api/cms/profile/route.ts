import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { updateSchoolProfileSchema } from '@/lib/validators/cms';
import { SchoolProfile } from '@/lib/types/database';

const DEFAULT_SCHOOL_PROFILE: Omit<SchoolProfile, 'id' | 'updated_at'> = {
  name: 'SMKS AL-FALAH',
  npsn: '69984368',
  vision: 'Mewujudkan lulusan yang berakhlak mulia, kompeten, dan mandiri.',
  mission: [
    'Menyelenggarakan pendidikan kejuruan yang berbasis nilai-nilai keislaman dan disiplin.',
    'Meningkatkan keterampilan vokasional siswa sesuai standar dunia usaha dan industri.',
    'Menumbuhkan jiwa kewirausahaan dan kemandirian.',
  ],
  history:
    'SMKS AL-FALAH didirikan di bawah naungan Yayasan Pondok Pesantren Al-Falah Teluk Pakedai, Kabupaten Kubu Raya, Kalimantan Barat, untuk melayani kebutuhan pendidikan kejuruan masyarakat Sungai Deras dan sekitarnya.',
  address: 'Desa Sungai Deras, Kec. Telok Pakedai, Kab. Kubu Raya, Kalbar, 78383',
  phone: '0852-xxxx-xxxx',
  email: 'info@smks-alfalah.sch.id',
};

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: profileRaw, error: fetchError } = await (supabase.from('school_profile') as any)
      .select('*')
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching school profile:', fetchError);
      return errorResponse('Gagal mengambil data profil sekolah', 500);
    }

    if (!profileRaw) {
      return successResponse(
        {
          id: 'default',
          ...DEFAULT_SCHOOL_PROFILE,
          updated_at: new Date().toISOString(),
        },
        'Profil sekolah default berhasil dimuat',
        200
      );
    }

    return successResponse(profileRaw as SchoolProfile, 'Profil sekolah berhasil diambil', 200);
  } catch (error) {
    console.error('Unhandled error in GET /api/cms/profile:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role, id: userId } = currentUser.profile;
    if (role !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat memperbarui profil sekolah.', 403);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = updateSchoolProfileSchema.parse(body);
    const supabase = await createServerSupabaseClient();

    // Check if row exists in school_profile
    const { data: existingProfile } = await (supabase.from('school_profile') as any)
      .select('id')
      .limit(1)
      .maybeSingle();

    let updatedProfile: SchoolProfile;

    if (existingProfile) {
      const { data: updatedRaw, error: updateError } = await (supabase.from('school_profile') as any)
        .update({
          ...validatedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProfile.id)
        .select('*')
        .single();

      if (updateError || !updatedRaw) {
        return errorResponse('Gagal memperbarui profil sekolah', 500);
      }
      updatedProfile = updatedRaw as SchoolProfile;
    } else {
      const { data: insertedRaw, error: insertError } = await (supabase.from('school_profile') as any)
        .insert({
          ...DEFAULT_SCHOOL_PROFILE,
          ...validatedData,
        })
        .select('*')
        .single();

      if (insertError || !insertedRaw) {
        return errorResponse('Gagal menginisialisasi profil sekolah', 500);
      }
      updatedProfile = insertedRaw as SchoolProfile;
    }

    // Audit log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: userId,
        action: 'SCHOOL_PROFILE_UPDATE',
        details: { updated_fields: Object.keys(validatedData) },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(updatedProfile, 'Profil sekolah berhasil diperbarui', 200);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi data profil sekolah gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in PUT /api/cms/profile:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

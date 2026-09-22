import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { updateNewsSchema } from '@/lib/validators/cms';
import { slugify } from '@/lib/utils/slug';
import { News } from '@/lib/types/database';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: identifier } = await params;
    if (!identifier) {
      return errorResponse('Parameter identifier berita tidak valid', 400);
    }

    const currentUser = await getCurrentUser();
    const isAdmin = currentUser?.profile.role === 'admin_tu';

    const supabase = await createServerSupabaseClient();

    // Check if identifier is UUID or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      identifier
    );

    let query = (supabase.from('news') as any)
      .select(`
        id,
        title,
        slug,
        content,
        excerpt,
        featured_image_url,
        status,
        published_at,
        created_at,
        updated_at,
        profiles:author_id (full_name)
      `);

    if (isUuid) {
      query = query.eq('id', identifier);
    } else {
      query = query.eq('slug', identifier);
    }

    if (!isAdmin) {
      query = query.eq('status', 'published');
    }

    const { data: newsItemRaw, error: fetchError } = await query.single();

    if (fetchError || !newsItemRaw) {
      return errorResponse('Artikel berita tidak ditemukan', 404);
    }

    return successResponse(newsItemRaw as News, 'Detail berita berhasil diambil', 200);
  } catch (error) {
    console.error('Unhandled error in GET /api/cms/news/[id]:', error);
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

    const { role, id: userId } = currentUser.profile;
    if (role !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat memperbarui artikel berita.', 403);
    }

    const { id: newsId } = await params;
    if (!newsId) {
      return errorResponse('ID berita tidak valid', 400);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = updateNewsSchema.parse(body);
    const supabase = await createServerSupabaseClient();

    // Check existing article
    const { data: existingNewsRaw, error: fetchError } = await (supabase.from('news') as any)
      .select('*')
      .eq('id', newsId)
      .single();

    if (fetchError || !existingNewsRaw) {
      return errorResponse('Artikel berita tidak ditemukan', 404);
    }

    const existingNews = existingNewsRaw as News;
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (validatedData.title !== undefined) {
      updatePayload.title = validatedData.title;
      if (validatedData.title !== existingNews.title) {
        updatePayload.slug = slugify(validatedData.title);
      }
    }
    if (validatedData.content !== undefined) updatePayload.content = validatedData.content;
    if (validatedData.excerpt !== undefined) updatePayload.excerpt = validatedData.excerpt;
    if (validatedData.featuredImageUrl !== undefined) {
      updatePayload.featured_image_url = validatedData.featuredImageUrl;
    }
    if (validatedData.status !== undefined) {
      updatePayload.status = validatedData.status;
      if (validatedData.status === 'published' && !existingNews.published_at) {
        updatePayload.published_at = new Date().toISOString();
      }
    }

    const { data: updatedNewsRaw, error: updateError } = await (supabase.from('news') as any)
      .update(updatePayload)
      .eq('id', newsId)
      .select('*')
      .single();

    if (updateError || !updatedNewsRaw) {
      console.error('Error updating news:', updateError);
      return errorResponse('Gagal memperbarui artikel berita', 500);
    }

    // Audit Log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: userId,
        action: 'NEWS_UPDATE',
        details: { news_id: newsId, updated_fields: Object.keys(updatePayload) },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(updatedNewsRaw as News, 'Artikel berita berhasil diperbarui', 200);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi pembaruan berita gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in PUT /api/cms/news/[id]:', error);
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
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat menghapus artikel berita.', 403);
    }

    const { id: newsId } = await params;
    if (!newsId) {
      return errorResponse('ID berita tidak valid', 400);
    }

    const supabase = await createServerSupabaseClient();
    const { error: deleteError } = await (supabase.from('news') as any)
      .delete()
      .eq('id', newsId);

    if (deleteError) {
      console.error('Error deleting news:', deleteError);
      return errorResponse('Gagal menghapus artikel berita', 500);
    }

    // Audit Log
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: userId,
        action: 'NEWS_DELETE',
        details: { news_id: newsId },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse({ id: newsId }, 'Artikel berita berhasil dihapus', 200);
  } catch (error) {
    console.error('Unhandled error in DELETE /api/cms/news/[id]:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

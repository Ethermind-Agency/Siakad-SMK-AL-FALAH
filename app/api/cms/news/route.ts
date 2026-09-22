import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { createNewsSchema, newsFilterQuerySchema } from '@/lib/validators/cms';
import { slugify } from '@/lib/utils/slug';
import { News } from '@/lib/types/database';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const isAdmin = currentUser?.profile.role === 'admin_tu';

    const { searchParams } = new URL(req.url);
    const rawQuery = {
      search: searchParams.get('search') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    };

    const validatedQuery = newsFilterQuerySchema.parse(rawQuery);
    const { search, status, page = 1, limit = 10 } = validatedQuery;

    const supabase = await createServerSupabaseClient();
    let query = (supabase.from('news') as any).select(
      `
        id,
        title,
        slug,
        excerpt,
        featured_image_url,
        status,
        published_at,
        created_at,
        updated_at,
        profiles:author_id (full_name)
      `,
      { count: 'exact' }
    );

    // Non-admin can ONLY view published news
    if (!isAdmin) {
      query = query.eq('status', 'published');
    } else if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const offset = (page - 1) * limit;
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: newsItems, count, error: queryError } = await query;

    if (queryError) {
      console.error('Error fetching news:', queryError);
      return errorResponse('Gagal mengambil daftar berita', 500);
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return successResponse(
      {
        items: (newsItems ?? []) as News[],
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      'Daftar berita berhasil diambil',
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

    console.error('Unhandled error in GET /api/cms/news:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication & RBAC (Admin TU only)
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return errorResponse('Sesi tidak valid atau telah berakhir. Silakan login kembali.', 401);
    }

    const { role, id: userId } = currentUser.profile;
    if (role !== 'admin_tu') {
      return errorResponse('Akses ditolak. Hanya Admin TU yang dapat membuat artikel berita.', 403);
    }

    // 2. Parse & Validate Body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Format JSON request body tidak valid', 400);
    }

    const validatedData = createNewsSchema.parse(body);
    const { title, content, excerpt, featuredImageUrl, status } = validatedData;

    const supabase = await createServerSupabaseClient();

    // 3. Generate SEO-Friendly Slug with collision avoidance
    let baseSlug = slugify(title);
    if (!baseSlug) baseSlug = `berita-${Date.now()}`;

    let uniqueSlug = baseSlug;
    let counter = 1;

    while (true) {
      const { data: existingSlug } = await (supabase.from('news') as any)
        .select('id')
        .eq('slug', uniqueSlug)
        .maybeSingle();

      if (!existingSlug) break;
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const publishedAt = status === 'published' ? new Date().toISOString() : null;

    // 4. Insert News Article
    const { data: newNewsRaw, error: insertError } = await (supabase.from('news') as any)
      .insert({
        title,
        slug: uniqueSlug,
        content,
        excerpt: excerpt ?? null,
        featured_image_url: featuredImageUrl ?? null,
        status: status ?? 'published',
        published_at: publishedAt,
        author_id: userId,
      })
      .select('*')
      .single();

    if (insertError || !newNewsRaw) {
      console.error('Error inserting news:', insertError);
      return errorResponse('Gagal membuat artikel berita', 500);
    }

    const newNews = newNewsRaw as News;

    // 5. Audit Log (SYS-08)
    try {
      const adminClient = createAdminClient();
      await (adminClient.from('activity_logs') as any).insert({
        user_id: userId,
        action: 'NEWS_CREATE',
        details: {
          news_id: newNews.id,
          title: newNews.title,
          slug: newNews.slug,
          status: newNews.status,
        },
      });
    } catch (auditErr) {
      console.warn('Audit logging failed (non-blocking):', auditErr);
    }

    return successResponse(newNews, 'Artikel berita berhasil diterbitkan', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const key = err.path.join('.') || 'body';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(err.message);
      });
      return errorResponse('Validasi artikel berita gagal', 400, fieldErrors);
    }

    console.error('Unhandled error in POST /api/cms/news:', error);
    return errorResponse('Terjadi kesalahan internal pada server', 500);
  }
}

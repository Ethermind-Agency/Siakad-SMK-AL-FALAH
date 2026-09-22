import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database, UserRole } from '@/lib/types/database';

export interface MiddlewareAuthResult {
  response: NextResponse;
  user: {
    id: string;
    email?: string;
    role?: UserRole;
  } | null;
}

export async function updateSession(request: NextRequest): Promise<MiddlewareAuthResult> {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const demoRole = request.cookies.get('sims_role')?.value as UserRole | undefined;
    if (demoRole) {
      return {
        response,
        user: {
          id: 'demo-user-id',
          email: `${demoRole}@smk-alfalah.sch.id`,
          role: demoRole,
        },
      };
    }
    return { response, user: null };
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '' });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: '', ...options, maxAge: 0 });
      },
    },
  });

  // Refresh auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const demoRole = request.cookies.get('sims_role')?.value as UserRole | undefined;
    if (demoRole) {
      return {
        response,
        user: {
          id: 'demo-user-id',
          email: `${demoRole}@smk-alfalah.sch.id`,
          role: demoRole,
        },
      };
    }
    return { response, user: null };
  }

  // Fetch role from profiles
  const { data: profileRaw } = await (supabase.from('profiles') as any)
    .select('role')
    .eq('id', user.id)
    .single();

  const profile = profileRaw as { role?: UserRole } | null;

  return {
    response,
    user: {
      id: user.id,
      email: user.email,
      role: profile?.role,
    },
  };
}

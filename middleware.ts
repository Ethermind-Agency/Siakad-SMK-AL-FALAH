import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { UserRole } from '@/lib/types/database';

export function getRoleHomePath(role?: UserRole): string {
  switch (role) {
    case 'admin_tu':
      return '/admin';
    case 'kepala_sekolah':
      return '/kepala-sekolah';
    case 'guru':
      return '/guru';
    case 'siswa_ortu':
      return '/siswa';
    default:
      return '/login';
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static Assets & Public API Pass-through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Refresh Supabase Auth Session
  const { response, user } = await updateSession(request);

  const isAuthRoute = pathname === '/login' || pathname === '/auth/login';
  const isProtectedDashboardRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/kepala-sekolah') ||
    pathname.startsWith('/guru') ||
    pathname.startsWith('/siswa') ||
    pathname.startsWith('/dashboard');

  // 3. Already Logged In User accessing /login -> Redirect to their Dashboard
  if (isAuthRoute && user) {
    const destination = getRoleHomePath(user.role);
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 4. Protected Routes Check
  if (isProtectedDashboardRoute) {
    // Unauthenticated user -> Redirect to Login
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based Access Control (RBAC) Route Restrictions
    const role = user.role;

    // Normalize /dashboard/<role> aliases
    if (pathname.startsWith('/dashboard/admin')) {
      const properPath = pathname.replace('/dashboard/admin', '/admin');
      return NextResponse.redirect(new URL(properPath, request.url));
    }
    if (pathname.startsWith('/dashboard/kepala-sekolah')) {
      const properPath = pathname.replace('/dashboard/kepala-sekolah', '/kepala-sekolah');
      return NextResponse.redirect(new URL(properPath, request.url));
    }
    if (pathname.startsWith('/dashboard/guru')) {
      const properPath = pathname.replace('/dashboard/guru', '/guru');
      return NextResponse.redirect(new URL(properPath, request.url));
    }
    if (pathname.startsWith('/dashboard/siswa')) {
      const properPath = pathname.replace('/dashboard/siswa', '/siswa');
      return NextResponse.redirect(new URL(properPath, request.url));
    }

    if (pathname === '/dashboard') {
      const roleHome = getRoleHomePath(role);
      return NextResponse.redirect(new URL(roleHome, request.url));
    }

    if (pathname.startsWith('/admin') && role !== 'admin_tu') {
      const properHome = getRoleHomePath(role);
      return NextResponse.redirect(new URL(properHome, request.url));
    }

    if (pathname.startsWith('/kepala-sekolah') && role !== 'kepala_sekolah') {
      const properHome = getRoleHomePath(role);
      return NextResponse.redirect(new URL(properHome, request.url));
    }

    if (pathname.startsWith('/guru') && role !== 'guru') {
      const properHome = getRoleHomePath(role);
      return NextResponse.redirect(new URL(properHome, request.url));
    }

    if (pathname.startsWith('/siswa') && role !== 'siswa_ortu') {
      const properHome = getRoleHomePath(role);
      return NextResponse.redirect(new URL(properHome, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

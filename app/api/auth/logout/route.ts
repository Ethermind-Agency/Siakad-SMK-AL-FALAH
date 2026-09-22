import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.set({ name: 'sims_role', value: '', path: '/', maxAge: 0 });
  response.cookies.set({ name: 'sims_user', value: '', path: '/', maxAge: 0 });
  return response;
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ status: 'ok', message: 'Berhasil keluar sistem.' });
  response.cookies.set({ name: 'sims_role', value: '', path: '/', maxAge: 0 });
  response.cookies.set({ name: 'sims_user', value: '', path: '/', maxAge: 0 });
  return response;
}

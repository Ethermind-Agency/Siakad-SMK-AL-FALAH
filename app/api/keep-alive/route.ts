import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  try {
    const supabase = createAdminClient();
    // Lightweight keep-alive query
    const { count, error } = await (supabase.from('profiles') as any)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.warn('Keep-alive query warning:', error.message);
    }

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'sims-al-falah',
      database: error ? 'degraded' : 'connected',
      latencyMs,
    });
  } catch (error: any) {
    console.error('Keep-alive failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        message: error.message || 'Database connection error',
      },
      { status: 500 }
    );
  }
}

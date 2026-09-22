import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/types/api';

export function successResponse<T>(
  data: T,
  message = 'Success',
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function errorResponse(
  message = 'Internal Server Error',
  status = 500,
  errors?: Record<string, string[]> | string[]
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    },
    { status }
  );
}

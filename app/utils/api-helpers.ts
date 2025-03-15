import { NextResponse } from 'next/server';

export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  message?: string;
  status: number;
};

/**
 * Create a success response
 */
export function createSuccessResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      data,
      status,
    },
    { status }
  );
}

/**
 * Create an error response
 */
export function createErrorResponse(
  error: string,
  status = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      error,
      status,
    },
    { status }
  );
}

/**
 * Create a not found response
 */
export function createNotFoundResponse(
  resource = 'Resource'
): NextResponse<ApiResponse> {
  return createErrorResponse(`${resource} not found`, 404);
}

/**
 * Create a validation error response
 */
export function createValidationErrorResponse(
  error = 'Validation error'
): NextResponse<ApiResponse> {
  return createErrorResponse(error, 422);
}

/**
 * Create an unauthorized error response
 */
export function createUnauthorizedResponse(
  error = 'Unauthorized'
): NextResponse<ApiResponse> {
  return createErrorResponse(error, 401);
}

/**
 * Create a message response
 */
export function createMessageResponse(
  message: string,
  status = 200
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      message,
      status,
    },
    { status }
  );
} 
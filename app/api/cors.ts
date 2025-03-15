import { NextRequest, NextResponse } from 'next/server';

// CORS headers configuration
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // Change in production to specific domains
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400', // 24 hours in seconds
};

/**
 * Handle preflight OPTIONS requests for CORS
 */
export function handleOptionsRequest() {
  return new NextResponse(null, {
    status: 204, // No content
    headers: CORS_HEADERS,
  });
}

/**
 * Apply CORS headers to any response
 */
export function applyCorsHeaders(response: NextResponse) {
  // Apply CORS headers to the response
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * Handle CORS for any API route
 * Use as a wrapper in your API handlers
 */
export async function withCors(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>,
) {
  // Handle OPTIONS request for CORS preflight
  if (request.method === 'OPTIONS') {
    return handleOptionsRequest();
  }
  
  // Process the request with the provided handler
  const response = await handler(request);
  
  // Apply CORS headers to the response
  return applyCorsHeaders(response);
} 
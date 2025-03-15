import { createSuccessResponse } from '@/app/utils/api-helpers';
import { NextRequest } from 'next/server';
import { withCors } from '../cors';

// Handle OPTIONS request (for CORS preflight)
export async function OPTIONS() {
  // This is handled by the withCors wrapper
  return new Response(null, { status: 204 });
}

// GET handler with CORS support
export async function GET(request: NextRequest) {
  // Wrap the handler with CORS middleware
  return withCors(request, async (req) => {
    // Regular API logic here
    return createSuccessResponse({
      message: "This endpoint supports CORS!",
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
    });
  });
}

// POST handler with CORS support
export async function POST(request: NextRequest) {
  return withCors(request, async (req) => {
    try {
      const body = await req.json();
      
      return createSuccessResponse({
        message: "Data received with CORS support",
        receivedData: body,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return createSuccessResponse({
        message: "Error processing JSON data",
        error: String(error),
      }, 400);
    }
  });
} 
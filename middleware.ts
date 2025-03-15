import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This middleware protects API routes based on the request path and method
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/api/auth',         // Login endpoint
    '/',                 // Home page
    '/api',              // Root API
  ];
  
  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  // Allow all public routes and non-API routes
  if (isPublicRoute || !path.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Get the authorization header
  const authHeader = request.headers.get('Authorization');
  
  // If no authorization header, deny access to API routes
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new NextResponse(
      JSON.stringify({ error: 'Authorization required' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  
  // Continue with the request (token will be validated in specific API routes)
  return NextResponse.next();
}

// Only run middleware on API routes
export const config = {
  matcher: '/api/:path*',
}; 
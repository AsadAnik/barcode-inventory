import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * MIDDLEWARE
 * This is global check middleware function
 * @param request 
 * @returns 
 */
export function middleware(request: NextRequest) {
  // Check if the user has an accessToken
  const accessToken = request.cookies.get('accessToken')?.value;

  // Define protected routes (adjust according to your needs)
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/scanner'];

  // If the route requires authentication
  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {

    console.log('PROTECTED ROUTE', request.nextUrl.pathname);

    if (!accessToken) {
      // Redirect to login if no accessToken
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  console.log('NOT PROOTECTED ROUTE', request.nextUrl.pathname);;

  // Allow the request to proceed if no rules matched
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*', '/scanner', '/dashboard'], // Protect these routes
};

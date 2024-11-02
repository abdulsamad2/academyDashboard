import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

// Define public API routes that should bypass middleware
const publicApiRoutes = [
  '/api/upload',  // For file uploads
  '/api/register',     // For user registration
  '/api/auth',
  '/api/send'          // For NextAuth routes
];

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  // Check if the request is for a public API route
  const isPublicApiRoute = publicApiRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  );

  // Allow public API routes to bypass middleware
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  //@ts-ignore
  const isVerified = req.auth?.isvarified;
  //@ts-ignore
  const role = req.auth?.role;
  //@ts-ignore
  const onboarding = req.auth?.onboarding;

  // If logged in
  if (isLoggedIn) {
    // Handle API routes differently
    if (nextUrl.pathname.startsWith('/api/')) {
      // Allow authenticated API requests to proceed
      return NextResponse.next();
    }

    if (!isVerified) {
      // Redirect to verification page if the user is not verified
      if (!nextUrl.pathname.startsWith('/auth/verify')) {
        return NextResponse.redirect(new URL('/auth/verify', req.url));
      }
    } else if (onboarding) {
      // Redirect to onboarding page if onboarding is true and not already there
      if (nextUrl.pathname !== '/auth/onboarding') {
        return NextResponse.redirect(new URL('/auth/onboarding', req.url));
      }
    } else {
      // Role-based dashboard access
      if (role === 'admin') {
        // Redirect to the main dashboard by default
        if (nextUrl.pathname === '/') {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        // Allow access to any dashboard for admin
      } else if (role === 'tutor') {
        if (nextUrl.pathname === '/') {
          return NextResponse.redirect(new URL('/tutor-dashboard', req.url));
        } else if (
          nextUrl.pathname.startsWith('/parent-dashboard') || 
          nextUrl.pathname.startsWith('/dashboard')
        ) {
          // Restrict access to admin and parent dashboards
          return NextResponse.rewrite(new URL('/_error', req.url));
        }
      } else if (role === 'parent') {
        if (nextUrl.pathname === '/') {
          return NextResponse.redirect(new URL('/parent-dashboard', req.url));
        } else if (
          nextUrl.pathname.startsWith('/tutor-dashboard') || 
          nextUrl.pathname.startsWith('/dashboard')
        ) {
          // Restrict access to admin and tutor dashboards
          return NextResponse.rewrite(new URL('/_error', req.url));
        }
      }
    }
  }

  return NextResponse.next();
});

// Update matcher configuration to be more specific
export const config = {
  matcher: [
    // Protected Routes
    '/dashboard/:path*',
    '/tutor-dashboard/:path*',
    '/parent-dashboard/:path*',
    '/auth/:path*',
    
    // API Routes (except public ones)
    '/api/:path*',
    
    // Root path
    '/',
    
    // Exclude next internal routes, images, and other static files
    '/((?!api/uploadthing|api/register|api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)'
  ]
};
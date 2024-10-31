import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isVerified = req.auth?.isvarified;
  const role = req.auth?.role;
  const onboarding = req.auth?.onboarding;

  if (isLoggedIn) {
    if (!isVerified) {
      // Redirect to verification page if the user is not verified
      if (nextUrl.pathname !== '/auth/verify') {
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
        if (nextUrl.pathname === '/') {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        } else if (nextUrl.pathname.startsWith('/tutor-dashboard') || nextUrl.pathname.startsWith('/parent-dashboard')) {
          // Restrict access to other dashboards
          return NextResponse.rewrite(new URL('/_error', req.url));
        }
      } else if (role === 'tutor') {
        if (nextUrl.pathname === '/') {
          return NextResponse.redirect(new URL('/tutor-dashboard', req.url));
        } else if (nextUrl.pathname.startsWith('/parent-dashboard') || nextUrl.pathname.startsWith('/dashboard')) {
          // Restrict access to admin and parent dashboards
          return NextResponse.rewrite(new URL('/_error', req.url));
        }
      } else if (role === 'parent') {
        if (nextUrl.pathname === '/') {
          return NextResponse.redirect(new URL('/parent-dashboard', req.url));
        } else if (nextUrl.pathname.startsWith('/tutor-dashboard') || nextUrl.pathname.startsWith('/dashboard')) {
          // Restrict access to admin and tutor dashboards
          return NextResponse.rewrite(new URL('/_error', req.url));
        }
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
    '/dashboard',
    '/tutor-dashboard',
    '/parent-dashboard'
  ]
};

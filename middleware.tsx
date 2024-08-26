import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;
  const role = req.auth?.role;

  if (isLoggedIn) {
    if (role === 'admin') {
      if (nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } else if (role === 'tutor') {
      if (nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/tutor-dashboard', req.url));
      } else if (nextUrl.pathname.startsWith('/parent-dashboard')) {
        return NextResponse.rewrite(new URL('/_error', req.url));
      }
    } else if (role === 'parent') {
      if (nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/parent-dashboard', req.url));
      } else if (nextUrl.pathname.startsWith('/tutor-dashboard')) {
        return NextResponse.rewrite(new URL('/_error', req.url));
      }
    }
  } else {
    // if (nextUrl.pathname !== '/auth/login') {
    //   return NextResponse.redirect(new URL('/auth/signin', req.url));
    // }
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

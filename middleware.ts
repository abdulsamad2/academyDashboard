import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

const PUBLIC_PATHS = [
  '/auth/signin',
  '/auth/register',
  '/auth/password-reset',
  '/auth/verify'
];

const PUBLIC_API_PREFIXES = ['/api/auth', '/api/uploadthing'];

const ROLE_ROOT: Record<string, string> = {
  admin: '/dashboard',
  tutor: '/tutor-dashboard',
  parent: '/parent-dashboard',
  student: '/parent-dashboard'
};

const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  admin: ['/dashboard', '/tutor-dashboard', '/parent-dashboard'],
  tutor: ['/tutor-dashboard'],
  parent: ['/parent-dashboard'],
  student: ['/parent-dashboard']
};

function isPublicApi(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p));
}

function isPublicPage(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const session = req.auth;
  const isLoggedIn = !!session;
  const role = session?.role as string | undefined;
  const isVerified = session?.isvarified;
  const needsOnboarding = session?.onboarding;

  if (isPublicApi(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (isPublicPage(pathname)) {
    if (isLoggedIn && pathname === '/auth/signin') {
      const dest = role ? ROLE_ROOT[role] ?? '/' : '/';
      return NextResponse.redirect(new URL(dest, req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const signin = new URL('/auth/signin', req.url);
    signin.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signin);
  }

  if (!isVerified && !pathname.startsWith('/auth/verify')) {
    return NextResponse.redirect(new URL('/auth/verify', req.url));
  }

  if (needsOnboarding && pathname !== '/auth/onboarding') {
    return NextResponse.redirect(new URL('/auth/onboarding', req.url));
  }

  if (pathname === '/') {
    const dest = role ? ROLE_ROOT[role] ?? '/auth/signin' : '/auth/signin';
    return NextResponse.redirect(new URL(dest, req.url));
  }

  if (role) {
    const allowed = ROLE_ALLOWED_PREFIXES[role] ?? [];
    const isDashboardRoute =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/tutor-dashboard') ||
      pathname.startsWith('/parent-dashboard');
    if (
      isDashboardRoute &&
      !allowed.some((prefix) => pathname.startsWith(prefix))
    ) {
      return NextResponse.redirect(
        new URL(ROLE_ROOT[role] ?? '/auth/signin', req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|fonts|.*\\..*).*)'
  ]
};

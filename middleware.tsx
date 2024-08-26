import NextAuth from 'next-auth';
import authConfig from './auth.config';

export const { auth: middleware } = NextAuth(authConfig,{
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],

});


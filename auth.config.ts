import NextAuth, {
  AuthError,
  CredentialsSignin,
  NextAuthConfig
} from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';

import bcrypt from 'bcryptjs';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
class CustomError extends CredentialsSignin {
  code = 'custom_error';
}

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),

  session: {
   strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours in seconds

   },

  providers: [
    CredentialProvider({
      email: { label: 'email', type: 'string' },
      password: { label: 'Password', type: 'password' },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new CustomError({ code: 'invalid crednentails' });
        }

        const user = await prisma.user.findUnique({
          where: {
            email
          }
        });

        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        if (user && passwordsMatch) {
          return user;
        }
        return null;
      }
    })
  ],

  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized({ request, auth }) {
      // Check if the user is authenticated
      if (!auth?.user) {
        return false // or redirect to login page
      }
   
      // Check user role
      if (auth.user.role === "admin") {
        // Redirect non-admin users
        return Response.redirect(new URL("/dashboard", request.url))
      }
      if (auth.user.role === "tutor") {
        // Redirect non-admin users
        return Response.redirect(new URL("/tutor-dashboard", request.url))
      }
      if (auth.user.role === "parent") {
        // Redirect non-admin users
        return Response.redirect(new URL("/parent-dashboard", request.url))
      }
      // Check session expiry
      const sessionExpiry = new Date(auth.expires)
      if (sessionExpiry < new Date()) {
        // Session has expired, redirect to login
        return Response.redirect(new URL("/login", request.url))
      }
   
      return true // Allow access
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.role = user.role;
        token.id = user.id;
        token.isvarified = user.isvarified;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.role = token.role;
        session.id = token.id;
        session.status = token.status;
        session.isvarified = token.isvarified;
      }
      return session;
    }
  },
  pages: {
    signIn: '/signin',
    signOut: '/signin',
    error: '/signin'
  }
} satisfies NextAuthConfig;

export default authConfig;

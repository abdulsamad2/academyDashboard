import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (user && await bcrypt.compare(password, user.password)) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    signOut: '/signin',
  },
  callbacks: {
    async session({ session, token }) {
      // Customize the session object here
      session.user.id = token.sub; // Example: add user ID to the session object
      session.user.email = token.email; // Example: add email to the session object
      return session;
    },
    async jwt({ token, user }) {
      // Add user info to the JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
};

export default authConfig;

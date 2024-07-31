import NextAuth, { AuthError, CredentialsSignin, NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';

import bcrypt from 'bcryptjs';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialProvider({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        if (!email || !password) {

          throw new AuthError('Invalid email or password');
        }

        const user = await prisma.user.findUnique({
          where: {
            email
          }
        });

        if (!user) {

          throw new AuthError('Invalid email or password');
        }

        const isPasswordValid = bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new AuthError('Invalid email or password');

        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],

  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    }
  },
  pages: {
    signIn: '/signin',
    signOut: '/signin'
  }
};

export default authConfig;

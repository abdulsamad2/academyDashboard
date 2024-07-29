import { CredentialsSignin, NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';

import bcrypt from 'bcryptjs';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

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
          throw new Error('Please enter email and password');
        }

        const user = await prisma.user.findUnique({
          where: {
            email
          }
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordValid = bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error('Incorrect password');
        }

        return user;
      }
    })
  ],
  pages: {
    signIn: '/signin',
    signOut: '/signin'
  }
};

export default authConfig;

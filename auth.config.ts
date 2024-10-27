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
    maxAge: 24 * 60 * 60 // 24 hours in seconds
  },

  providers: [
    CredentialProvider({
      //@ts-ignore
      email: { label: 'email', type: 'string' },
      password: { label: 'Password', type: 'password' },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new CustomError({ code: 'invalid crednentails' });
        }

        const user = await prisma.user.findUnique({
          where: {
           //@ts-ignore 
            email
          }
        });

        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
                     //@ts-ignore 

          password, user.password);

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
  trustHost: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger,session }) {
      if (trigger === 'update') {
        return {
           ...token,
           ...session.user
         };
     }

      if (user) {
        token.user = user;
          //@ts-ignore 
        token.role = user.role;
        token.id = user.id;
          //@ts-ignore 
        token.isvarified = user.isvarified;
          //@ts-ignore 
        token.onboarding = user.onboarding;
      }
     
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
                   //@ts-ignore 

        session.role = token.role;
                   //@ts-ignore 

        session.id = token.id;
                   //@ts-ignore 

        session.status = token.status;
                   //@ts-ignore 

        session.isvarified = token.isvarified;
                   //@ts-ignore

        session.onboarding = token.onboarding;  
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/sigin'
  }
} satisfies NextAuthConfig;

export default authConfig;

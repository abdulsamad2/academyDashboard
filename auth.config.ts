import { CredentialsSignin, type NextAuthConfig, type User } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { z } from 'zod';
import { db } from '@/db/db';

class CustomError extends CredentialsSignin {
  code = 'custom_error';
}

const credentialsSchema = z.object({
  phone: z.string().trim().min(1),
  password: z.string().min(1)
});

const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours
const SESSION_UPDATE_AGE = 60 * 60; // 1 hour

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),

  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE,
    updateAge: SESSION_UPDATE_AGE
  },
  jwt: {
    maxAge: SESSION_MAX_AGE
  },

  providers: [
    CredentialProvider({
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials): Promise<User | null> => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new CustomError({ code: 'invalid_credentials' });
        }
        const { phone, password } = parsed.data;

        const user = await db.user.findUnique({ where: { phone } });
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        return user as unknown as User;
      }
    })
  ],
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session?.user) {
        return { ...token, ...session.user };
      }

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.isvarified = user.isvarified;
        token.onboarding = user.onboarding;
      }

      return token;
    },

    async session({ session, token }) {
      if (token.id) session.id = token.id;
      if (token.role) session.role = token.role;
      session.status = token.status;
      session.isvarified = token.isvarified;
      session.onboarding = token.onboarding;

      if (session.user) {
        if (token.id) session.user.id = token.id;
        if (token.role) session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/signin'
  }
} satisfies NextAuthConfig;

export default authConfig;

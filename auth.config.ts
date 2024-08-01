import NextAuth, { AuthError, CredentialsSignin, NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';

import bcrypt from 'bcryptjs';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
class CustomError extends CredentialsSignin {
   code = "custom_error"
 
   }

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),

  session: { strategy: 'jwt' },

  providers: [
    CredentialProvider({
      email: { label: "email", type:'string' },
        password: { label: "Password", type: "password" 

        },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new CustomError({code:'invalid crednentails'})

          
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
       
        if(user && passwordsMatch){
          return user
        }
        return null;
      }
     
    })
  ],

  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // authorized({ auth, request: { nextUrl } }) {
    //   const isLoggedIn = !!auth?.user;
    //   const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
    //   if (isOnDashboard) {
    //     if (isLoggedIn) return true;
    //     return false; // Redirect unauthenticated users to login page
    //   } else if (isLoggedIn) {
    //     return Response.redirect(new URL('/dashboard', nextUrl));
    //   }
    //   return true;
    // },
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user?.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
      
          session.id = token.id as string;
          session.user.role = token.role as Role;
          session.user.email = token.email as string;
          session.user.name = token.name as string;

        
      }
      return session;
    }
  },
  pages: {
    signIn: '/signin',
    signOut: '/signin',
    error:'/signin'
  }
}satisfies NextAuthConfig;

export default authConfig;

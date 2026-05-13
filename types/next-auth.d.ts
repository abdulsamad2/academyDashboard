import { DefaultSession } from 'next-auth';
import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    id: string;
    role: Role;
    status?: string;
    isvarified?: boolean;
    onboarding?: boolean;
    user: DefaultSession['user'] & {
      id: string;
      role: Role;
    };
  }

  interface User {
    id?: string;
    role?: Role;
    status?: string;
    isvarified?: boolean;
    onboarding?: boolean;
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id?: string;
    role?: Role;
    status?: string;
    isvarified?: boolean;
    onboarding?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: Role;
    status?: string;
    isvarified?: boolean;
    onboarding?: boolean;
  }
}

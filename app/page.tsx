import { redirect } from 'next/navigation';
import { auth } from '@/auth';

const ROLE_HOME: Record<string, string> = {
  admin: '/dashboard',
  tutor: '/tutor-dashboard',
  parent: '/parent-dashboard',
  student: '/parent-dashboard'
};

export default async function Page() {
  const session = await auth();
  if (session?.role) {
    redirect(ROLE_HOME[session.role] ?? '/auth/signin');
  }
  redirect('/auth/signin');
}

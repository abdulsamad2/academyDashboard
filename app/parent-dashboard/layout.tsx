import { auth } from '@/auth';
import { AppShell } from '@/components/layout/app-shell';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'UHIL | Parent',
  description: 'Parent workspace'
};

export default async function ParentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');
  if (
    session.role !== 'parent' &&
    session.role !== 'student' &&
    session.role !== 'admin'
  ) {
    redirect('/');
  }
  if (!session.isvarified) redirect('/auth/verify');

  return <AppShell role="parent">{children}</AppShell>;
}

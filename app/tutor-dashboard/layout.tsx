import { auth } from '@/auth';
import { AppShell } from '@/components/layout/app-shell';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'UHIL | Tutor',
  description: 'Tutor workspace'
};

export default async function TutorLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');
  if (session.role !== 'tutor' && session.role !== 'admin') redirect('/');
  if (!session.isvarified) redirect('/auth/verify');

  return <AppShell role="tutor">{children}</AppShell>;
}

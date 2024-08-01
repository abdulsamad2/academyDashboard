import { auth } from '@/auth';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'UHIL | Dashboard',
  description: 'UHIL Dashboard to manage everything '
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect('/auth/signin');

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
      </div>
    </>
  );
}

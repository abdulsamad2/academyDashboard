// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import Header from './components/Header';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { catchAsycn } from '@/lib/utils';
import { Prisma, PrismaClient } from '@prisma/client';
import ParentSidebar from './components/parentSidebar';
const prisma = new PrismaClient();

export default async function Layout({ children }) {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  if (!session.isvarified) {
    redirect('/auth/verify-email');
  }
  if (session.role === 'tutor') {
    redirect('/tutor-dashboard');
  }
const parent = await prisma.parent.findUnique({
  where: {
    id: session.id,
  },
});
if (parent?.onboarded) {
  redirect('/onboarding');
}
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <ParentSidebar />
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
      </div>
    </>
  );
}

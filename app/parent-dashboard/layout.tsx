// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import Header from './components/Header';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Prisma, PrismaClient } from '@prisma/client';
import ParentSidebar from './components/parentSidebar';
const prisma = new PrismaClient();
interface layoutProps{
  children: React.ReactNode
  params: any
}
export default async function Layout({ children, params }:layoutProps) {
  const session = await auth();
  if (!session) {
    redirect('/');
  }
  //@ts-ignore
  if (!session.isvarified) {
    redirect('/auth/verify');
  }
  //@ts-ignore
  if (session?.role === 'tutor') {
    redirect('/tutor-dashboard');
  }



  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <ParentSidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto pt-16">{children}</main>
      </div>
    </>
  );
}

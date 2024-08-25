// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import Header from './components/Header';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { catchAsycn } from '@/lib/utils';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default async function Layout({ children }) {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  if(!session.isvarified){
    redirect('/auth/verify-email');
  }
  if (session.role === 'tutor') {
    redirect('/tutor-dashboard');
  }
 

 const user = await prisma.user.findUnique({
    where: {
      id: session.id
    },
    include: {
      student: true,
      parent: true
    }
    
  })
  if (!user) {
    redirect('/login');
  }
  
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
      </div>
    </>
  );
}

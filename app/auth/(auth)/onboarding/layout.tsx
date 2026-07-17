// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
interface layoutProps {
  children: React.ReactNode;
  params: any;
}
export default async function Layout({ children, params }: layoutProps) {
  const session = await auth();
  if (!session) {
    redirect('/auth/signin');
  }
  //@ts-ignore

  if (!session.isvarified) {
    redirect('/auth/verify');
  }

  //@ts-ignore
  if (session?.role === 'tutor' && session?.onboarding !== true) {
    redirect('/tutor-dashboard');
  }
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <main className="flex-1 overflow-x-hidden pt-16">{children}</main>
      </div>
    </>
  );
}

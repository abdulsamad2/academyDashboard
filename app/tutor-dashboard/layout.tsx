import { auth } from '@/auth';
import { AppShell } from '@/components/layout/app-shell';
import { db } from '@/db/db';
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

  if (session.role === 'tutor') {
    // Read status from the DB, not the JWT — the token can be up to 24h stale
    const user = await db.user.findUnique({
      where: { id: session.id },
      select: { status: true }
    });

    if (user?.status === 'pendingApproval') {
      return (
        <div className="flex h-screen items-center justify-center p-6">
          <div className="max-w-md space-y-3 text-center">
            <h1 className="text-xl font-semibold">
              Your application is under review
            </h1>
            <p className="text-sm text-muted-foreground">
              Thanks for completing your tutor profile. An admin needs to
              approve your account before you can access the tutor workspace.
              You will be able to sign in and teach once you are approved.
            </p>
          </div>
        </div>
      );
    }

    if (user?.status === 'disabled') {
      return (
        <div className="flex h-screen items-center justify-center p-6">
          <div className="max-w-md space-y-3 text-center">
            <h1 className="text-xl font-semibold">Account disabled</h1>
            <p className="text-sm text-muted-foreground">
              Your account has been disabled. Please contact the academy
              administrator if you believe this is a mistake.
            </p>
          </div>
        </div>
      );
    }
  }

  return <AppShell role="tutor">{children}</AppShell>;
}

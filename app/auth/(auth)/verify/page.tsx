import { auth } from '@/auth';
import { getUserById } from '@/action/userRegistration';
import { redirect } from 'next/navigation';
import { AuthShell } from '../_components/auth-shell';
import VerifyPage from './components/verification';

export default async function Page() {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');

  if (session.isvarified) {
    return (
      <AuthShell title="Already verified" subtitle="Your account is good to go">
        <div className="rounded-2xl border border-success/30 bg-success-muted/40 p-6 text-center text-sm text-foreground">
          Your phone number is already verified — you can continue from your
          dashboard.
        </div>
      </AuthShell>
    );
  }

  const user = await getUserById(session.id);
  if (!user) redirect('/auth/signin');

  return (
    <AuthShell
      title="Verify your phone"
      subtitle="One last step before you can access your account"
    >
      <VerifyPage phone={user.phone} />
    </AuthShell>
  );
}

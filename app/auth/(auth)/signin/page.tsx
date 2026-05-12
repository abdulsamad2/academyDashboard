import { Metadata } from 'next';
import UserAuthForm from '@/components/forms/user-auth-form';
import { AuthShell } from '../_components/auth-shell';

export const metadata: Metadata = {
  title: 'Sign in · UHIL Academy',
  description: 'Sign in to UHIL Academy.'
};

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your UHIL Academy account"
    >
      <UserAuthForm />
    </AuthShell>
  );
}

import { Metadata } from 'next';
import { AuthShell } from '../_components/auth-shell';
import PasswordResetForm from './_components/password-reset-form';

export const metadata: Metadata = {
  title: 'Reset password · UHIL Academy',
  description: 'Reset your UHIL Academy password.'
};

export default function PasswordResetPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We’ll send a one-time code to your phone to verify it’s you"
    >
      <PasswordResetForm />
    </AuthShell>
  );
}

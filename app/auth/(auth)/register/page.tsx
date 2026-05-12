import { Metadata } from 'next';
import UserRegister from '@/components/forms/user-auth-form-register';
import { AuthShell } from '../_components/auth-shell';

export const metadata: Metadata = {
  title: 'Create account · UHIL Academy',
  description: 'Create your UHIL Academy account.'
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Get matched with a vetted UHIL tutor in 24 hours"
    >
      <UserRegister />
    </AuthShell>
  );
}

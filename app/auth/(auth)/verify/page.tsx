// app/verify/page.tsx
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function VerifyPage() {
  const session = await auth();
  if (!session) redirect('/auth/signin');
  //@ts-ignore
  if (session?.user?.isverified) redirect('/');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-black shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold">
          Email Verification
        </h1>
        <Alert variant="destructive" className="mb-4">
          <p className="text-lg">
            To use your account, you need to verify your email.
          </p>
        </Alert>
        <p className="text-center text-gray-600">
          You have successfully created your account! To begin using this site
          you will need to activate your account via the email we have just sent
          to your address.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/auth/verify/resend">
            <Button
            //@ts-ignore
              variant="primary"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Resend Email
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

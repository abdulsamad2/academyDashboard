// app/verify/page.tsx
import { notFound, redirect } from 'next/navigation';
import { updateSession, verfiyToken } from '@/action/factoryFunction';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
export default async function VerifyPage({
  searchParams
}: {
  searchParams: { token?: string };
}) {
  const session = await auth();
  const user = session?.user;
  const { token } = searchParams;

  let message = 'Verifying...';
  let status = 'text-gray-600';
if(user && token){
      message = 'Email verification successful! You can now log in.';
      status = 'text-green-600';
}
  // Verify the token and set the message and status accordingly
console.log(user,token)
  try {
    const res = await verfiyToken(token, session?.id);
    const isValidToken = res?.isvarified;

    if (isValidToken) {
      updateSession({ ...user ,isvarified: true })
      message = 'Email verification successful! You can now log in.';
      status = 'text-green-600';
    } else {
      message = 'Verification failed. Invalid or expired token.';
      status = 'text-red-600';
    }
  } catch (error) {
    console.error('Error during verification:', error);
   
  }

  
  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-lg bg-white p-6 text-black shadow-md">
          <h1 className="mb-4 text-center text-2xl font-bold">
            Email Verification
          </h1>
          <Alert
            variant={status === 'success' ? 'success' : 'error'}
            className="mb-4"
          >
            <p className="text-lg">
              {status === 'success'
                ? 'Your email has been sent!'
                : 'To use your account, you need to verify your email.'}
            </p>
          </Alert>
          <p className="text-center text-gray-600">
            We have sent you an email. Please check your inbox and follow the
            instructions to verify your email address.
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              variant="primary"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Resend Email
            </Button>
          </div>
        </div>
      </div>
    );
  }
 

}

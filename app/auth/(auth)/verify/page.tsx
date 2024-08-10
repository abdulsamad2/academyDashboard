// app/verify/page.tsx
import { notFound } from 'next/navigation';
import { verfiyToken } from '@/action/factoryFunction';
export default async function VerifyPage({
  searchParams
}: {
  searchParams: { token?: string };
}) {
  const { token } = searchParams;

  if (!token) {
    notFound(); // Handle the case where no token is provided
  }

  let message = 'Verifying...';
  let status = 'text-gray-600';

  // Verify the token and set the message and status accordingly

  try {
    const isValidToken = await verfiyToken(token);

    if (isValidToken) {
      message = 'Email verification successful! You can now log in.';
      status = 'text-green-600';
    } else {
      message = 'Verification failed. Invalid or expired token.';
      status = 'text-red-600';
    }
  } catch (error) {
    console.error('Error during verification:', error);
    message = 'An error occurred. Please try again later.';
    status = 'text-red-600';
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Email Verification</h1>
        <p className={`text-lg ${status} mb-4`}>{message}</p>
        <a
          href="/"
          className="inline-block rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-blue-600"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}

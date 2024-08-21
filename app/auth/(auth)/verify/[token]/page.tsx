'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { verifyToken } from '@/action/factoryFunction';

const TokenVerifyPage = () => {
  const { token } = useParams<{ token: string }>();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  if (session && session.isvarified) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-lg bg-white p-6 text-black shadow-md">
          <h1 className="mb-4 text-center text-2xl font-bold">
            Email Verified
          </h1>
          <p className="text-center text-gray-600">
            Your Account is already active.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/" className="text-blue-500 hover:text-blue-600">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const verify = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await verifyToken(token, session?.id as string);
      if (res.error) {
        setError(res.error);
        return;
      }

      if (res) {
        setSuccess(true);
        // time out
        await signOut({
          callbackUrl: '/auth/login'
        });
      } else {
        setError('Verification failed.');
      }
    } catch (err) {
      setError('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-black shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold">
          Email Verification
        </h1>
        <Alert variant="destructive" className="mb-4">
          <p className="text-lg">
            {success
              ? 'Congratulations.'
              : 'To use your account, you need to verify your email.'}
          </p>
        </Alert>
        <p className="text-center text-gray-600">
          {success
            ? 'Your email has been successfully verified.'
            : 'Please click the button below to verify your email.'}
        </p>
        <div className="mt-6 flex justify-center">
          <Button
            variant="primary"
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={verify}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
        </div>
        {error && <div className="mt-4 text-center text-red-500">{error}</div>}
        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TokenVerifyPage;

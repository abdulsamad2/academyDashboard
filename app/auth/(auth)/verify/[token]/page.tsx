'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { verifyToken } from '@/action/factoryFunction';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

const TokenVerifyPage = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        router.push('/auth/onboarding'); // Redirect after verification success
      }, 3000);
    }
  }, [success, router]);

  const verify = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      //@ts-ignore
      const res = await verifyToken(token, session?.id as string);
      //      //@ts-ignore
      if (
              //@ts-ignore

        res.error) {
              //@ts-ignore
        setError(res.error);
        return;
      }

      if (res) {
        setSuccess(true);
        await updateSession({
          ...session,
          user: { isvarified: true, onboarding: true }
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-gray-100 p-6">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl p-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          {success ? 'Email Verified' : 'Email Verification'}
        </h1>
        {success ? (
          <div className="mb-6">
            <CheckCircle className="mx-auto text-green-500" size={48} />
            <p className="mt-4 text-lg text-green-600">
              Congratulations! Your email has been successfully verified.
            </p>
            <p className="mt-2 text-gray-600">
              Redirecting you to onboarding page...
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <XCircle className="mx-auto text-red-500" size={48} />
            <p className="mt-4 text-lg text-gray-700">
              To use your account, please verify your email by clicking the button below.
            </p>
          </div>
        )}

        <Button
          className={`bg-blue-500 text-white hover:bg-blue-600 ${
            success ? 'hidden' : ''
          }`}
          onClick={verify}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </Button>

        {error && (
          <div className="mt-4 text-red-500">
            {error}
          </div>
        )}

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

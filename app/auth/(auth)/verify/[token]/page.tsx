'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { verifyToken } from '@/action/factoryFunction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';

const TokenVerifyPage = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/auth/onboarding');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const verify = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      //@ts-ignore
      const res = await verifyToken(token, session?.id as string);
      //@ts-ignore
      if (res.error) {
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
        setError('Verification failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold ">
            {success ? 'Email Verified' : 'Email Verification'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className={`transition-opacity duration-500 ${success ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <p className="text-lg text-green-600 font-semibold mb-2">
              Congratulations! Your email has been successfully verified.
            </p>
            <p className="text-gray-600">
              Redirecting you to the onboarding page...
            </p>
          </div>
          <div className={`transition-opacity duration-500 ${!success ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <Mail className="mx-auto mb-4" size={64} />
            <p className="text-lg mb-4">
              To activate your account, please verify your email by clicking the button below.
            </p>
            <Button
              className="w-full transition-colors"
              onClick={verify}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>
            {error && (
              <div className="mt-4 p-2 bg-red-100 text-red-600 rounded-md text-sm transition-all duration-300 ease-in-out">
                <XCircle className="inline mr-2" size={16} />
                {error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Link 
            href="/" 
            className=" transition-colors text-sm font-medium"
          >
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TokenVerifyPage;
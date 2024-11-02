import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default async function VerifyPage() {
  const session = await auth();
  if (!session) redirect('/auth/signin');
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Alert variant="destructive">
            <AlertTitle>Action Required</AlertTitle>
            <AlertDescription>
              To use your account, you need to verify your email address.
            </AlertDescription>
          </Alert>
          <p className="text-center text-sm text-gray-600">
            You have successfully created your account! To begin using this site,
            you will need to activate your account via the email we have just sent
            to your address.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Link href="/auth/verify/resend" className="w-full">
            <Button
              variant="default"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Resend Verification Email
            </Button>
          </Link>
          <p className="text-xs text-center text-gray-500">
            Didn&apos;t receive the email? Check your spam folder or contact support.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
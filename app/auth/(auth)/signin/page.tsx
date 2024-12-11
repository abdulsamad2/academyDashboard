import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import UserAuthForm from '@/components/forms/user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import WorkflowSteps from '@/components/workflow';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to use our platform.'
};

export default async function LoginPage() {
  // if logged in then redirect back to own dashboard page

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <WorkflowSteps />
      </div>
      <div className="relative flex h-full items-center p-4 lg:p-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="/logo.jpg" // Replace with your actual logo path
            alt="Logo"
            layout="fill"
            objectFit="contain"
            className="opacity-10"
          />
        </div>
        <div className="relative z-10 mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-black">
              Login to your account
            </h1>
            <p className="text-sm text-black">
              Enter your details below to sign in to your account
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

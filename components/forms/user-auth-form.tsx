'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '../ui/use-toast';
import Link from 'next/link';
import { Mail, Lock, Loader2, PhoneCallIcon } from 'lucide-react';

const ROLE_ROUTES = {
  admin: '/dashboard',
  tutor: '/tutor-dashboard',
  parent: '/parent-dashboard',
  default: '/'
} as const;

const formSchema = z.object({
  phone: z.string().regex(/^\+60\d{9,10}$/, {
    message: 'Please enter a valid Malaysian phone number'
  }),
  password: z.string().min(3, { message: 'Please enter a valid password' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    phone: '+60',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);

    try {
      const { phone, password } = data;
      const result = await signIn('credentials', {
        redirect: false,
        phone,
        password
      });

      if (!result || result.error) {
        throw new Error(result?.error || 'Sign in failed');
      }

      if (callbackUrl) {
        await router.prefetch(callbackUrl);
        router.push(callbackUrl);
        return;
      }

      const role = (result as any)?.role;
      const targetRoute =
        ROLE_ROUTES[role as keyof typeof ROLE_ROUTES] || ROLE_ROUTES.default;
      await router.prefetch(targetRoute);
      router.replace(targetRoute);
    } catch (error) {
      form.reset();
      const errorMessage =
        error instanceof Error && error.message === 'CredentialsSignin'
          ? 'Invalid username or Password'
          : 'Something went wrong';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4  rounded-lg p-8 shadow-lg dark:bg-gray-800"
        >
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <PhoneCallIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                      size={18}
                    />
                    <Input
                      type="tel"
                      placeholder="Enter your mobile number..."
                      disabled={loading}
                      className="w-full border py-2 pl-10 pr-4 "
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="mt-1 text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                      size={18}
                    />
                    <Input
                      type="password"
                      placeholder="Enter your password..."
                      disabled={loading}
                      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="mt-1 text-xs text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end">
            <Link
              href="/auth/password-reset"
              className="text-sm font-medium text-blue-600 transition duration-300 ease-in-out hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>

          {/* Apply background color only to button */}
          <Button
            disabled={loading}
            className="w-full   transform rounded-md px-4 py-2 font-semibold transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            type="submit"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full  " />
        </div>
        <div className="relative flex justify-center space-x-4 text-sm">
          <span className=" px-4 text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              className="font-medium transition duration-300 ease-in-out"
              href="/auth/register"
            >
              <Button className="mx-3"> Register here</Button>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

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
import { Mail, Lock, Loader2 } from 'lucide-react';

const ROLE_ROUTES = {
  admin: '/dashboard',
  tutor: '/tutor-dashboard',
  parent: '/parent-dashboard',
  default: '/'
} as const;

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(3, { message: 'Please enter a valid password' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    email: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);

    try {
      const { email, password } = data;
      const result = await signIn('credentials', {
        redirect: false,
        email,
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
      const targetRoute = ROLE_ROUTES[role as keyof typeof ROLE_ROUTES] || ROLE_ROUTES.default;
      await router.prefetch(targetRoute);
      router.replace(targetRoute);

    } catch (error) {
      form.reset();
      const errorMessage = error instanceof Error && error.message === 'CredentialsSignin'
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
    <div className="w-full max-w-md mx-auto space-y-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4  dark:bg-gray-800 shadow-lg rounded-lg p-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="email"
                      placeholder="Enter your email..."
                      disabled={loading}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-500 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="password"
                      placeholder="Enter your password..."
                      disabled={loading}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-500 mt-1" />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end">
            <Link 
              href="/auth/password-reset" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition duration-300 ease-in-out"
            >
              Forgot password?
            </Link>
          </div>

          {/* Apply background color only to button */}
          <Button 
            disabled={loading} 
            className="w-full   font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
            type="submit"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link className='font-medium transition duration-300 ease-in-out' href='/auth/register'>
              Register here
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

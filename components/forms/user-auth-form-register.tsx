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
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PrismaClient } from '@prisma/client';
import { toast } from '../ui/use-toast';
import { userRegistration } from '@/action/userRegistration';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Mail, User, Lock, Loader2, CheckCircle } from 'lucide-react';

const prisma = new PrismaClient();

const formSchema = z
  .object({
    name: z.string().min(3, { message: 'Name is required' }),
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
    confirmPassword: z.string().min(1, { message: 'Password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
  });

type UserFormValue = z.infer<typeof formSchema>;

export default function UserRegister() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const defaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);

    const { password, email } = data;
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter email and password',
        variant: 'destructive'
      });
      setLoading(false);
      return;
    }

    const response = await userRegistration(data);

    if (response?.error) {
      setLoading(false);
      toast({
        title: 'Error',
        description: response.error,
        variant: 'destructive'
      });
      return;
    }

    if (response) {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });
      callbackUrl ? router.push(callbackUrl) : router.push('/auth/verify')
      setLoading(false);
      toast({
        title: 'Success',
        description: 'Account created successfully',
        variant: 'default'
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Join us and start your journey
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8"
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="text"
                      placeholder="Enter your name..."
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="password"
                      placeholder="Confirm your password..."
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

          <Button 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
            type="submit"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</>
            ) : (
              'Register'
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
            Already have an account?{' '}
            <Link className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition duration-300 ease-in-out' href='/auth/signin'>
              Login here
            </Link>
          </span>
        </div>
      </div>

     
    </div>
  );
}
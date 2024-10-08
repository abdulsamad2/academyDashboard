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
import GoogleSignInButton from '../github-auth-button';
import { toast } from '../ui/use-toast';
import Link from 'next/link';

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

    const result = await signIn('credentials', {
      redirect: false, // Prevent automatic redirection
      email: data.email,
      password: data.password
    });
//@ts-ignore

    if (!result.error) {
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        //@ts-ignore

        const role = result.role; // Assuming `result.user.role` gives you the user's role
        if (role === 'admin') {
          router.push('/dashboard');
        } else if (role === 'tutor') {
          router.push('/tutor-dashboard');
        } else if (role === 'parent') {
          router.push('/parent-dashboard');
        } else {
          router.push('/');
        }
      }
    }
//@ts-ignore

    if (result.error) {
      // rest form
      form.reset();

      setLoading(false);
      toast({
        title: 'Error',
        description:
          result?.error === 'CredentialsSignin'
            ? 'Invalid username or Password'
            : 'Something went wrong',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            {loading ? 'Please wait...' : 'Login'}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            dont have account <Link href={'/auth/register'}>register</Link>
          </span>
        </div>
      </div>
      <GoogleSignInButton />
    </>
  );
}

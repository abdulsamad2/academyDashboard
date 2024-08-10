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
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PrismaClient } from '@prisma/client';
import { toast } from '../ui/use-toast';
const prisma = new PrismaClient();

import { userRegistration } from '@/action/userRegistration';
import Link from 'next/link';
import SelectFormField from '../selectFromField';

const MSROLE = [
  { label: 'Student', value: 'student' },
  { label: 'Tutor', value: 'tutor' }
] as const;

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name is required' }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  confirmPassword: z.string().min(1, { message: 'Password is required' }),
  role: z.string().min(1, { message: 'Please Select one Role' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserRegister() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
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
      return;
    }

    const response = await userRegistration(data);

    if (response.error) {
      //resetform

      setLoading(false);
      toast({
        title: 'Error',
        description: response.error,
        variant: 'destructive'
      });
      return;
    }

    if (response) {
      setLoading(false);
      toast({
        title: 'Success',
        description: 'Account created successfully',
        variant: 'success'
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="Name"
                    placeholder="Enter your Name..."
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="confirm your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SelectFormField
            name={'role'}
            label={'Select who you are '}
            placeholder="student"
            options={MSROLE}
            control={form.control}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            {loading ? 'Please wait...' : 'Register'}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            already have an account ?<Link href="/auth/signin">Login</Link>
          </span>
        </div>
      </div>
    </>
  );
}

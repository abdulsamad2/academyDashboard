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
import { signIn, getSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '../ui/use-toast';
import Link from 'next/link';
import {
  Lock,
  Loader2,
  PhoneCallIcon,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

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
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const defaultValues = { phone: '+60', password: '' };
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
        window.location.href = callbackUrl;
        return;
      }

      const session = await getSession();
      const role = (session as any)?.role || (session as any)?.user?.role;
      const targetRoute =
        ROLE_ROUTES[role as keyof typeof ROLE_ROUTES] || ROLE_ROUTES.default;
      window.location.href = targetRoute;
    } catch (error) {
      form.reset();
      const errorMessage =
        error instanceof Error && error.message === 'CredentialsSignin'
          ? 'Invalid phone number or password'
          : 'Something went wrong';
      toast({
        title: 'Sign in failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Phone number
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <PhoneCallIcon
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+60 12 345 6789"
                      disabled={loading}
                      className="h-11 pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium text-foreground">
                    Password
                  </FormLabel>
                  <Link
                    href="/auth/password-reset"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      disabled={loading}
                      className="h-11 pl-10 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button
            disabled={loading}
            className="h-11 w-full text-sm font-semibold shadow-elevated transition-shadow hover:shadow-elevated-lg"
            type="submit"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-2xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-success" />
            Phone-verified · encrypted in transit
          </p>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-background px-3 text-muted-foreground">
            New here?
          </span>
        </div>
      </div>

      <Link
        href="/auth/register"
        className="flex h-11 w-full items-center justify-center rounded-md border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Create a new account
      </Link>
    </div>
  );
}

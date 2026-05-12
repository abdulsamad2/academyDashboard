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
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '../ui/use-toast';
import { userRegistration } from '@/action/userRegistration';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import {
  Mail,
  Lock,
  Loader2,
  PhoneCallIcon,
  Eye,
  EyeOff,
  Check,
  X,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z
  .object({
    phone: z.string().regex(/^\+60\d{9,10}$/, {
      message: 'Please enter a valid Malaysian phone number'
    }),
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm password' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
  });

type UserFormValue = z.infer<typeof formSchema>;

function passwordChecks(value: string) {
  return [
    { label: '8+ characters', ok: value.length >= 8 },
    { label: 'One uppercase letter', ok: /[A-Z]/.test(value) },
    { label: 'One number', ok: /\d/.test(value) }
  ];
}

export default function UserRegister() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    phone: '+60',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange'
  });

  const passwordValue = form.watch('password');
  const passwordReqs = useMemo(
    () => passwordChecks(passwordValue ?? ''),
    [passwordValue]
  );

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      const response = await userRegistration(data);

      if (response?.error) {
        toast({
          title: 'Registration failed',
          description: response.error,
          variant: 'destructive'
        });
        return;
      }

      await signIn('credentials', {
        redirect: false,
        phone: data.phone,
        password: data.password
      });

      toast({
        title: 'Welcome to UHIL Academy',
        description: 'Account created — please verify your phone number.'
      });

      router.push(callbackUrl ?? '/auth/verify');
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
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
                <FormLabel className="text-sm font-medium text-foreground">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Create a strong password"
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
                {passwordValue ? (
                  <ul className="mt-2 grid grid-cols-3 gap-1">
                    {passwordReqs.map((r) => (
                      <li
                        key={r.label}
                        className={cn(
                          'flex items-center gap-1 text-2xs',
                          r.ok ? 'text-success' : 'text-muted-foreground'
                        )}
                      >
                        {r.ok ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        {r.label}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Confirm password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
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

          <Button
            disabled={loading}
            className="h-11 w-full text-sm font-semibold shadow-elevated transition-shadow hover:shadow-elevated-lg"
            type="submit"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              'Create account'
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-2xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-success" />
            Free to join · no card required
          </p>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-background px-3 text-muted-foreground">
            Already a member?
          </span>
        </div>
      </div>

      <Link
        href="/auth/signin"
        className="flex h-11 w-full items-center justify-center rounded-md border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Sign in to your account
      </Link>
    </div>
  );
}

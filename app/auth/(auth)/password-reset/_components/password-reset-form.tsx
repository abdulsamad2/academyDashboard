'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowLeft,
  Lock,
  Loader2,
  PhoneCallIcon,
  CheckCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import {
  requestResetOtp,
  verifyOTP,
  resetPassword
} from '@/action/userRegistration';
import { cn } from '@/lib/utils';

type Step = 'phone' | 'otp' | 'password' | 'done';

const phoneSchema = z.object({
  phone: z.string().regex(/^\+60\d{9,10}$/, {
    message: 'Please enter a valid Malaysian phone number'
  })
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' })
});

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

function passwordChecks(value: string) {
  return [
    { label: '8+ characters', ok: value.length >= 8 },
    { label: 'One uppercase letter', ok: /[A-Z]/.test(value) },
    { label: 'One number', ok: /\d/.test(value) }
  ];
}

function maskPhone(phone: string) {
  if (!phone || phone.length < 5) return phone;
  return `${phone.slice(0, 3)}•••${phone.slice(-3)}`;
}

export default function PasswordResetForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '+60' }
  });
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
    mode: 'onChange'
  });

  const passwordValue = passwordForm.watch('newPassword');

  const handlePhoneSubmit = async (data: z.infer<typeof phoneSchema>) => {
    setIsLoading(true);
    try {
      const res = await requestResetOtp(data.phone);
      if (res?.success) {
        setPhone(data.phone);
        setStep('otp');
        toast({
          title: 'Code sent',
          description: `A 6-digit code is on its way to ${maskPhone(
            data.phone
          )}.`
        });
      } else {
        toast({
          title: 'Could not send code',
          description: res?.error ?? 'Please try again.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (data: z.infer<typeof otpSchema>) => {
    setIsLoading(true);
    try {
      const res = await verifyOTP(phone, data.otp);
      if (res?.success) {
        setStep('password');
        otpForm.reset();
        toast({
          title: 'Code verified',
          description: 'Set a new password to finish.'
        });
      } else {
        toast({
          title: 'Invalid code',
          description: res?.error ?? 'Please try again.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      await resetPassword(phone, data.newPassword);
      setStep('done');
      toast({
        title: 'Password updated',
        description: 'You can now sign in with your new password.'
      });
      setTimeout(() => router.push('/auth/signin'), 3000);
    } catch {
      toast({
        title: 'Reset failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stepIndex = ['phone', 'otp', 'password', 'done'].indexOf(step);

  return (
    <div className="space-y-6">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === stepIndex
                ? 'w-6 bg-primary'
                : i < stepIndex
                ? 'w-1.5 bg-primary/60'
                : 'w-1.5 bg-muted'
            )}
          />
        ))}
      </div>

      {step === 'phone' && (
        <Form {...phoneForm}>
          <form
            onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
            className="space-y-5"
          >
            <FormField
              control={phoneForm.control}
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
                        disabled={isLoading}
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
              type="submit"
              disabled={isLoading}
              className="h-11 w-full text-sm font-semibold shadow-elevated transition-shadow hover:shadow-elevated-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending code…
                </>
              ) : (
                'Send 6-digit code'
              )}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-2xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-success" />
              We never share your number
            </p>
          </form>
        </Form>
      )}

      {step === 'otp' && (
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
            className="space-y-5"
          >
            <p className="text-center text-sm text-muted-foreground">
              We sent a 6-digit code to{' '}
              <span className="font-medium text-foreground">
                {maskPhone(phone)}
              </span>
            </p>
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">One-time code</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="• • • • • •"
                      disabled={isLoading}
                      className="h-14 text-center text-2xl font-semibold tracking-[0.5em]"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ''))
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-center text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full text-sm font-semibold shadow-elevated transition-shadow hover:shadow-elevated-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                'Verify code'
              )}
            </Button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              Use a different number
            </button>
          </form>
        </Form>
      )}

      {step === 'password' && (
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            className="space-y-5"
          >
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    New password
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
                        disabled={isLoading}
                        className="h-11 pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                      {passwordChecks(passwordValue).map((r) => (
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
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Confirm new password
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
                        disabled={isLoading}
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
              type="submit"
              disabled={isLoading}
              className="h-11 w-full text-sm font-semibold shadow-elevated transition-shadow hover:shadow-elevated-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating password…
                </>
              ) : (
                'Update password'
              )}
            </Button>
          </form>
        </Form>
      )}

      {step === 'done' && (
        <div className="rounded-2xl border border-success/30 bg-success-muted/40 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            Password updated
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You can now sign in with your new password. Redirecting…
          </p>
          <Button asChild className="mt-5">
            <Link href="/auth/signin">Sign in now</Link>
          </Button>
        </div>
      )}

      {step !== 'done' && step !== 'password' && (
        <div className="border-t border-border pt-4 text-center text-sm">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Smartphone, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { verifyMobile, requestNewOtp } from '@/action/userRegistration';

function maskPhone(phone: string) {
  if (!phone) return '';
  if (phone.length < 5) return phone;
  const visible = phone.slice(-3);
  return `${phone.slice(0, 3)}•••${visible}`;
}

export default function VerifyPage({ phone }: { phone: string }) {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(5);
  const [otpTimer, setOtpTimer] = useState(60);

  useEffect(() => {
    if (!success) return;
    const interval = setInterval(() => {
      setRedirectTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    const timer = setTimeout(() => router.push('/auth/onboarding'), 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [success, router]);

  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter the 6-digit code we sent you.',
        variant: 'destructive'
      });
      return;
    }
    setIsLoading(true);
    try {
      const res = await verifyMobile(phone, otp);
      if (res && !('error' in res)) {
        await updateSession({
          ...session,
          user: { isvarified: true, onboarding: true }
        });
        setSuccess(true);
        toast({
          title: 'Phone verified',
          description: 'Your account is now active.'
        });
      } else {
        throw new Error(res?.error ?? 'Invalid code');
      }
    } catch {
      toast({
        title: 'Verification failed',
        description: 'Invalid code. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (otpTimer > 0) return;
    setIsResending(true);
    try {
      const res = await requestNewOtp();
      if (res && !('error' in res)) {
        toast({
          title: 'Code sent',
          description: 'A new 6-digit code is on the way.'
        });
        setOtpTimer(60);
      } else {
        throw new Error(res?.error ?? 'Failed to resend');
      }
    } catch {
      toast({
        title: 'Could not send code',
        description: 'Please try again in a moment.',
        variant: 'destructive'
      });
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success-muted/40 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          You&rsquo;re verified
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Redirecting you to onboarding in {redirectTimer}s…
        </p>
        <Button
          variant="link"
          onClick={() => router.push('/auth/onboarding')}
          className="mt-2 text-sm"
        >
          Go now
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Smartphone className="h-6 w-6" />
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        We sent a 6-digit code to{' '}
        <span className="font-medium text-foreground">{maskPhone(phone)}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="• • • • • •"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          disabled={isLoading}
          className="h-14 text-center text-2xl font-semibold tracking-[0.5em]"
          aria-label="6-digit verification code"
        />

        <Button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="h-11 w-full text-sm font-semibold shadow-elevated transition-shadow hover:shadow-elevated-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying…
            </>
          ) : (
            'Verify phone'
          )}
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          {otpTimer > 0 ? (
            <span>
              Didn&rsquo;t get a code? Resend in{' '}
              <strong className="text-foreground">{otpTimer}s</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-medium text-primary hover:underline"
            >
              {isResending ? 'Sending…' : 'Resend code'}
            </button>
          )}
        </div>

        <p className="flex items-center justify-center gap-1.5 text-2xs text-muted-foreground">
          <ShieldCheck className="h-3 w-3 text-success" />
          Codes expire after 10 minutes
        </p>
      </form>
    </div>
  );
}

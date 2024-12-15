'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';

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
import { verifyOTP, resetPassword } from '@/action/userRegistration';

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' })
});

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

interface OTPVerificationFormProps {
  phoneNumber: string;
}

export default function OTPVerificationForm({
  phoneNumber
}: OTPVerificationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ''
    }
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  async function onOTPSubmit(data: z.infer<typeof otpSchema>) {
    setIsLoading(true);
    try {
      const res = await verifyOTP(phoneNumber, data.otp);
      if (res.success) {
        otpForm.reset();
        passwordForm.reset(); // Reset password form after successful OTP verification
        toast({
          title: 'OTP Verified',
          description:
            'OTP verified successfully. You can now reset your password.'
        });
        setIsOTPVerified(true);
      }
      if (res.error) {
        toast({
          title: 'Error',
          description: 'Invalid OTP. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid OTP. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onPasswordSubmit(data: z.infer<typeof passwordSchema>) {
    setIsLoading(true);
    console.log('Password form data:', data);
    try {
      await resetPassword(phoneNumber, data.newPassword);
      setIsSuccess(true);
      toast({
        title: 'Password reset successful',
        description:
          'Your password has been reset. You can now log in with your new password.'
      });
      setTimeout(() => router.push('/auth/signin'), 3000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Password reset failed. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 text-center">
        <CheckCircle className="h-16 w-16 animate-bounce text-green-500" />
        <h2 className="text-lg font-bold text-gray-700">Success!</h2>
        <p className="text-sm text-gray-500">
          Your password has been reset. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <>
      {!isOTPVerified ? (
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(onOTPSubmit)}
            className="space-y-4"
          >
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <p className="mb-4 text-sm text-green-600">
            OTP verified successfully. Please set your new password.
          </p>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type={
                          field.name === 'newPassword'
                            ? showPassword
                              ? 'text'
                              : 'password'
                            : 'password'
                        }
                        placeholder={
                          field.name === 'newPassword'
                            ? 'Enter new password'
                            : 'Confirm new password'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type={
                          field.name === 'confirmPassword'
                            ? 'password'
                            : 'password'
                        }
                        placeholder={
                          field.name === 'confirmPassword'
                            ? 'Confirm new password'
                            : 'Confirm new password'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
          </Form>
        </>
      )}
    </>
  );
}

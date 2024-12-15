'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Phone, ArrowLeft, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { requestResetOtp } from '@/action/userRegistration';
import OTPVerificationForm from '@/components/forms/otp-verification-form';
// Zod schema for form validation
const formSchema = z.object({
  phoneNumber: z.string().regex(/^\+60\d{9,10}$/, {
    message: 'Please enter a valid phone number'
  })
});

export default function RequestPasswordResetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '+60'
    }
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await requestResetOtp(data.phoneNumber);
      setIsOTPSent(true);
      setPhoneNumber(data.phoneNumber);
      toast({
        title: 'OTP sent',
        description: 'A one-time password has been sent to your phone.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was a problem sending the OTP. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            {isOTPSent
              ? 'Enter the OTP sent to your phone to reset your password.'
              : "Enter your phone number and we'll send you an OTP to reset your password."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isOTPSent ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </form>
            </Form>
          ) : (
            <OTPVerificationForm phoneNumber={phoneNumber} />
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          {!isOTPSent && (
            <Button
              variant="link"
              onClick={() => router.push('/auth/signin')}
              className="text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

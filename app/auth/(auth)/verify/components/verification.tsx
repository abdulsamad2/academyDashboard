'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Smartphone, Mail, CheckCircle, Loader2 } from 'lucide-react'
import { verifyEmail, verifyMobile } from '@/action/userRegistration'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function VerifyPage({ email, phone }: { email: string; phone: string }) {
  const [step, setStep] = useState<'email' | 'mobile' | 'complete'>('email')
  const [mobileOtp, setMobileOtp] = useState('')
  const [emailOtp, setEmailOtp] = useState('')
  const [redirectTimer, setRedirectTimer] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const { data: session, update: updateSession } = useSession()

  useEffect(() => {
    if (success) {
      const interval = setInterval(() => {
        setRedirectTimer((prevTimer) => prevTimer - 1)
      }, 1000) // Decrement every 1 second

      const timer = setTimeout(() => {
        router.push('/auth/onboarding')
      }, 5000) // Redirect after 5 seconds

      return () => {
        clearInterval(interval)
        clearTimeout(timer)
      }
    }
  }, [success, router])


  const handleEmailOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
     const res =   await verifyEmail(email, emailOtp)
     //@ts-ignore
     if(!res.error){
      toast({
        title: 'Success',
        description: 'Your email is verified now',
        variant: 'default',
      })
      setStep('mobile')
     }
    
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid OTP. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMobileOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
     const res= await verifyMobile(phone, mobileOtp)
          //@ts-ignore
    if(!res.error){
      toast({
        title: 'Success',
        description: 'Your mobile number is verified now',
        variant: 'default',
      })
      setStep('complete')
      await updateSession({
        ...session,
        user: { isvarified: true, onboarding: true },
      })
      setSuccess(true)
    }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid OTP. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Account Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-2">
            <div
              className={`rounded-full p-2 ${
                step === 'email' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              <Mail className="h-6 w-6" />
            </div>
            <div
              className={`rounded-full p-2 ${
                step === 'mobile' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              <Smartphone className="h-6 w-6" />
            </div>
            <div
              className={`rounded-full p-2 ${
                step === 'complete' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
          {step === 'email' && (
            <>
              <Alert>
                <AlertTitle>Step 1: Email Verification</AlertTitle>
                <AlertDescription>
                  Please enter the verification code sent to your email address: {email}
                </AlertDescription>
              </Alert>
              <form onSubmit={handleEmailOtpSubmit}>
                <Input
                  type="text"
                  placeholder="Enter email OTP"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  className="mb-4"
                  disabled={isLoading}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Email OTP'
                  )}
                </Button>
              </form>
            </>
          )}
          {step === 'mobile' && (
            <>
              <Alert>
                <AlertTitle>Step 2: Mobile Verification</AlertTitle>
                <AlertDescription>
                  An OTP has been sent to your mobile number: {phone}. Please enter it below.
                </AlertDescription>
              </Alert>
              <form onSubmit={handleMobileOtpSubmit}>
                <Input
                  type="text"
                  placeholder="Enter mobile OTP"
                  value={mobileOtp}
                  onChange={(e) => setMobileOtp(e.target.value)}
                  className="mb-4"
                  disabled={isLoading}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Mobile OTP'
                  )}
                </Button>
              </form>
            </>
          )}
          {step === 'complete' && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <h2 className="text-xl font-semibold">Verification Complete</h2>
              <p className="text-center text-sm">
                Your account has been successfully verified. You will be redirected to the onboarding
                page in {redirectTimer} seconds.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {step === 'complete' && (
            <Button
              variant="default"
              className="w-full"
              onClick={() => router.push('/auth/onboarding')}
            >
              Go to Onboarding
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
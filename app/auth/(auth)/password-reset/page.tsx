'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { requestPasswordReset } from '@/action/userRegistration' // Ensure the import path is correct

// Zod schema for form validation
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
})

export default function RequestPasswordResetForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false) // Track success state
  const router = useRouter()
  const { toast } = useToast()

  // React Hook Form setup with zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const res = await requestPasswordReset(data)  // Ensure the API request is correct
      
      setIsSuccess(true) // Set success state when API call is successful
      
      toast({
        title: "Reset link sent",
        description: "If an account exists for this email, you will receive a password reset link shortly.",
      })
      
      // Optionally, redirect to a confirmation page after a few seconds

    } catch (error) {
      setIsSuccess(false) // If there's an error, reset success state
      toast({
        title: "Error",
        description: "There was a problem sending the reset link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            {isSuccess ? "Please check your inbox and follow the instructions to complete the reset process." : "Enter your email address and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isSuccess ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            type="email"
                            placeholder="Enter your email address"
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
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
              <h2 className="text-lg font-bold text-gray-700">Success!</h2>
              <p className="text-sm text-gray-500">A password reset link has been sent to your email.</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          {!isSuccess && (
            <Button variant="link" onClick={() => router.push('/auth/signin')} className="text-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          )}
            <Button variant="link" onClick={() => router.push('/auth/signin')} className="text-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { stat } from 'fs'
import Link from 'next/link'
import { verfiyToken } from '@/action/factoryFunction'

const TokenVerifyPage = () => {
  const { token } = useParams()
  const { data: session,user, status, update } = useSession()
 console.log(session,user, status, update); 
 
if(status==='authenticated' && !session?.user?.isverified){
  try {
    const res = verfiyToken(token,session.id);
    if(res)update({isverified:true})
  } catch (error) {
    
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-black shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold">Email Verification Pending</h1>
        <Alert variant={'error'} className="mb-4">
          <p className="text-lg"> Please check your email for the verification link and steps</p>
        </Alert>
        <p className="text-center text-gray-600">
          didn't receive the email? <Link href="#" className="text-blue-500">Resend email</Link>
        </p>
      </div>
    </div>
  );
     
}

if(status==='authenticated' && session?.user?.isverified){
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-black shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold">Email Verified</h1>
        <Alert variant={'success'} className="mb-4">
          <p className="text-lg">Your email has been verified!</p>
        </Alert>
        <p className="text-center text-gray-600">
          You can start using account after completing your profile 
        </p>
      </div>
    </div>
  );
}
if(status== 'unauthenticated'){
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-black shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold">Email Verification</h1>
        <Alert variant={'destructive'} className="mb-4">
          <p className="text-lg">You have been logged out please login & follow email verfication steps </p>
        </Alert>
        <p className="text-center text-gray-600">
          Please check your email for the verification link and steps
        </p>
      </div>
      <Link href='/auth/signin'>
      <Button className="mt-4">
        Go to Login
      </Button>
      </Link>
     
    </div>
  );

}
   
  
  
 
}

export default TokenVerifyPage
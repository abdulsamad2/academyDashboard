import React from 'react'
import Jobs from './components/Jobs'
import { PrismaClient,Prisma } from '@prisma/client'
import { catchAsync } from '@/lib/utils'
const prisma = new PrismaClient()


const page = async () => {
 const tutorRequests = await catchAsync(async () => {
 return await prisma.job.findMany({
    include: {
      user: true
    }
   })
  });
  // @ts-ignore
  return (
      // @ts-ignore

<Jobs tutorRequests={ tutorRequests? tutorRequests :[]} />
  )
}

export default page
import React from 'react'
import Jobs from './components/Jobs'
import { PrismaClient,Prisma } from '@prisma/client'
import { getJobs } from '@/action/jobActions'
const prisma = new PrismaClient()

const page = async () => {
  const tutorRequests = await getJobs()
  return (
     //@ts-ignore
<Jobs tutorRequests={ tutorRequests? tutorRequests :[]} />
  )
}

export default page
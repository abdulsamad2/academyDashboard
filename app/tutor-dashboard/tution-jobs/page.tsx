import React from 'react'
import Jobs from './components/Jobs'
import { checkIfApplied, getJobs } from '@/action/jobActions'
import { auth } from '@/auth'

const page = async () => {
  const tutorRequests = await getJobs()
  const session = await auth()
  const filteredRequests = tutorRequests.filter((request: any) => request.status === 'open')

  return (
      // @ts-ignore

<Jobs currentTutorId={session.id} tutorRequests={ filteredRequests? filteredRequests :[]} />
  )
}

export default page
import React from 'react'
import Jobs from './components/Jobs'
import { getJobs } from '@/action/jobActions'

const page = async () => {
  const tutorRequests = await getJobs()
  const filteredRequests = tutorRequests.filter((request: any) => request.status !== 'closed')

  return (
      // @ts-ignore

<Jobs tutorRequests={ filteredRequests? filteredRequests :[]} />
  )
}

export default page
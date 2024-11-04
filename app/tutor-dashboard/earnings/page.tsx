import React from 'react'
import TutorEarningsDashboard from './earning'
import { auth } from '@/auth'
import { getPayoutForTutor, getTutorPayout } from '@/action/payout'
import { getAssignedStudent } from '@/action/AssignTutor'
import { getUserById } from '@/action/userRegistration'
import { getTutorById } from '@/action/tutorRegistration'


const Page = async () => {
  const session = await auth()
  //@ts-ignore
  const tutorEarning = await getPayoutForTutor(session?.id as string)
    //@ts-ignore
  const assignedStudents = await getAssignedStudent(session?.id as string)
      //@ts-ignore

  const payouts = await getTutorPayout(session?.id as string)
        //@ts-ignore

  const tutorData = await getTutorById(session?.id as string)
  return (
    <div>
{      //@ts-ignore
}      <TutorEarningsDashboard tutordetails={tutorData} payouts={payouts} assignedStudents={assignedStudents.length} thisMonthEarnings={tutorEarning} />
    </div>
  )
  
}

export default Page
import React from 'react'
import TutorEarningsDashboard from './earning'
import { auth } from '@/auth'
import { getPayoutForTutor } from '@/action/payout'
import { getAssignedStudent } from '@/action/AssignTutor'


const Page = async () => {
  const session = await auth()
  //@ts-ignore
  const tutorEarning = await getPayoutForTutor(session?.id as string)
    //@ts-ignore
  const assignedStudents = await getAssignedStudent(session?.id as string)
  
  return (
    <div>
{      //@ts-ignore
}      <TutorEarningsDashboard assignedStudents={assignedStudents.length} thisMonthEarnings={tutorEarning} />
    </div>
  )
  
}

export default Page
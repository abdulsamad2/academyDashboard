import React from 'react'
import SimplifiedTeacherPayoutsPage from './components/payout'
import { getAdminPayout } from '@/action/payout'

const page = async () => {
const payouts = await getAdminPayout()

  return (
    <>
    <SimplifiedTeacherPayoutsPage 
    //@ts-ignore
    teacherPayouts={payouts}/>
    </>
  )
}

export default page
import React from 'react'
import SimplifiedTeacherPayoutsPage from './components/payout'
import { getAdminPayout, getPayouts } from '@/action/payout'

const page = async () => {
const payouts = await getPayouts()
  return (
    <>
    <SimplifiedTeacherPayoutsPage 
    //@ts-ignore
    teacherPayouts={payouts}/>
    </>
  )
}

export default page
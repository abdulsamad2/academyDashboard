import React from 'react'
import SimplifiedTeacherPayoutsPage from './components/payout'
import { getLessonForTutor } from '@/action/addLesson'

const page = async () => {
  const res = await getLessonForTutor()


  return (
    <>
    <SimplifiedTeacherPayoutsPage/>
    </>
  )
}

export default page
import { getAllHoursSoFar } from '@/action/addLesson';
import { recentThreeInvoices } from '@/action/invoice';
import { getsixMonthRevenue } from '@/action/revenue';
import { getAllStudents } from '@/action/studentRegistration';
import { getAllTutors } from '@/action/tutorRegistration';
import AdminPanelHome from '@/components/adminHome'
import React from 'react'

const page =  async() => {
  const student = await getAllStudents();
  const tutor = await getAllTutors();
  const AllHours = await getAllHoursSoFar()
  const recentInvoices = await recentThreeInvoices()
  const sixMonthrevenue = await getsixMonthRevenue()
  
  return (
    <AdminPanelHome tutor={tutor} recentInvoices={recentInvoices} students={student} Allhours ={AllHours}/>
  )
}

export default page
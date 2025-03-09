'use server';

import { db } from "@/db/db";


export const getTutorHourlyForThisStudent = async(studentId:string,tutorId:string)=>{
  const res = await db.studentTutor.findUnique({
    where:{
      studentId_tutorId:{
        studentId:studentId,
        tutorId:tutorId
      }
    }
  })
  return res?.tutorhourly

}
export const getTutorHourlyRate = async (tutorId: string) => {
  try {
    const res = await db.tutor.findUnique({
      where: {
        userId: tutorId,
      },
      select: {
        hourly: true,
      },
    });
    return res;
  } catch (error) {
    throw error; 
  }
};

export const updateTutorHourlyRate = async (tutorId: string, hourlyRate: string) => {
  try {
    const res = await db.tutor.update({
      where: {
        id: tutorId,
      },
      data: {
        hourly: hourlyRate,
      },
    });
    return res;
  } catch (error) {
    throw error; 
  }
};
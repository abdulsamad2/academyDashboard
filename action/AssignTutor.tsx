'use server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const assignTutor = async (studentId: string, tutorId: string) => {
    try {
      return  await prisma.studentTutor.create({
            data: {
              studentId: studentId,
              tutorId: tutorId,
            },
          });

        
    } catch (error) {
        return error
    }
   
  };


  // get tutor based on student id
export const getTutor = async (studentId: string) => {
    try {
      const tutor = await prisma.studentTutor.findMany({
        where: {
          studentId: studentId,
        },
        select: {
          tutorId: true,
        },
      
      });
      return tutor;
    } catch (error) {
      return error;
    }
  };
  export const deleteTutorWithStudent = async(studentId:string,tutorId:string) =>{
    try {
      return await prisma.studentTutor.delete({
        where: {
          studentId_tutorId: {
            studentId: studentId,
            tutorId: tutorId,
          },
        },
      });
    } catch (error) {
      return error;
    }
  }
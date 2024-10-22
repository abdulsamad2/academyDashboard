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

  export const getAssignedStudent = async(tutorId:string) =>{
    try {
      // First, fetch the student IDs assigned to the tutor
      const assignedStudents = await prisma.studentTutor.findMany({
        where: {
          tutorId: tutorId,
        },
        select: {
          studentId: true, // Get only the student IDs
        },
      });
  
      // Extract the array of student IDs
      const studentIds = assignedStudents.map((item) => item.studentId);
  
      // If there are student IDs, fetch the corresponding student data
      if (studentIds.length > 0) {
        const students = await prisma.student.findMany({
          where: {
            id: {
              in: studentIds, // Find all students whose ID is in the studentIds array
            },
          },
        });
  
        return students; // Return the list of student objects
      } else {
        return []; // Return an empty array if no students are assigned
      }
  
    } catch (error) {
      console.error('Error fetching assigned students:', error);
      throw new Error('Unable to fetch assigned students');
    }
  }
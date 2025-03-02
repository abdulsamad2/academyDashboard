'use server';

import { db } from "@/db/db";
import { error } from "console";


export const assignTutor = async (studentId: string, tutorId: string,hourlyRate:number) => {
  

  if(!studentId || !tutorId || !hourlyRate) throw error("studentId and tutorId are required");
    try {
      return  await db.studentTutor.create({
            data: {
              studentId: studentId,
              tutorId: tutorId,
              tutorhourly:Number(hourlyRate)
            },
          });

        
    } catch (error) {
        return error
    }
   
  };


  // get tutor based on student id
export const getTutor = async (studentId: string) => {
    try {
      const tutor = await db.studentTutor.findMany({
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
      return await db.studentTutor.delete({
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
export const getAssignedStudent = async (tutorId: string) => {
  try {
    // First, fetch the student IDs assigned to the tutor from StudentTutor table
    const assignedStudents = await db.studentTutor.findMany({
      where: {
        tutorId: tutorId
      },
      select: {
        studentId: true,
        tutorhourly: true
      }
    });

    // Extract the array of student IDs
    const studentIds = assignedStudents.map((item) => item.studentId);

    // If there are student IDs, fetch the corresponding student data
    if (studentIds.length > 0) {
      const students = await db.student.findMany({
        where: {
          id: {
            in: studentIds
          }
        },
        select: {
          id: true,
          name: true,
          school: true,
          level: true,
          subject: true,
          class: true,
          age: true,
          sex: true,
          studymode: true,
          parent: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          }
        }
      });

      // Add the hourly rate from the StudentTutor table to each student
      const studentsWithRate = students.map((student) => {
        const relatedTutor = assignedStudents.find(
          (a) => a.studentId === student.id
        );
        return {
          ...student,
          hourlyRate: relatedTutor ? relatedTutor.tutorhourly : null
        };
      });

      return studentsWithRate;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching assigned students:', error);
    throw new Error('Unable to fetch assigned students');
  }
};

  // get tutor based on student for parent dashboard
  export const getParentSidetutorStudent = async (studentId: string) => {
    if(!studentId) throw error("studentId is required");
    console.log(studentId)
    try {
      
      const tutorName = await db.studentTutor.findMany({
        where: {
          studentId,
        },
        include: {
          tutor: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      })
      // convert it to array 
      const tutorNameArray = tutorName.map((item) => item.tutor.name);
      return tutorNameArray;
    } catch (error) {
      return error;
    }
  };
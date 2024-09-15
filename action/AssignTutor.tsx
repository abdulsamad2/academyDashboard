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
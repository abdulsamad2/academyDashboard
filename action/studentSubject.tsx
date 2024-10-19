'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createStudentSubject = async (studentId: number, subjectId: number) => {
  try {
    const res = await prisma.studentSubject.create({
      data: {
        studentId: studentId,
        subjectId: subjectId,
      },
    });
    return { status: 'success', message: 'Student subject created successfully', data: res };
  } catch (error) {
    console.error('Error creating student subject:', error);
    throw error; // Re-throw the error for proper error handling
  }
};
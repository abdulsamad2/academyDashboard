'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addLesson = async (lessonData: any) => {
  try {
    const res = await prisma.lesson.create({
        data: {
            studentId: lessonData.studentId,
            tutorId: lessonData.tutorId,
            description: lessonData.description,
            date: new Date(lessonData.date).toISOString(),
            startTime: lessonData.startTime,
            endTime: lessonData.endTime,
          },
    });
    return {status: 'success', message: 'Lesson created successfully', data: res}
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error; // Re-throw the error for proper error handling
  }
};
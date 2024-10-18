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
            totalDuration: lessonData.totalDuration,
          },
    });
    return {status: 'success', message: 'Lesson created successfully', data: res}
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error; // Re-throw the error for proper error handling
  }
};

export const getLessons = async () => {
  try {
    const res = await prisma.lesson.findMany({
      include: {
        student: true,
        tutor: true,
      },
    });
    return res

  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error; // Re-throw the error for proper error handling
  }
};

export const getLesson = async (id: number) => {
  try {
    const res = await prisma.lesson.findUnique({
      where: {
        id: id,
      },
    });
    return {status: 'success', message: 'Lesson fetched successfully', data: res}
  } catch (error) {
    console.error('Error fetching lesson:', error);
    throw error; // Re-throw the error for proper error handling
  }
};

export const getLessonForStudent = async (studentId: string) => {
  try {
    const res = await prisma.lesson.findMany({
      where: {
        studentId: studentId,
      },
      include: {
        student: true,
        tutor: true,
      },
    });
    return res;
  } catch (error) {
    console.error('Error fetching lesson:', error);
    throw error; // Re-throw the error for proper error handling
  }
};
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
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  try {
    const res = await prisma.lesson.findMany({
      where: {
        studentId: studentId,
        startTime: {
          gte: firstDayOfMonth, // Get lessons starting from the first of the current month
        },
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

export const getTotalDurationForStudentThisMonth = async (studentId: string) => {
  try {
    // Get the first day of the current month
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    // Query the lessons from the first day of the current month for the given student
    const lessons = await prisma.lesson.findMany({
      where: {
        studentId: studentId,
        startTime: {
          gte: firstDayOfMonth, // Filter for lessons starting from the first of the current month
        },
      },
      select: {
        totalDuration: true, // Only select the totalDuration field (assumed to be in minutes)
      },
    });

    // Sum the total duration in minutes
    const totalDurationMinutes = lessons.reduce((total, lesson) => {
      return total + (lesson.totalDuration || 0); // Sum the totalDuration field (in minutes)
    }, 0);

    // Calculate hours and remainder minutes
    const totalHours = Math.floor(totalDurationMinutes / 60); // Whole hours
    const remainderMinutes = totalDurationMinutes % 60; // Remaining minutes

    return {
      totalHours,         // Total whole hours
      remainderMinutes,   // Remainder minutes
    };
  } catch (error) {
    console.error('Error calculating total duration:', error);
    throw error; // Re-throw the error for proper error handling
  }
};

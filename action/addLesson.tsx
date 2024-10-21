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
            subject:lessonData.subject,
            date: new Date(lessonData.date).toISOString(),
            startTime: lessonData.startTime,
            endTime: lessonData.endTime,
            totalDuration: lessonData.totalDuration,
          },
    });
    return {status: 'success', message: 'Lesson created successfully', data: res}
  } catch (error) {
    return {status: 'error', error: 'Failed to create lesson',}
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

// export const getLesson = async (id: number) => {
//   try {
//     const res = await prisma.lesson.findUnique({
//       where: {
//         id: id,
//       },
//     });
//     return {status: 'success', message: 'Lesson fetched successfully', data: res}
//   } catch (error) {
//     console.error('Error fetching lesson:', error);
//     throw error; // Re-throw the error for proper error handling
//   }
// };

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

    // Query lessons from the first day of the current month for the given student, grouped by subject
    const lessons = await prisma.lesson.findMany({
      where: {
        studentId: studentId,
        startTime: {
          gte: firstDayOfMonth, // Filter for lessons starting from the first of the current month
        },
      },
      select: {
        subject: true,       // Select the subject field
        totalDuration: true, // Select the totalDuration field (in minutes)
      },
      
    });

    // Create a map to track total durations per subject
    const subjectDurationMap: { [subject: string]: number } = {};

    // Accumulate total duration for each subject
    lessons.forEach((lesson) => {
      const { subject, totalDuration } = lesson;
      if (!subjectDurationMap[subject]) {
        subjectDurationMap[subject] = 0; // Initialize if not present
      }
      subjectDurationMap[subject] += totalDuration || 0; // Sum the durations for each subject
    });

    // Convert the total duration for each subject from minutes to hours and minutes
    const totalDurationBySubject = Object.entries(subjectDurationMap).map(([subject, totalDurationMinutes]) => {
      const totalHours = Math.floor(totalDurationMinutes / 60); // Whole hours
      const remainderMinutes = totalDurationMinutes % 60; // Remaining minutes
      return {
        subject,           // The subject name
        totalHours,        // Total hours for this subject
        remainderMinutes,  // Remaining minutes for this subject
      };
    });

    // Calculate the overall total hours and minutes across all subjects
    const overallTotalMinutes = lessons.reduce((total, lesson) => {
      return total + (lesson.totalDuration || 0); // Sum the totalDuration field for all lessons
    }, 0);
    const overallTotalHours = Math.floor(overallTotalMinutes / 60); // Whole hours
    const overallRemainderMinutes = overallTotalMinutes % 60; // Remaining minutes
  
    return {
      totalDurationBySubject,  // Array of total hours and minutes per subject
      overallTotalHours,       // Overall total whole hours across all subjects
      overallRemainderMinutes, // Overall remaining minutes across all subjects
    };
  } catch (error) {
    console.error('Error calculating total duration by subject:', error);
    throw error; // Re-throw the error for proper error handling
  }
};


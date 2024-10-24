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
            tutorhourly: lessonData.tutorhourly,
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
     
    
    });
    const summary = lessons.reduce((acc, lesson) => {
      const { subject, totalDuration, tutorhourly } = lesson;
    
      // Check if the subject already exists in the accumulator
      //@ts-ignore
      if (!acc[subject]) {
              //@ts-ignore

        acc[subject] = {
          totalDuration: 0,
          tutorhourly: tutorhourly
        };
      }
    
      // Add the current lesson's duration to the total duration
            //@ts-ignore

      acc[subject].totalDuration += totalDuration;
    
      // Return the accumulator
      return acc;
    }, {});
    const resultArray = Object.keys(summary).map(key => ({
      subject: key,
            //@ts-ignore

      totalDuration: summary[key].totalDuration,
            //@ts-ignore

      tutorhourly: summary[key].tutorhourly
    }));
        return resultArray;
        
  } catch (error) {
    console.error('Error calculating total duration by subject:', error);
    throw error; // Re-throw the error for proper error handling
  }
};


export const getAllHoursSoFar = async () => {
  try {
    const res = await prisma.lesson.findMany({
      select: {
        totalDuration: true,
      },
    });
    //@ts-ignore
    const totalDuration = res.reduce((acc, lesson) => acc + lesson.totalDuration, 0);
// convert mintues to hours in decimal for remaining minues
    const hours = Math.floor(totalDuration / 60);
    const minutes = totalDuration % 60;
   return {hours,minutes}  
  } catch (error) {
    console.error('Error fetching total duration:', error);
    throw error; // Re-throw the error for proper error handling
  }
};
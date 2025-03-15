'use server';

import { db } from "@/db/db";


interface Lesson {
  id: string;
  subject: string;
  totalDuration: number;
  tutorhourly: number;
  tutorId: string;
}

interface SummaryItem {
  lessonId: string;
  totalDuration: number;
  tutorhourly: number;
  tutorId: string;
}


export const addLesson = async (lessonData: any) => {
  try {
    const res = await db.lesson.create({
      data: {
        studentId: lessonData.studentId,
        tutorId: lessonData.tutorId,
        description: lessonData.description,
        subject: lessonData.subject,
        date: new Date(lessonData.date).toISOString(),
        startTime: lessonData.startTime,
        endTime: lessonData.endTime,
        totalDuration: lessonData.totalDuration,
        tutorhourly: String(lessonData.tutorhourly),
      },
    });
    return { status: 'success', message: 'Lesson created successfully', data: res }
  } catch (error) {
    console.error('Error creating lesson:', error);
    return { status: 'error', error: 'Failed to create lesson', }
  }
};

export const getLessons = async () => {
  try {
    const res = await db.lesson.findMany({
      include: {
        student: true,
        tutor: true,
      },
      orderBy: {
        createdAt: 'desc',
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
//     const res = await db.lesson.findUnique({
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

export const getLessonForStudent = async (
  studentId: string,
  month?: number,
  year?: number
) => {
  try {
    // Set defaults to current month/year if not provided
    const currentDate = new Date();
    const targetMonth = month !== undefined ? month : currentDate.getMonth();
    const targetYear = year !== undefined ? year : currentDate.getFullYear();

    // Get the first day of the specified month
    const firstDayOfMonth = new Date(targetYear, targetMonth, 1);

    // Get the first day of the next month (for end date range)
    const firstDayOfNextMonth = new Date(targetYear, targetMonth + 1, 1);

    // Query lessons for the given month and student
    const res = await db.lesson.findMany({
      where: {
        studentId: studentId,
        startTime: {
          gte: firstDayOfMonth, // Greater than or equal to the first day of the month
          lt: firstDayOfNextMonth // Less than the first day of the next month
        }
      },
      include: {
        student: true,
        tutor: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res;
  } catch (error) {
    console.error('Error fetching lesson:', error);
    throw error; // Re-throw the error for proper error handling
  }
};

export const getTotalDurationByMonth = async (
  studentId: string,
  month?: number,
  year?: number
) => {
  try {
    // Set defaults to current month/year if not provided
    const currentDate = new Date();
    const targetMonth = month !== undefined ? month : currentDate.getMonth();
    const targetYear = year !== undefined ? year : currentDate.getFullYear();

    // Get the first day of the specified month
    const firstDayOfMonth = new Date(targetYear, targetMonth, 1);

    // Get the first day of the next month (for end date range)
    const firstDayOfNextMonth = new Date(targetYear, targetMonth + 1, 1);

    // Query lessons for the given month and student, grouped by subject
    const lessons = await db.lesson.findMany({
      where: {
        studentId: studentId,
        startTime: {
          gte: firstDayOfMonth, // Greater than or equal to the first day of the month
          lt: firstDayOfNextMonth // Less than the first day of the next month
        }
      }
    });

    // Define the SummaryItem type for better type safety
    interface SummaryItem {
      lessonId: string;
      totalDuration: number;
      tutorhourly: string | number;
      tutorId: string;
    }

    // Aggregate lessons by subject
    const summary = lessons.reduce(
      (acc: Record<string, SummaryItem>, lesson: any) => {
        const { id, subject, totalDuration, tutorhourly, tutorId } = lesson;

        // Check if the subject already exists in the accumulator
        if (!acc[subject]) {
          acc[subject] = {
            lessonId: id,
            totalDuration: 0,
            tutorhourly: tutorhourly,
            tutorId: tutorId
          };
        }

        // Add the current lesson's duration to the total duration
        acc[subject].totalDuration += totalDuration || 0;

        return acc;
      },
      {}
    );

    // Convert the summary object to an array of results
    const resultArray = Object.keys(summary).map((key) => ({
      subject: key,
      totalDuration: summary[key].totalDuration,
      tutorhourly: summary[key].tutorhourly,
      tutorId: summary[key].tutorId,
      lessonId: summary[key].lessonId,
      // Add month and year for reference
      month: targetMonth,
      year: targetYear
    }));

    return resultArray;
  } catch (error) {
    console.error('Error calculating total duration by subject:', error);
    throw error; // Re-throw the error for proper error handling
  }
};

export const getAllHoursSoFar = async () => {
  try {
    const res = await db.lesson.findMany({
      select: {
        totalDuration: true,
      },
    });
    //@ts-ignore
    const totalDuration = res.reduce((acc, lesson) => acc + lesson.totalDuration, 0);
    // convert mintues to hours in decimal for remaining minues
    const hours = Math.floor(totalDuration / 60);
    const minutes = totalDuration % 60;
    return { hours, minutes }
  } catch (error) {
    console.error('Error fetching total duration:', error);
    throw error; // Re-throw the error for proper error handling
  }
};


export const getLessonForTutor = async () => {
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);


  try {
    const lesson = await db.item.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });



    return lesson;

  } catch (error) {
    console.error('Error fetching lesson:', error);
    return { error: 'An error occurred while fetching the lesson.' };
  }

}


// update lesson 
export const updateLesson = async (lessonId: string, lessonData: any) => {
  try {
    const res = await db.lesson.update({
      where: {
        id:lessonId
      },
      data: {
        studentId: lessonData.studentId ?? undefined,
        tutorId: lessonData.tutorId ?? undefined,
        description: lessonData.description ?? undefined,
        subject: lessonData.subject ?? undefined,
        date: lessonData.date ? new Date(lessonData.date).toISOString() : undefined,
        startTime: lessonData.startTime ?? undefined,
        endTime: lessonData.endTime ?? undefined,
        totalDuration: lessonData.totalDuration ?? undefined,
        tutorhourly: lessonData.tutorhourly ? String(lessonData.tutorhourly) : undefined,
      },
    });
    return { status: 'success', message: 'Lesson updated successfully', data: res }
  } catch (error) {
    console.error('Error updating lesson:', error);
    return { status: 'error', error: 'Failed to update lesson', }
  }
};

export const getLessonForThisTutorAndStudent = async (tutorId: string, studentId: string) => {
  try {
    const res = await db.lesson.findMany({
      where: {
        tutorId: tutorId,
        studentId: studentId,
      },
      include: {
        student: true,
        tutor: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return res;
  } catch (error) {
    console.error('Error fetching lesson:', error);
    throw error; // Re-throw the error for proper error handling
  }
};


export const getTotalDurationForStudentandTutorThisMonth = async (studentId: string,tutorId:string) => {
  try {
    // Get the first day of the current month
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    // Query lessons from the first day of the current month for the given student, grouped by subject
    const lessons = await db.lesson.findMany({
      where: {
        studentId: studentId,
        tutorId: tutorId,
        startTime: {
          gte: firstDayOfMonth, // Filter for lessons starting from the first of the current month
        },
      },


    });

    const summary = lessons.reduce((acc: Record<string, SummaryItem>, lesson: any) => {
      const { id, subject, totalDuration, tutorhourly, tutorId } = lesson;

      // Check if the subject already exists in the accumulator
      if (!acc[subject]) {
        acc[subject] = {
          lessonId: id,
          totalDuration: 0,
          tutorhourly: tutorhourly,
          tutorId: tutorId // Store the single tutorId directly
        };
      }

      // Add the current lesson's duration to the total duration
      acc[subject].totalDuration += totalDuration;

      return acc;
    }, {});

    const resultArray = Object.keys(summary).map(key => ({
      subject: key,
      totalDuration: summary[key].totalDuration,
      tutorhourly: summary[key].tutorhourly,
      tutorId: summary[key].tutorId,
      lessonId: summary[key].lessonId,
    }));
    return resultArray;

  } catch (error) {
    console.error('Error calculating total duration by subject:', error);
    throw error; // Re-throw the error for proper error handling
  }
};

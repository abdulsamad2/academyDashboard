'use server';

import { db } from "@/db/db";


export const getTutorHourlyRate = async (tutorId: string) => {
  try {
    const res = await db.tutor.findUnique({
      where: {
        userId: tutorId,
      },
      select: {
        hourly: true,
      },
    });
    return res;
  } catch (error) {
    throw error; // Re-throw the error for proper error handling
  }
};

export const updateTutorHourlyRate = async (tutorId: string, hourlyRate: string) => {
  try {
    const res = await db.tutor.update({
      where: {
        id: tutorId,
      },
      data: {
        hourly: hourlyRate,
      },
    });
    return res;
  } catch (error) {
    throw error; // Re-throw the error for proper error handling
  }
};
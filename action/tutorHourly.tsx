'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getTutorHourlyRate = async (tutorId: string) => {
  try {
    const res = await prisma.tutor.findUnique({
      where: {
        userId: tutorId,
      },
    });
    return res;
  } catch (error) {
    throw error; // Re-throw the error for proper error handling
  }
};

export const updateTutorHourlyRate = async (tutorId: string, hourlyRate: string) => {
  try {
    const res = await prisma.tutor.update({
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
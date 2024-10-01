'use server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Define the function with proper types and parameters
export const addClass = async (
  description: string,
  startTime: string,
  endTime: string,
  studentId: string,
  tutorId: string
) => {
  try {
    const classData = await prisma.class.create({
      data: {
        description,
        startTime: new Date(startTime),  // Convert to Date object
        EndTime: new Date(endTime),      // Convert to Date object
        studentId,
        tutorId
      },
    });
    return classData;
  } catch (error) {
    console.error('Error creating class:', error);
    return { error: 'Failed to create class' };
  }
};

export const getClasses = async () => {
  try {
    const classes = await prisma.class.findMany();
    return classes;
  } catch (error) {
    console.error('Error fetching classes:', error);
    return { error: 'Failed to fetch classes' };
  }
};

export const getClassById = async (id: string) => {
  try {
    const classData = await prisma.class.findUnique({
      where: { id },
    });
    return classData;
  } catch (error) {
    console.error('Error fetching class by ID:', error);
    return { error: 'Failed to fetch class' };
  }
};

export const updateClass = async (
  id: string,
  description: string,
  startTime: string,
  endTime: string,
  studentId: string,
  tutorId: string
) => {
  try {
    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        description,
        startTime: new Date(startTime),  // Convert to Date object
        EndTime: new Date(endTime),      // Convert to Date object
        studentId,
        tutorId
      },
    });
    return updatedClass;
  } catch (error) {
    console.error('Error updating class:', error);
    return { error: 'Failed to update class' };
  }
};

export const deleteClass = async (id: string) => {
  try {
    const deletedClass = await prisma.class.delete({
      where: { id },
    });
    return deletedClass;
  } catch (error) {
    console.error('Error deleting class:', error);
    return { error: 'Failed to delete class' };
  }
};
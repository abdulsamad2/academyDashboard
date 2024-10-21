'use server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const addSubject = async (
 formData: { name: string; }
  ) => {
    const { name } = formData;
    try {
      const subject = await prisma.subject.create({
        data: {
            name,
            
        },
      });
      return {status:"success",subject};
      
    } catch (error) {
      console.error('Error adding subject:', error);
      throw error;
    }
  };
  
  export const getSubjects = async () => {
    try {
      const subjects = await prisma.subject.findMany();
      return subjects;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  };

  export const getSubjectById = async (id: string) => {
    try {
      const subject = await prisma.subject.findUnique({
        where: { id },
      });
      return subject;
    } catch (error) {
      console.error('Error fetching subject by ID:', error);
      throw error;
    }
  };

  export const updateSubject = async (
    id: string,
    name: string,
   
  ) => {
    try {
      const updatedSubject = await prisma.subject.update({
        where: { id },
        data: {
          name,
        },
      });
      return updatedSubject;
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  };

  export const deleteSubject = async (id: string) => {
    try {
      const deletedSubject = await prisma.subject.delete({
        where: { id },
      });
      return deletedSubject;
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  };
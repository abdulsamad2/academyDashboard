'use server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const deleteDb = (id: any, model: any) => {
  return prisma?.model?.delete({
    where: {
      id
    }
  });
};

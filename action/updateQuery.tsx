'use server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function updateQuery(id: string, data: any) {
  try {
    // Upsert operation on the user model
    const res = await prisma.user.upsert({
      where: {
        id: id
      },
      update: {
        ...data
      },
      create: {
        id: id,
        ...data
      }
    });

    return res;
  } catch (error) {
    console.error(`Error upserting record with ID ${id} in model user:`, error);
    throw error; // Re-throw the error after logging it
  }
}

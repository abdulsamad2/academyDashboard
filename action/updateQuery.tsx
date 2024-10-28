'use server';
import { db } from "@/db/db";

export async function updateQuery(id: string, data: any) {
  try {
    // Upsert operation on the user model
    const res = await db.user.upsert({
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

'use server';
import { db } from '@/db/db';
import { revalidatePath } from 'next/cache';

export async function updateTutorRating(
  tutorId: string,
  rating: string,
  feedback: string
) {
  try {
    await db.tutor.update({
      where: {
        id: tutorId
      },
      data: {
        rating: rating,
        feedback: feedback
      }
    });
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to update tutor rating.');
  }
}

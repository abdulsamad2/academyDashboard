'use server';

import { auth } from '@/auth';
import { db } from '@/db/db';
import { revalidatePath } from 'next/cache';

export async function approveTutor(userId: string) {
  const session = await auth();
  //@ts-ignore
  if (!session?.id || session.role !== 'admin') {
    return { error: 'Not authorized' };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: { status: 'active' }
    });
    revalidatePath('/dashboard/approvals');
    return { success: 'Tutor approved' };
  } catch (error) {
    console.error('Error approving tutor:', error);
    return { error: 'Failed to approve tutor' };
  }
}

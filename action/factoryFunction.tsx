'use server';

import { db } from '@/db/db';
import { requireUser } from '@/lib/authz';

// Only these models may be deleted through this generic helper, and each
// carries its own authorization rule. Anything not listed is rejected.
const DELETABLE = ['user', 'student', 'subject', 'lesson'] as const;
type Deletable = (typeof DELETABLE)[number];

export const deleteDb = async (id: string, modelName: string) => {
  try {
    const auth = await requireUser();
    if (!auth.ok) return { error: auth.error };

    if (!DELETABLE.includes(modelName as Deletable)) {
      return { error: 'This record type cannot be deleted here.' };
    }

    const isAdmin = auth.role === 'admin';

    // Ownership rules for non-admins. Admins may delete any of the above.
    if (!isAdmin) {
      if (modelName === 'student') {
        // A parent may only delete their own student.
        const student = await db.student.findUnique({
          where: { id },
          select: { parentId: true }
        });
        if (!student || student.parentId !== auth.userId) {
          return { error: 'You can only delete your own students.' };
        }
      } else {
        // user / subject / lesson deletion is admin-only.
        return { error: 'Admin access required.' };
      }
    }

    //@ts-ignore - dynamic model access
    const res = await db[modelName].delete({ where: { id } });
    return res;
  } catch (error) {
    console.error(
      `Error deleting record with ID ${id} from model ${modelName}:`,
      error
    );
    return { error: 'Failed to delete record.' };
  }
};

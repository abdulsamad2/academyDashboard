'use server';
import { db } from '@/db/db';
import { requireAdmin, requireUser } from '@/lib/authz';

export const saveSecurityDeposit = async (data: any) => {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };
    const res = await db.deposit.create({
      data: {
        studentId: data.studentId,
        parentId: data.parentId,
        depositAmount: data.depositAmount,
        status: data.status,
        invoiceNumber: data.invoiceNumber,
        date: new Date(data.date)
      }
    });
    return res;
  } catch (error) {
    console.error('Error saving security deposit:', error);
    return { error: 'Error saving security deposit' };
  }
};

export const getSecurityDepositByParentId = async (parentId: string) => {
  try {
    // IDOR guard: non-admins only see their own deposits.
    const guard = await requireUser();
    if (!guard.ok) return { error: guard.error };
    const ownerId = guard.role === 'admin' ? parentId : guard.userId;
    const res = await db.deposit.findMany({
      where: {
        parentId: ownerId
      },
      include: {
        // Add the colon here
        student: {
          select: {
            name: true
          }
        }
      }
    });

    return res;
  } catch (error) {
    console.error('Error fetching security deposit:', error);
    return { error: 'Error fetching security deposit' };
  }
};

export const deleteSecurityDeposit = async (id: string) => {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };
    const res = await db.deposit.delete({
      where: {
        id: id
      }
    });
    return res;
  } catch (error) {
    console.error('Error deleting security deposit:', error);
    return { error: 'Error deleting security deposit' };
  }
};

export const getAllSecurityDeposits = async () => {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };
    const res = await db.deposit.findMany({
      include: {
        parent: {
          select: {
            name: true,
            email: true
          }
        },
        student: {
          select: {
            name: true
          }
        }
      }
    });
    return res;
  } catch (error) {
    console.error('Error fetching security deposit:', error);
    return { error: 'Error fetching security deposit' };
  }
};

export const updateSecurityDepositStatus = async (
  id: string,
  status: string
) => {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };
    const res = await db.deposit.update({
      where: {
        id: id
      },
      data: {
        status: status
      }
    });
    return res;
  } catch (error) {
    console.error('Error updating security deposit:', error);
    return { error: 'Error updating security deposit' };
  }
};

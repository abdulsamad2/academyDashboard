'use server';
import { db } from '@/db/db';

export const saveSecurityDeposit = async (data: any) => {
  try {
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
    const res = await db.deposit.findMany({
      where: {
        parentId: parentId
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

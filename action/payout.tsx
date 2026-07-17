'use server';

import { db } from '@/db/db';
import { requireAdmin, requireUser } from '@/lib/authz';

export const getAdminPayout = async () => {
  const guard = await requireAdmin();
  if (!guard.ok) return { error: guard.error };
  // only get for this month
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  try {
    const lesson = await db.item.findMany({
      where: {
        createdAt: {
          gte: firstDayOfMonth
        }
      },

      include: {
        tutor: {
          include: {
            tutor: true
          }
        }
      }
    });

    const separatedForEachTutor = lesson.reduce(
      (acc, lesson) => {
        const tutorId = lesson.tutorId;
        const tutorData = { ...lesson.tutor, ...lesson.tutor.tutor };
        if (!acc[tutorId]) {
          acc[tutorId] = { tutorData, lessons: [] };
        }
        acc[tutorId].lessons.push(lesson);
        return acc;
      },
      {} as Record<string, { tutorData: any; lessons: any[] }>
    );

    const payouts = Object.keys(separatedForEachTutor).map((tutorId) => {
      const { tutorData, lessons } = separatedForEachTutor[tutorId];
      const totalEarning = lessons.reduce(
        (total, lesson) => total + lesson.totalAmount,
        0
      );
      // Sum the explicit per-item tutor allowance × totalHours.
      // For legacy items without an allowance, fall back to the 73% rule.
      const payoutAmount = lessons.reduce((sum: number, l: any) => {
        const allowance =
          l.tutorAllowance !== undefined && l.tutorAllowance !== null
            ? l.tutorAllowance
            : (l.tutorHourly ?? 0) * 0.73;
        return sum + (l.totalHours ?? 0) * allowance;
      }, 0);

      return {
        totalEarning,
        id: tutorData.userId,
        name: tutorData.name,
        email: tutorData.email,
        avatar: tutorData.profilepic,
        bankName: tutorData.bank,
        accountNumber: tutorData.bankaccount, // Masking the account number
        payoutAmount,
        payoutDate: new Date().toISOString().split('T')[0], // Setting payout date to today’s date
        status: 'Pending',
        taxId: 'TAX789012', // Placeholder, replace with actual data if available
        phoneNumber: tutorData.phone,
        address: tutorData.address,
        tutorId,
        tutorPayout: payoutAmount
      };
    });

    return payouts;
  } catch (error: unknown | null | string) {
    return { error: 'An error occurred while fetching the lesson.' };
  }
};

// get payout for tutor for this month
export const getPayoutForTutor = async (tutorId: string) => {
  // IDOR guard: a tutor may only read their own payout figure.
  const guard = await requireUser();
  if (!guard.ok) return 0;
  const scopedTutorId = guard.role === 'admin' ? tutorId : guard.userId;
  tutorId = scopedTutorId;
  const today = new Date();
  // Set the first day of the last month
  const firstDayOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  // Set the last day of the last month
  const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Day 0 of the current month is the last day of the previous month

  try {
    const lessons = await db.item.findMany({
      where: {
        createdAt: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth
        },
        tutorId
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const payoutAmount = lessons.reduce((sum: number, l: any) => {
      const allowance =
        l.tutorAllowance !== undefined && l.tutorAllowance !== null
          ? l.tutorAllowance
          : (l.tutorHourly ?? 0) * 0.73;
      return sum + (l.totalHours ?? 0) * allowance;
    }, 0);

    return payoutAmount;
  } catch (error: unknown | null | string) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

// get payouts

export const getPayouts = async () => {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };
    const payouts = await db.payout.findMany({
      include: {
        User: {
          // This includes user details
          include: {
            tutor: true // This includes the tutor details associated with the user
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const filterData = payouts.map((payout) => {
      return {
        adminId: payout.User.adminId,
        id: payout.id,
        name: payout.User.name,
        email: payout.User.email,
        avatar: payout?.User?.tutor?.profilepic,
        bankName: payout?.User?.tutor?.bank,
        accountNumber: payout?.User?.tutor?.bankaccount, // Masking the account number
        payoutAmount: payout.payoutAmount,
        payoutDate: payout.payoutDate.toISOString().split('T')[0], // Setting payout date to today’s date
        status: payout.status,
        taxId: payout.taxId, // Placeholder, replace with actual data if available
        phoneNumber: payout.User.phone,
        address: payout.User.address,
        tutorId: payout.tutorId,
        tutorPayout: payout.payoutAmount,
        totalEarning: payout.totalEarning,
        penaltyPercentage: payout.penaltyPercentage || null, // Include penalty percentage
        penaltyReason: payout.penaltyReason || null, // Include penalty reason
        updatedAt: payout.updatedAt.toISOString().split('T')[0]
      };
    });

    return filterData;
  } catch (error) {
    console.error('Error fetching payout summary:', error);
    throw error;
  }
};

export const getAllPayoutsFortutor = async (tutorId: string) => {
  try {
    // IDOR guard: a tutor may only read their own payouts (incl. bank details).
    const guard = await requireUser();
    if (!guard.ok) return { error: guard.error };
    const scopedTutorId = guard.role === 'admin' ? tutorId : guard.userId;
    const payouts = await db.payout.findMany({
      where: {
        tutorId: scopedTutorId
      },
      include: {
        User: {
          // This includes user details
          include: {
            tutor: true // This includes the tutor details associated with the user
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    const filterData = payouts.map((payout) => {
      return {
        id: payout.id,
        name: payout.User.name,
        email: payout.User.email,
        avatar: payout?.User?.tutor?.profilepic,
        bankName: payout?.User?.tutor?.bank,
        accountNumber: payout?.User?.tutor?.bankaccount, // Masking the account number
        payoutAmount: payout.payoutAmount,
        payoutDate: payout.payoutDate.toISOString().split('T')[0], // Setting payout date to today’s date
        status: payout.status,
        taxId: payout.taxId, // Placeholder, replace with actual data if available
        phoneNumber: payout.User.phone,
        address: payout.User.address,
        tutorId: payout.tutorId,
        tutorPayout: payout.payoutAmount,
        totalEarning: payout.totalEarning,
        updatedAt: payout.updatedAt.toISOString().split('T')[0]
      };
    });
    return filterData;
  } catch (error) {
    console.error('Error fetching payout summary:', error);
    throw error;
  }
};

export const updatePayoutStatus = async (payoutId: string, status: string) => {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };
    const payout = await db.payout.update({
      where: {
        id: payoutId
      },
      data: {
        status
      }
    });
    return payout;
  } catch (error) {
    console.error('Error updating payout status:', error);
    throw error;
  }
};

export const getTutorPayout = async (tutorId: string) => {
  try {
    // IDOR guard: a tutor may only read their own payout history.
    const guard = await requireUser();
    if (!guard.ok) return { error: guard.error };
    const scopedTutorId = guard.role === 'admin' ? tutorId : guard.userId;
    const payout = await db.payout.findMany({
      where: {
        tutorId: scopedTutorId
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    const filterData = payout.map((payout) => {
      return {
        id: payout.id,
        payoutAmount: payout.payoutAmount,
        penaltyReason: payout.penaltyReason,
        penaltyPercentage: payout.penaltyPercentage,
        payoutDate: payout.payoutDate.toISOString().split('T')[0], // Setting payout date to today’s date
        status: payout.status,
        tutorPayout: payout.payoutAmount,
        updatedAt: payout.updatedAt.toISOString().split('T')[0]
      };
    });
    return filterData;
  } catch (error) {
    console.error('Error fetching payout summary:', error);
    throw error;
  }
};

export const deletePayout = async (payoutId: string) => {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };
    const payout = await db.payout.delete({
      where: {
        id: payoutId
      }
    });
    return payout;
  } catch (error) {
    return { error: 'An error occurred while deleting the payout.' };
  }
};

export const updatePayoutWithPenalty = async (
  payoutId: string,
  penaltyPercentage: number,
  penaltyReason: string
) => {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };

    // Fetch the payout record
    const payout = await db.payout.findUnique({
      where: {
        id: payoutId
      }
    });

    if (!payout) {
      return { error: 'Payout not found.' };
    }

    // Reverse any previously-applied penalty to recover the base amount,
    // then apply the new penalty. This makes the operation idempotent and
    // re-appliable instead of compounding against an already-reduced value.
    const oldPct = payout.penaltyPercentage ?? 0;
    const base =
      oldPct < 100 ? payout.payoutAmount / (1 - oldPct / 100) : payout.payoutAmount;
    const newPayoutAmount =
      Math.round(base * (1 - penaltyPercentage / 100) * 100) / 100;

    // Update the payout record with penalty details
    const updatedPayout = await db.payout.update({
      where: {
        id: payoutId
      },
      data: {
        payoutAmount: newPayoutAmount,
        penaltyPercentage,
        penaltyReason
      }
    });

    return updatedPayout;
  } catch (error) {
    console.error({ error: 'Error updating payout with penalty' });
    return error;
  }
};

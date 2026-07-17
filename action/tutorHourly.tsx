'use server';

import { db } from '@/db/db';
import { requireAdmin } from '@/lib/authz';

export const getTutorHourlyForThisStudent = async (
  studentId: string,
  tutorId: string
) => {
  const res = await db.studentTutor.findUnique({
    where: { studentId_tutorId: { studentId, tutorId } }
  });
  return res?.tutorhourly;
};

/**
 * Returns both the tuition fee (parent rate) and the tutor allowance
 * (tutor rate) for a (student, tutor) pairing. Falls back to the legacy
 * 0.73 ratio for assignments that pre-date the explicit-allowance change.
 */
export const getTutorRatesForThisStudent = async (
  studentId: string,
  tutorId: string
) => {
  const res = await db.studentTutor.findUnique({
    where: { studentId_tutorId: { studentId, tutorId } }
  });
  if (!res) return null;
  const tuitionFee = res.tutorhourly;
  // Transitional fallback: rows created before tutorAllowance existed
  const tutorAllowance =
    (res as any).tutorAllowance ?? Number((tuitionFee * 0.73).toFixed(2));
  return { tuitionFee, tutorAllowance };
};
export const getTutorHourlyRate = async (tutorId: string) => {
  try {
    const res = await db.tutor.findUnique({
      where: {
        userId: tutorId
      },
      select: {
        hourly: true
      }
    });
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateTutorHourlyRate = async (
  tutorId: string,
  hourlyRate: string
) => {
  try {
    // A tutor must not be able to raise their own pay rate.
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };
    const res = await db.tutor.update({
      where: {
        id: tutorId
      },
      data: {
        hourly: hourlyRate
      }
    });
    return res;
  } catch (error) {
    throw error;
  }
};

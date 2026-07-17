'use server';

import { db } from '@/db/db';
import { auth } from '@/auth';
import { requireActiveTutor } from '@/lib/authz';
import { revalidatePath } from 'next/cache';

export interface ReportCardInput {
  id?: string;
  studentId: string;
  subject: string;
  level?: string;
  classId?: string;
  teacherName?: string;
  diagnostic?: number | null;
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  remarks?: string;
}

/** Verify the tutor is assigned to the student. Admins bypass. */
async function canEditStudent(
  studentId: string,
  role?: string,
  tutorId?: string
) {
  if (role === 'admin') return true;
  if (!tutorId) return false;
  const assignment = await db.studentTutor.findFirst({
    where: { studentId, tutorId }
  });
  return Boolean(assignment);
}

function clampScore(v: number | null | undefined): number | null {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return Math.max(0, Math.min(100, Math.round(v)));
}

/**
 * Create or update a report card. One card per (student, subject).
 * Tutors may only touch students assigned to them; admins may touch any.
 */
export const upsertReportCard = async (input: ReportCardInput) => {
  const session = await auth();
  if (!session?.id) return { error: 'Not authenticated' };

  const guard = await requireActiveTutor();
  if (!guard.ok) return { error: guard.error };

  if (!input.studentId || !input.subject?.trim()) {
    return { error: 'Student and subject are required' };
  }

  const allowed = await canEditStudent(
    input.studentId,
    session.role,
    session.id
  );
  if (!allowed) {
    return { error: 'You can only manage report cards for your students' };
  }

  const data = {
    level: input.level?.trim() || null,
    classId: input.classId?.trim() || null,
    teacherName: input.teacherName?.trim() || null,
    diagnostic: clampScore(input.diagnostic),
    q1: clampScore(input.q1),
    q2: clampScore(input.q2),
    q3: clampScore(input.q3),
    q4: clampScore(input.q4),
    remarks: input.remarks?.trim() || null
  };

  try {
    let card;
    if (input.id) {
      const existing = await db.reportCard.findUnique({
        where: { id: input.id }
      });
      if (!existing) return { error: 'Report card not found' };
      if (existing.tutorId !== session.id && session.role !== 'admin') {
        return { error: 'You cannot edit this report card' };
      }
      card = await db.reportCard.update({
        where: { id: input.id },
        data
      });
    } else {
      card = await db.reportCard.upsert({
        where: {
          studentId_subject: {
            studentId: input.studentId,
            subject: input.subject.trim()
          }
        },
        update: data,
        create: {
          studentId: input.studentId,
          subject: input.subject.trim(),
          tutorId: session.id,
          ...data
        }
      });
    }

    revalidatePath('/tutor-dashboard/report-card');
    revalidatePath('/dashboard/report-cards');
    return { status: 'success', card };
  } catch (error) {
    console.error('upsertReportCard failed:', error);
    return { error: 'Could not save the report card' };
  }
};

/** Report cards maintained by the signed-in tutor. */
export const getReportCardsForTutor = async () => {
  const session = await auth();
  if (!session?.id) return [];
  return db.reportCard.findMany({
    where: { tutorId: session.id },
    include: { student: { select: { name: true } } },
    orderBy: { updatedAt: 'desc' }
  });
};

/** All report cards — admin only. */
export const getAllReportCards = async () => {
  const session = await auth();
  if (session?.role !== 'admin') return [];
  return db.reportCard.findMany({
    include: {
      student: { select: { name: true } },
      tutor: { select: { name: true } }
    },
    orderBy: { updatedAt: 'desc' }
  });
};

/** A single report card, with access check (owning tutor or admin). */
export const getReportCardById = async (id: string) => {
  const session = await auth();
  if (!session?.id) return null;
  const card = await db.reportCard.findUnique({
    where: { id },
    include: {
      student: { select: { name: true } },
      tutor: { select: { name: true } }
    }
  });
  if (!card) return null;
  if (card.tutorId !== session.id && session.role !== 'admin') return null;
  return card;
};

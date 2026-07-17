'use server';

import { db } from '@/db/db';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/authz';

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

interface InvoiceItem {
  lessonId: string;
  tutorId: string;
  subject: string;
  totalDuration: number;
  tutorhourly: string; // tuition fee per hour (parent rate)
  tutorAllowance?: number; // tutor allowance per hour (tutor rate)
  totalHours: number;
  totalAmount: number; // totalHours × tuition fee
}

interface SaveInvoiceProps {
  tutorId: string;
  invoiceNumber: string;
  invoiceDate: string;
  parentId: string;
  studentId: string;
  subtotal: number;
  sst: number;
  total: number;
  status: string;
  parent: string;
  items: InvoiceItem[];
  month: number;
  year: number; // Year parameter
}

// Helper function to get the first day of the month
const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Helper function to get the last day of the month
const getLastDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Recompute a tutor's monthly payout AUTHORITATIVELY from the persisted
 * invoice items, then set it (never increment). This is idempotent and
 * correct across:
 *  - re-saving the same month's invoice (the old increment double-counted),
 *  - multiple invoices/students feeding one tutor in the same month,
 *  - legacy items missing an explicit allowance (73% fallback),
 * and it reads the schema field `tutorHourly` (not the client's lowercase
 * `tutorhourly`), which previously produced NaN payouts on the update path.
 *
 * Any penalty already recorded on the payout is preserved by re-applying its
 * percentage to the freshly computed base.
 */
const recomputePayout = async (
  tutorId: string,
  invoiceId: string,
  month: number,
  year: number
) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
  const payoutDate = new Date(year, month, 1);

  try {
    // Authoritative source of truth: every persisted item for this tutor
    // whose invoice falls in this month, across all invoices/students.
    const items = await db.item.findMany({
      where: {
        tutorId,
        Invoice: { date: { gte: firstDayOfMonth, lte: lastDayOfMonth } }
      }
    });

    const totalEarning = round2(
      items.reduce((total, i) => total + (i.totalAmount ?? 0), 0)
    );
    const basePayout = items.reduce((sum, i) => {
      const allowance =
        i.tutorAllowance !== undefined && i.tutorAllowance !== null
          ? i.tutorAllowance
          : (i.tutorHourly ?? 0) * 0.73;
      return sum + (i.totalHours ?? 0) * allowance;
    }, 0);

    const existingPayout = await db.payout.findFirst({
      where: {
        tutorId,
        payoutDate: { gte: firstDayOfMonth, lte: lastDayOfMonth }
      },
      orderBy: { createdAt: 'asc' }
    });

    const pct = existingPayout?.penaltyPercentage ?? 0;
    const payoutAmount = round2(basePayout * (1 - pct / 100));

    if (existingPayout) {
      return await db.payout.update({
        where: { id: existingPayout.id },
        data: { totalEarning, payoutAmount, updatedAt: new Date() }
      });
    }
    return await db.payout.create({
      data: {
        tutorId,
        invoiceId,
        totalEarning,
        payoutAmount,
        payoutDate,
        status: 'Pending',
        taxId: `TAX-${year}${month
          .toString()
          .padStart(2, '0')}-${Math.random().toString(36).substr(2, 6)}`
      }
    });
  } catch (error) {
    console.error('Error handling payout:', error);
    throw error;
  }
};
export const saveInvoice = async (invoiceData: SaveInvoiceProps) => {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };
    const {
      invoiceNumber,
      parentId,
      studentId,
      subtotal,
      sst,
      total,
      status,
      items,
      month, // Month parameter (0-11)
      year // Year parameter
    } = invoiceData;

    // Create date objects for the specified month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0); // Last day of month

    // Use the first day of the specified month for the invoice date
    const invoiceDate = new Date(year, month, 1);

    // Check for existing invoice for this student in the specified month
    const existingInvoice = await db.invoice.findFirst({
      where: {
        studentId,
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      },
      include: {
        items: true
      }
    });

    if (existingInvoice) {
      // Update existing invoice for the specified month
      const updatedSubtotal = existingInvoice.subtotal + subtotal;
      const updatedSst = existingInvoice.sst + sst;
      const updatedTotal = existingInvoice.total + total;

      // Update the invoice
      const updatedInvoice = await db.invoice.update({
        where: {
          id: existingInvoice.id
        },
        data: {
          subtotal: updatedSubtotal,
          sst: updatedSst,
          total: updatedTotal,
          items: {
            create: items.map((item) => ({
              lessonId: item.lessonId,
              tutorId: item.tutorId,
              subject: item.subject,
              totalDuration: item.totalDuration,
              tutorHourly: parseFloat(item.tutorhourly),
              tutorAllowance:
                item.tutorAllowance !== undefined &&
                item.tutorAllowance !== null
                  ? Number(item.tutorAllowance)
                  : Number((parseFloat(item.tutorhourly) * 0.73).toFixed(2)),
              totalHours: item.totalHours,
              totalAmount: item.totalAmount
            })) as any
          }
        },
        include: {
          items: true
        }
      });

      // Recompute payouts for every tutor touched by this month's invoice.
      // recomputePayout reads all persisted items itself, so we only need the
      // distinct tutor ids (existing + new items).
      const affectedTutors = Array.from(
        new Set([
          ...existingInvoice.items.map((i) => i.tutorId),
          ...items.map((i) => i.tutorId)
        ])
      );
      await Promise.all(
        affectedTutors.map((tutorId) =>
          recomputePayout(tutorId, updatedInvoice.id, month, year)
        )
      );

      revalidatePath('/path-to-revalidate');
      return updatedInvoice;
    } else {
      // Create new invoice for the specified month
      const createdInvoice = await db.invoice.create({
        data: {
          invoiceNumber,
          date: invoiceDate, // Use the specified month/year date
          parentId,
          studentId,
          subtotal,
          sst,
          total,
          status,
          items: {
            create: items.map((item) => ({
              lessonId: item.lessonId,
              tutorId: item.tutorId,
              subject: item.subject,
              totalDuration: item.totalDuration,
              tutorHourly: parseFloat(item.tutorhourly),
              tutorAllowance:
                item.tutorAllowance !== undefined &&
                item.tutorAllowance !== null
                  ? Number(item.tutorAllowance)
                  : Number((parseFloat(item.tutorhourly) * 0.73).toFixed(2)),
              totalHours: item.totalHours,
              totalAmount: item.totalAmount
            })) as any
          }
        }
      });

      // Recompute payouts for each tutor in the new invoice.
      const affectedTutors = Array.from(
        new Set(items.map((i) => i.tutorId))
      );
      await Promise.all(
        affectedTutors.map((tutorId) =>
          recomputePayout(tutorId, createdInvoice.id, month, year)
        )
      );

      revalidatePath('/path-to-revalidate');
      return createdInvoice;
    }
  } catch (error) {
    console.error('Error saving invoice and payout:', error);
    return {
      error: 'An error occurred while creating the invoice and payout.'
    };
  }
};

// Function to get payout summary for admin
export const getPayoutSummary = async () => {
  const guard = await requireAdmin();
  if (!guard.ok) return { error: guard.error };
  const firstDayOfMonth = getFirstDayOfMonth(new Date());

  try {
    return await db.payout.findMany({
      where: {
        payoutDate: {
          gte: firstDayOfMonth
        }
      },
      include: {
        //@ts-ignore
        tutor: true,
        invoice: true
      }
    });
  } catch (error) {
    console.error('Error fetching payout summary:', error);
    throw error;
  }
};

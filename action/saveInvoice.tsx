'use server';

import { db } from "@/db/db";
import { revalidatePath } from "next/cache";

interface InvoiceItem {
  lessonId: string;
  tutorId: string;
  subject: string;
  totalDuration: number;
  tutorhourly: string;
  totalHours: number;
  totalAmount: number;
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

// Helper function to calculate payout amount
const calculatePayoutAmount = (totalEarning: number) => {
  return totalEarning * 0.75;
};

// Function to handle payout creation or update
const handlePayout = async (
  tutorId: string,
  invoiceId: string,
  items: InvoiceItem[],
  month: number, // Add month parameter
  year: number // Add year parameter
) => {
  // Create date objects for the specific month/year
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const payoutDate = new Date(year, month, 1); // Use first day of month for consistency

  try {
    // Calculate total earnings for this tutor from the items
    const totalEarning = items
      .filter((item) => item.tutorId === tutorId)
      .reduce((total, item) => total + item.totalAmount, 0);

    // Check for existing payout for this tutor in the specified month
    const existingPayout = await db.payout.findFirst({
      where: {
        tutorId,
        payoutDate: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (existingPayout) {
      // Update existing payout for the same month
      const updatedTotalEarning = existingPayout.totalEarning + totalEarning;
      const updatedPayoutAmount = calculatePayoutAmount(updatedTotalEarning);

      return await db.payout.update({
        where: {
          id: existingPayout.id
        },
        data: {
          totalEarning: updatedTotalEarning,
          payoutAmount: updatedPayoutAmount,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new payout for a new month
      return await db.payout.create({
        data: {
          tutorId,
          invoiceId,
          totalEarning,
          payoutAmount: calculatePayoutAmount(totalEarning),
          payoutDate: payoutDate, // Use the specific month's date
          status: 'Pending',
          taxId: `TAX-${year}${month
            .toString()
            .padStart(2, '0')}-${Math.random().toString(36).substr(2, 6)}`
          // You could also add month and year fields if needed for easier querying
        }
      });
    }
  } catch (error) {
    console.error('Error handling payout:', error);
    throw error;
  }
};
export const saveInvoice = async (invoiceData: SaveInvoiceProps) => {
  try {
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
              totalHours: item.totalHours,
              totalAmount: item.totalAmount
            }))
          }
        },
        include: {
          items: true
        }
      });

      // Group all items (existing + new) by tutor
      const allItems = [...existingInvoice.items, ...items];
      const tutorItems = allItems.reduce(
        (acc, item) => {
          if (!acc[item.tutorId]) {
            acc[item.tutorId] = [];
          }
          //@ts-ignore
          acc[item.tutorId].push(item);
          return acc;
        },
        {} as Record<string, InvoiceItem[]>
      );

      // Update payouts for each tutor
      const payoutPromises = Object.entries(tutorItems).map(
        ([tutorId, items]) =>
          handlePayout(tutorId, updatedInvoice.id, items, month, year) // Pass month and year
      );

      await Promise.all(payoutPromises);

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
              totalHours: item.totalHours,
              totalAmount: item.totalAmount
            }))
          }
        }
      });

      // Group items by tutor for new invoice
      const tutorItems = items.reduce(
        (acc, item) => {
          if (!acc[item.tutorId]) {
            acc[item.tutorId] = [];
          }
          acc[item.tutorId].push(item);
          return acc;
        },
        {} as Record<string, InvoiceItem[]>
      );

      // Handle payout for each tutor
      const payoutPromises = Object.entries(tutorItems).map(
        ([tutorId, items]) => handlePayout(tutorId, createdInvoice.id, items, month, year)
      );

      await Promise.all(payoutPromises);

      revalidatePath('/path-to-revalidate');
      return createdInvoice;
    }
  } catch (error) {
    console.error('Error saving invoice and payout:', error);
    return {
      error: 'An error occurred while creating the invoice and payout.'
    };
  } finally {
    await db.$disconnect();
  }
};


// Function to get payout summary for admin
export const getPayoutSummary = async () => {
  const firstDayOfMonth = getFirstDayOfMonth(new Date());
  
  try {
    return await db.payout.findMany({
      where: {
        payoutDate: {
          gte: firstDayOfMonth,
        },
      },
      include: {
        //@ts-ignore
        tutor: true,
        invoice: true,
      },
    });
  } catch (error) {
    console.error('Error fetching payout summary:', error);
    throw error;
  }
};
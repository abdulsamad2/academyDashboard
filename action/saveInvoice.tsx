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
  items: InvoiceItem[]
) => {
  const today = new Date();
  const firstDayOfMonth = getFirstDayOfMonth(today);
  
  try {
    const totalEarning = items
      .filter(item => item.tutorId === tutorId)
      .reduce((total, item) => total + item.totalAmount, 0);
    
    const existingPayout = await db.payout.findFirst({
      where: {
        tutorId,
        payoutDate: {
          gte: firstDayOfMonth,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (existingPayout) {
      // Update existing payout
      const updatedTotalEarning = existingPayout.totalEarning + totalEarning;
      const updatedPayoutAmount = calculatePayoutAmount(updatedTotalEarning);

      return await db.payout.update({
        where: {
          id: existingPayout.id,
        },
        data: {
          totalEarning: updatedTotalEarning,
          payoutAmount: updatedPayoutAmount,
          updatedAt: today,
        },
      });
    } else {
      // Create new payout
      return await db.payout.create({
        data: {
          tutorId,
          invoiceId,
          totalEarning,
          payoutAmount: calculatePayoutAmount(totalEarning),
          payoutDate: today,
          status: "Pending",
          taxId: `TAX${Math.random().toString(36).substr(2, 6)}`,
        },
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
    } = invoiceData;

    const today = new Date();
    const firstDayOfMonth = getFirstDayOfMonth(today);
    const lastDayOfMonth = getLastDayOfMonth(today);

    // Check for existing invoice for this student in current month
    const existingInvoice = await db.invoice.findFirst({
      where: {
        studentId,
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      include: {
        items: true,
      },
    });

    if (existingInvoice) {
      // Update existing invoice
      const updatedSubtotal = existingInvoice.subtotal + subtotal;
      const updatedSst = existingInvoice.sst + sst;
      const updatedTotal = existingInvoice.total + total;

      // Update the invoice
      const updatedInvoice = await db.invoice.update({
        where: {
          id: existingInvoice.id,
        },
        data: {
          subtotal: updatedSubtotal,
          sst: updatedSst,
          total: updatedTotal,
          items: {
            create: items.map(item => ({
              lessonId: item.lessonId,
              tutorId: item.tutorId,
              subject: item.subject,
              totalDuration: item.totalDuration,
              tutorHourly: parseFloat(item.tutorhourly),
              totalHours: item.totalHours,
              totalAmount: item.totalAmount,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Group all items (existing + new) by tutor
      const allItems = [...existingInvoice.items, ...items];
      const tutorItems = allItems.reduce((acc, item) => {
        if (!acc[item.tutorId]) {
          acc[item.tutorId] = [];
        }
        //@ts-ignore
        acc[item.tutorId].push(item);
        return acc;
      }, {} as Record<string, InvoiceItem[]>);

      // Update payouts for each tutor
      const payoutPromises = Object.entries(tutorItems).map(([tutorId, items]) =>
        handlePayout(tutorId, updatedInvoice.id, items)
      );

      await Promise.all(payoutPromises);

      revalidatePath("/path-to-revalidate");
      return updatedInvoice;

    } else {
      // Create new invoice
      const createdInvoice = await db.invoice.create({
        data: {
          invoiceNumber,
          date: today,
          parentId,
          studentId,
          subtotal,
          sst,
          total,
          status,
          items: {
            create: items.map(item => ({
              lessonId: item.lessonId,
              tutorId: item.tutorId,
              subject: item.subject,
              totalDuration: item.totalDuration,
              tutorHourly: parseFloat(item.tutorhourly),
              totalHours: item.totalHours,
              totalAmount: item.totalAmount,
            })),
          },
        },
      });

      // Group items by tutor for new invoice
      const tutorItems = items.reduce((acc, item) => {
        if (!acc[item.tutorId]) {
          acc[item.tutorId] = [];
        }
        acc[item.tutorId].push(item);
        return acc;
      }, {} as Record<string, InvoiceItem[]>);

      // Handle payout for each tutor
      const payoutPromises = Object.entries(tutorItems).map(([tutorId, items]) =>
        handlePayout(tutorId, createdInvoice.id, items)
      );

      await Promise.all(payoutPromises);

      revalidatePath("/path-to-revalidate");
      return createdInvoice;
    }

  } catch (error) {
    console.error('Error saving invoice and payout:', error);
    return { error: 'An error occurred while creating the invoice and payout.' };
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
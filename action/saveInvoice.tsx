"use server";
import { revalidatePath } from "next/cache";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface saveInvoiceProps{
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
  items: {
    lessonId:string;
    tutorId: string;
    subject: string;
    totalDuration: number;
    tutorhourly: string;
    totalHours: number;
    totalAmount: number;
  }[];
}
export const saveInvoice = async (invoiceData: saveInvoiceProps) => {
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

    const parsedDate =new Date()
        // Create Invoice in the database
        const createdInvoice = await prisma.invoice.create({
          data: {
            invoiceNumber,
            date: parsedDate, // Ensure date is a Date object
            parentId,
            studentId,
            subtotal,
            sst,
            total,
            status,
            items: {
              create: items.map(item => ({
                lessonId:item.lessonId,
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
        
    // Revalidate a specific path if needed
    revalidatePath("/path-to-revalidate"); // Replace with the path you want to revalidate

    // Return the created invoice as a response
    return createdInvoice;
  } catch (error) {
    return { error: 'An error occurred while creating the invoice.' };
} finally {
    await prisma.$disconnect();
  }
};

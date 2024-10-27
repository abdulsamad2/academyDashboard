'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getInvoices = async () => {
  try {
    const invoices = await prisma.invoice.findMany({
        include: {
          student: {
            select: {
              name: true,
              email: true,
            },
          },
          parent: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
      
      // Return invoices as an array of objects with selected fields only
      return invoices.map((invoice) => ({
        id: invoice.id, 
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        subtotal: invoice.subtotal,
        sst: invoice.sst,
        date: invoice.date,
        total: invoice.total,
        student: {
          name: invoice.student?.name,
          email: invoice.student?.email,
        },
        parent: {
          name: invoice.parent?.name,
          email: invoice.parent?.email,
        },
      }));
      
    
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return { error: 'An error occurred while fetching invoices.' };
  }
};

export const deleteInvoice = async (id: string) => {
  try {
    await prisma.invoice.delete({
      where: { id },
    });
    return { success: 'Invoice deleted successfully.' };
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return { error: 'An error occurred while deleting the invoice.' };
  }
};

export const recentThreeInvoices = async () => {
  try {
    const recentInvoices = await prisma.invoice.findMany({
      take: 3,
      orderBy: { date: 'desc' },
      include: {
        parent: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return recentInvoices;
  } catch (error) {
    console.error('Error fetching recent invoices:', error);
    return { error: 'An error occurred while fetching recent invoices.' };
  }
};

'use server';
import { db } from "@/db/db";

export const getInvoices = async () => {
  try {
    const invoices = await db.invoice.findMany({
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
    await db.invoice.delete({
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
    const recentInvoices = await db.invoice.findMany({
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


export const updateInvoiceStatus = async (id:string, status:string) => {
  try {
    // Find the existing invoice by its unique ID
    const existingInvoice = await db.invoice.findUnique({
      where: { id: id }
    });

    // If the invoice exists, update its status
    if (existingInvoice) {
      await db.invoice.update({
        where: { id: existingInvoice.id },
        data: { status: status }
      });
      return {existingInvoice}
    } else {
      return {error:'invoice not found'}
    }
  } catch (error) {
    return {error:'error updating invoice'}
  }
};

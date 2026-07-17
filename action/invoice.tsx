'use server';
import { db } from "@/db/db";
import { requireAdmin, requireUser } from "@/lib/authz";

export const getInvoices = async () => {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };
    const invoices = await db.invoice.findMany({
        include: {
          student: {
            select: {
              name: true,
              
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
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };
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
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };
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
    // Marking an invoice paid confirms payment — admin only. Parents must
    // not be able to flip their own (or anyone's) invoice to "paid".
    const guard = await requireAdmin();
    if (!guard.ok) return { error: guard.error };

    const existingInvoice = await db.invoice.findUnique({
      where: { id: id }
    });

    if (existingInvoice) {
      const updated = await db.invoice.update({
        where: { id: existingInvoice.id },
        data: { status: status }
      });
      return { existingInvoice: updated };
    } else {
      return {error:'invoice not found'}
    }
  } catch (error) {
    return {error:'error updating invoice'}
  }
};


export const getInvoicesForParent = async (id: string) => {
  try {
    // IDOR guard: a non-admin can only read their OWN invoices, regardless
    // of the id passed from the client. Admins may read any parent's.
    const guard = await requireUser();
    if (!guard.ok) return { error: guard.error };
    const parentId = guard.role === 'admin' ? id : guard.userId;

    const invoices = await db.invoice.findMany({
      where: {
        parentId,
      },
      include: {
        student: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    

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
      },
    }));
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return { error: 'An error occurred while fetching invoices.' };
  }
 
};
'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// export const generateInvoice = async (studentId: string) => {
//   try {
//     const res = await prisma.invoice.create({
//         data: {
//             studentId: studentId,
//             amount: 1000, // Assuming a fixed amount for simplicity
//             currency: 'USD',
//             description: 'Tuition Fee',
//             issueDate: new Date(),
//             dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Due date in 30 days from now
//             status: 'Paid',

//           },
//     });
//     return {status: 'success', message: 'Invoice created successfully', data: res}
//   } catch (error) {
//     console.error('Error creating invoice:', error);
//     throw error; // Re-throw the error for proper error handling
//   }
// };
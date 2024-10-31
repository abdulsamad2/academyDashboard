'use server';
import { db } from "@/db/db";

interface revenueByMonth{
    month: string;
    revenue: number;
}
export const getSixMonthRevenue = async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Changed from -6 to -5 to include current month
    // Set to start of the month
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    try {
        // Fetch invoices from the last six months
        const invoices = await db.invoice.findMany({
            where: {
                date: {
                    gte: sixMonthsAgo,
                },
            },
        });

        // Create an array to hold the revenue data for each month
        const revenueByMonth: revenueByMonth[] = [];

        const currentDate = new Date();

        // Generate last 6 months including current month
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(currentDate.getMonth() - i);
            revenueByMonth.push({
                month: date.toLocaleString('default', { month: 'short' }),
                revenue: 0
            });
        }

        // Process invoices to aggregate revenue by month
        invoices.forEach(invoice => {
            const invoiceDate = new Date(invoice.date);
            const monthDiff = (currentDate.getMonth() - invoiceDate.getMonth() + 
                            (currentDate.getFullYear() - invoiceDate.getFullYear()) * 12);
            
            // Only process invoices from last 6 months
            if (monthDiff >= 0 && monthDiff < 6) {
                const index = 5 - monthDiff; // Reverse index to show most recent month last
                if (index >= 0 && index < 6) {
                    revenueByMonth[index].revenue += invoice.total;
                }
            }
        });

        return revenueByMonth;

    } catch (error) {
        console.error('Error fetching invoices:', error);
        throw error;
    }
}
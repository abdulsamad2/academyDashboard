'use server';

import { db } from "@/db/db";

export const getsixMonthRevenue = async() => {
    const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
    try {
    
            // Fetch invoices from the last six months
            const invoices = await db.invoice.findMany({
                where: {
                    date: {
                        gte: sixMonthsAgo, // Get invoices from 6 months ago
                    },
                },
            });
        
            // Create an array to hold the revenue data for each month
            const revenueByMonth = Array.from({ length: 6 }, (_, index) => {
                const date = new Date();
                date.setMonth(date.getMonth() - (5 - index)); // Calculate month dynamically
                return { month: date.toLocaleString('default', { month: 'short' }), revenue: 0 }; // Get short month name
            });
        
            // Process invoices to aggregate revenue by month
            invoices.forEach(invoice => {
                const invoiceDate = new Date(invoice.date);
                const monthIndex = invoiceDate.getMonth(); // Get month index (0-11)
        
                // Calculate the index for revenueByMonth
                const revenueIndex = (monthIndex >= 6) ? monthIndex - 6 : monthIndex + 6;
        
                // Update the revenue for the corresponding month
                if (revenueIndex >= 0 && revenueIndex < 6) {
                    revenueByMonth[revenueIndex].revenue += invoice.total; // Assuming 'total' is the revenue
                }
            });
        
            return revenueByMonth;
    
        
        // Usage        
    } catch (error) {
        console.error('Error fetching invoices:', error);
        throw error; // Re-throw the error for proper error handling
    }
}
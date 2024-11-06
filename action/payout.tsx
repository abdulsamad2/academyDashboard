'use server';

import { db } from "@/db/db";

export const getAdminPayout =  async()=>{
  // only get for this month 
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  try {
    const lesson = await db.item.findMany({
      where: {
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
    
      include: {
        tutor: {
          include: {
            tutor: true, 

          },
        },
      
    }});

    const separatedForEachTutor = lesson.reduce((acc, lesson) => {
      const tutorId = lesson.tutorId;
      const tutorData = {...lesson.tutor,...lesson.tutor.tutor};
      if (!acc[tutorId]) {
        acc[tutorId] = { tutorData, lessons: [] };
      }
      acc[tutorId].lessons.push(lesson);
      return acc;
    }, {} as Record<string, { tutorData: any, lessons: any[] }>);
    
     const payouts = Object.keys(separatedForEachTutor).map((tutorId) => {
      const { tutorData, lessons } = separatedForEachTutor[tutorId];
      const totalEarning = lessons.reduce((total, lesson) => total + lesson.totalAmount, 0);
      const payoutAmount = totalEarning * 0.75;
    
      return {
        totalEarning,
        id: tutorData.userId,
        name: tutorData.name,
        email: tutorData.email,
        avatar: tutorData.profilepic,
        bankName: tutorData.bank,
        accountNumber: tutorData.bankaccount,  // Masking the account number
        payoutAmount,
        payoutDate: new Date().toISOString().split("T")[0],  // Setting payout date to today’s date
        status: "Pending",
        taxId: "TAX789012",  // Placeholder, replace with actual data if available
        phoneNumber: tutorData.phone,
        address: tutorData.address,
        tutorId,
        tutorPayout: payoutAmount,
      };
    });
    
    return payouts;
    
    
  } catch (error:unknown | null | string) {
    return {error: 'An error occurred while fetching the lesson.'}
 
  } 

 
}



// get payout for tutor for this month 
export const getPayoutForTutor = async (tutorId: string) => {
  const today = new Date();
  // Set the first day of the last month
  const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  // Set the last day of the last month
  const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Day 0 of the current month is the last day of the previous month

  try {
    const lessons = await db.item.findMany({
      where: {
        createdAt: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth,
        },
        tutorId,
      },
      orderBy:{
        createdAt:'asc'
      }
    });

    const totalEarning = lessons.reduce((total, lesson) => total + lesson.totalAmount, 0);
    const payoutAmount = totalEarning * 0.75;

    return payoutAmount;
  } catch (error: unknown | null | string) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};


// get payouts 

export const getPayouts = async () => {
  try {
    const payouts = await db.payout.findMany({
      include: {
        User: { // This includes user details
          include: {
            tutor: true, // This includes the tutor details associated with the user
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    const filterData = payouts.map((payout) => {
     
      return {
        id: payout.id,
        name: payout.User.name,
        email: payout.User.email,
        avatar: payout?.User?.tutor?.profilepic,
        bankName: payout?.User?.tutor?.bank,
        accountNumber: payout?.User?.tutor?.bankaccount,  // Masking the account number
        payoutAmount: payout.payoutAmount,
        payoutDate: payout.payoutDate.toISOString().split("T")[0],  // Setting payout date to today’s date
        status: payout.status,
        taxId: payout.taxId,  // Placeholder, replace with actual data if available
        phoneNumber: payout.User.phone,
        address: payout.User.address,
        tutorId: payout.tutorId,
        tutorPayout: payout.payoutAmount,
        totalEarning: payout.totalEarning,
        updatedAt: payout.updatedAt.toISOString().split("T")[0],
        
      };
    });
return filterData;
  } catch (error) {
    console.error('Error fetching payout summary:', error);
    throw error;
  }
};

export const getAllPayoutsFortutor = async (tutorId: string) => {
  try {
    const payouts = await db.payout.findMany({
      where: {
        tutorId,
      },
      include: {
        User: { // This includes user details
          include: {
            tutor: true, // This includes the tutor details associated with the user
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    const filterData = payouts.map((payout) => {

      return {
        id: payout.id,
        name: payout.User.name,
        email: payout.User.email,
        avatar: payout?.User?.tutor?.profilepic,
        bankName: payout?.User?.tutor?.bank,
        accountNumber: payout?.User?.tutor?.bankaccount,  // Masking the account number
        payoutAmount: payout.payoutAmount,
        payoutDate: payout.payoutDate.toISOString().split("T")[0],  // Setting payout date to today’s date
        status: payout.status,
        taxId: payout.taxId,  // Placeholder, replace with actual data if available
        phoneNumber: payout.User.phone,
        address: payout.User.address,
        tutorId: payout.tutorId,
        tutorPayout: payout.payoutAmount,
        totalEarning: payout.totalEarning,
        updatedAt: payout.updatedAt.toISOString().split("T")[0],

      };
    });
return filterData;
  } catch (error) {
    console.error('Error fetching payout summary:', error);
    throw error;
  }
};



export const updatePayoutStatus = async (payoutId: string, status: string) => {
  try {
    const payout = await db.payout.update({
      where: {
        id: payoutId,
      },
      data: {
        status,
      },
    });
    return payout;
  } catch (error) {
    console.error('Error updating payout status:', error);
    throw error;
  }
};


export const getTutorPayout = async (tutorId: string) => {
  try {
    const payout = await db.payout.findMany({
      where: {
        tutorId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    const filterData = payout.map((payout) => {

      return {
        id: payout.id,
        payoutAmount: payout.payoutAmount,
        payoutDate: payout.payoutDate.toISOString().split("T")[0],  // Setting payout date to today’s date
        status: payout.status,
        tutorPayout: payout.payoutAmount,
        updatedAt: payout.updatedAt.toISOString().split("T")[0],

      };
    });
    return filterData;  
  } catch (error) {
    console.error('Error fetching payout summary:', error);
    throw error;
  }
};

export const deletePayout = async (payoutId: string) => {
  try {
    const payout = await db.payout.delete({
      where: {
        id: payoutId,
      },
    });
    return payout;
  } catch (error) {
    return {error: 'An error occurred while deleting the payout.'}
    
  }
};
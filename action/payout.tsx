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
        tutorData,
        tutorPayout: payoutAmount,
      };
    });
    
    return payouts;
    
    
  } catch (error:unknown | null | string) {
    return {error: 'An error occurred while fetching the lesson.'}
 
  } 

 
}



export const getPayoutForTutor = async(tutorId: string) =>{
  try {
    const lesson = await db.item.findMany({
      where: {
        tutorId,
      },
      include:{
        tutor:true,
      }
    });

    const totalEarning = lesson.reduce((total: any, lesson: { totalAmount: any; }) => total + lesson.totalAmount, 0);
    const tutorPayout = totalEarning * 0.75;

    return {
      lesson,
      tutorPayout,
      totalEarning,
    };

  } catch (error:unknown | null | string) {
    return {
      error: 'An error occurred while fetching the lesson.'}

  }

}
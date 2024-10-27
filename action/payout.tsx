'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getLessonForTutor =  async()=>{
  try {
    const lesson = await prisma.item.findMany();
    
    //seperate and put in array for each tutor
    const tutor = lesson.map((item)=>item.tutorId)
    return tutor;
    
  } catch (error) {
    
  } 

 
}

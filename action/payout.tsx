'use server';

import { db } from "@/db/db";

const getLessonForTutor =  async()=>{
  try {
    const lesson = await db.item.findMany();
    
    //seperate and put in array for each tutor
    const tutor = lesson.map((item)=>item.tutorId)
    return tutor;
    
  } catch (error) {
    
  } 

 
}

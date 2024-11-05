'use server';

import { auth } from "@/auth";
import { db } from "@/db/db";
interface ApplyForJobProps{
    jobId: string;
    coverLetter: string;
}

export const applyForJob = async({ jobId, coverLetter }: ApplyForJobProps)=>{
const session = await auth();
if(!session?.user){
    return {status: 'error', message: 'You must be logged in to apply for a job'}
}
//@ts-ignore
const tutorId = session.id;
    try {
        //if job exists
        const job = await db.job.findUnique({
            where:{
                id: jobId
            }
        });
        if(!job){
            return {status: 'error', message: 'Job not found'}
        }
         //create job application
         await db.application.create({
            data:{
                jobId,
                tutorId,
                coverLetter
            }
        });
        return {status: 'success', message: 'Job applied successfully'}
        
    } catch (error) {
        console.log(error)
        return {status: 'error', message: 'Something went wrong'}
    }
}
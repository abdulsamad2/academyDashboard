'use server';

import { db } from "@/db/db";
import { requireActiveTutor } from "@/lib/authz";
interface ApplyForJobProps{
    jobId: string;
    coverLetter: string;
}

export const applyForJob = async({ jobId, coverLetter }: ApplyForJobProps)=>{
const guard = await requireActiveTutor();
if(!guard.ok){
    return {status: 'error', message: guard.error}
}
const tutorId = guard.userId;
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
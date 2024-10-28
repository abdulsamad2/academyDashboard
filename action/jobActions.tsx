'use server';
import { db } from "@/db/db";
interface Job {
  subject: string;
  level: string;
  mode: string;
  requriments: string;
  userId: string;
}

// create a job
export async function jobCreation(formData:Job) {
  const { subject, level, mode, requriments, userId } = formData;
  const job = await db.job.create({
    data: {
      subject,
      studentLevel: level,
      mode,
      requriments,
      userId
    }
  });
  return job;
}

export async function getJobs() {
  const jobs = await db.job.findMany({
    include: {
      user:true
    },
  });
  return jobs;
}

export async function getJobById(id:string) {
  const job = await db.job.findUnique({
    where: {
      id
    }
  });
  return job;
}

// find all jobs where parent id is
export async function getJobsByParentId(userId:string) {
  const jobs = await db.job.findMany({
    where: {
      userId
    }
  });
  return jobs;
}
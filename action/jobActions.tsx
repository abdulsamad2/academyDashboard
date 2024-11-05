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
      user: true,
      Application: {
        include: {
          tutor: true,  // Ensure to include the tutor relation
        },
      },
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return jobs.map(job => ({
    ...job,
    // If there are no applications, default to an empty array
    Application: job.Application || [],
  }));
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

export async function deleteJob(id:string) {
  const job = await db.job.delete({
    where: {
      id
    }
  });
  return job;
}

export const updateJobStatus = async (id:string, status:string) => {
  try {const job = await db.job.update({
    where: {
      id
    },
    data: {
      status
    }
  });
  return job;
    
  } catch (error) {
    console.log(error);
    return {error: 'Error updating job status'}
    
  }
}
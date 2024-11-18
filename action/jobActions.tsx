'use server';
import { db } from "@/db/db";
import { z } from "zod";

// zod schema
import { FormSchema } from "@/app/parent-dashboard/components/requestTutor";
import { auth } from "@/auth";

export async function jobCreation(formData: z.infer<typeof FormSchema>) {
  const session = await auth();
  //@ts-ignore
  const userId = session?.id;
  if (!userId) {
    return {error: 'User not logged in'}
  }
  const jobData = {
    userId,
    studentLevel: formData.level,
    status: 'in review' as const,
    // Spread the rest of formData but exclude level since we're using studentLevel
    ...Object.fromEntries(
      Object.entries(formData).filter(([key]) => key !== 'level')
    )
  };  try {
     const res = await db.job.create({
      //@ts-ignore
      data: jobData,
    });
    return res;
  } catch (error) {
    console.log(error);
    return {error: 'Error requesting tutor'}
  }
}
  



export async function getJobs() {
  const jobs = await db.job.findMany({
    include: {
      user: true,
      application: {
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
    application: job.application || [],
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

export const updateJob = async  (data:any) => {
  const jobData = {
    studentLevel: data.level,
    status: 'in review' as const,
    // Spread the rest of formData but exclude level since we're using studentLevel
    ...Object.fromEntries(
      Object.entries(data).filter(
        ([key]) => key !== 'level' && key !== 'id'
      )
    )
  }; 
  try {const job = await db.job.update({
    where: {
      id:data.id
    },
    data: jobData,
  });
  return job;

  } catch (error) {
    console.log(error);
    return {error: 'Error updating job status'}

  }
}

// check if this tutor has applied for this job
export const checkIfApplied = async (jobId: string, tutorId: string) => {
  const application = await db.application.findFirst({
    where: {
      jobId,
      tutorId,
    },
  });
  return !!application; // Returns true if the application exists, otherwise false
};

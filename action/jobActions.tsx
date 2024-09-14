'use server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function jobCreation(formData) {
  const { subject, level, mode, requriments, userId } = formData;
  const job = await prisma.job.create({
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
  const jobs = await prisma.job.findMany({
    include: {
      user:true
    },
  });
  return jobs;
}

export async function getJobById(id) {
  const job = await prisma.job.findUnique({
    where: {
      id
    }
  });
  return job;
}

// find all jobs where parent id is
export async function getJobsByParentId(userId) {
  const jobs = await prisma.job.findMany({
    where: {
      userId
    }
  });
  return jobs;
}
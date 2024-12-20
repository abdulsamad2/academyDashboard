import React from 'react';
import ParentDashboard from './components/ParentDashboard';
import { auth } from '@/auth';
import { db } from '@/db/db';
import { getInvoicesForParent } from '@/action/invoice';
import { getJobsByParentId } from '@/action/jobActions';

export default async function page() {
  const session = await auth();
  // @ts-ignore
  const parentId = session?.id;
  const students = await db.student.findMany({
    where: { parentId }
  });
  const fromatedStudents = students.map((student) => ({
    ...student,

    createdAt: new Date(student.createdAt).toLocaleDateString()
  }));

  const invoices = await getInvoicesForParent(parentId);
  const tutorRequests = await getJobsByParentId(parentId);

  return (
    <ParentDashboard
      //@ts-ignore
      tutorRequests={tutorRequests}
      //@ts-ignore
      parentName={session?.user.name}
      //@ts-ignore
      students={fromatedStudents}
      //@ts-ignore
      recentInvoices={invoices}
    />
  );
}

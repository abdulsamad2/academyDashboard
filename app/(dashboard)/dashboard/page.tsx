import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAllHoursSoFar } from '@/action/addLesson';
import { recentThreeInvoices } from '@/action/invoice';
import { getSixMonthRevenue } from '@/action/revenue';
import { getAllStudents } from '@/action/studentRegistration';
import { getAllTutors } from '@/action/tutorRegistration';
import { getJobs } from '@/action/jobActions';
import AdminHome from './components/admin-home';

export default async function Page() {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');

  const [students, tutors, hours, recentInvoices, sixMonthRevenue, jobs] =
    await Promise.all([
      getAllStudents(),
      getAllTutors(),
      getAllHoursSoFar(),
      recentThreeInvoices(),
      getSixMonthRevenue(),
      getJobs()
    ]);

  const invoicesList = Array.isArray(recentInvoices) ? recentInvoices : [];
  const openJobs = jobs.filter(
    (j: any) => (j.status ?? 'open').toLowerCase() === 'open'
  ).length;

  const pendingInvoices = invoicesList.filter(
    (i: any) => (i.status ?? '').toString().toLowerCase() !== 'paid'
  ).length;

  return (
    <Suspense>
      <AdminHome
        userName={session.user?.name ?? 'there'}
        students={students}
        tutors={tutors}
        hours={hours}
        recentInvoices={invoicesList}
        sixMonthRevenue={sixMonthRevenue}
        openJobs={openJobs}
        pendingInvoices={pendingInvoices}
      />
    </Suspense>
  );
}

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getPayoutForTutor, getTutorPayout } from '@/action/payout';
import { getAssignedStudent } from '@/action/AssignTutor';
import { getTutorById } from '@/action/tutorRegistration';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import TutorEarningsDashboard from './earning';

const breadcrumbItems = [
  { title: 'Tutor', link: '/tutor-dashboard' },
  { title: 'Earnings', link: '/tutor-dashboard/earnings' }
];

export default async function Page() {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');
  const tutorId = session.id;

  const [lastMonthEarnings, assignedStudents, payoutsRaw, tutorData] =
    await Promise.all([
      getPayoutForTutor(tutorId),
      getAssignedStudent(tutorId),
      getTutorPayout(tutorId),
      getTutorById(tutorId)
    ]);

  const payouts = Array.isArray(payoutsRaw) ? payoutsRaw : [];

  // All-time + pending totals from the payout history.
  const totalPaid = payouts
    .filter((p) => (p.status ?? '').toLowerCase() !== 'pending')
    .reduce((sum, p) => sum + (p.payoutAmount ?? 0), 0);
  const pendingTotal = payouts
    .filter((p) => (p.status ?? '').toLowerCase() === 'pending')
    .reduce((sum, p) => sum + (p.payoutAmount ?? 0), 0);

  // Last 6 months of earnings, bucketed by payout date.
  const now = new Date();
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: d.toLocaleString('default', { month: 'short' }),
      earnings: 0
    };
  });
  for (const p of payouts) {
    const d = new Date(p.payoutDate);
    const bucket = monthly.find(
      (m) => m.key === `${d.getFullYear()}-${d.getMonth()}`
    );
    if (bucket) bucket.earnings += p.payoutAmount ?? 0;
  }
  const monthlyEarnings = monthly.map(({ month, earnings }) => ({
    month,
    earnings
  }));

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Earnings"
        description="Track your payouts, pending balance, and monthly earnings."
      />
      <TutorEarningsDashboard
        lastMonthEarnings={lastMonthEarnings}
        totalPaid={totalPaid}
        pendingTotal={pendingTotal}
        assignedStudents={assignedStudents.length}
        monthlyEarnings={monthlyEarnings}
        payouts={payouts}
        tutordetails={tutorData}
      />
    </>
  );
}

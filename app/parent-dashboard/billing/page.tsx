import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ParentBilling from './components/billing';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
import { getInvoicesForParent } from '@/action/invoice';
import { getSecurityDepositByParentId } from '@/action/securityDeposit';

const breadcrumbItems = [
  { title: 'Parent', link: '/parent-dashboard' },
  { title: 'Billing', link: '/parent-dashboard/billing' }
];

export default async function Page() {
  const session = await auth();
  if (!session?.id) redirect('/auth/signin');

  const [invoicesRaw, depositsRaw] = await Promise.all([
    getInvoicesForParent(session.id),
    getSecurityDepositByParentId(session.id)
  ]);

  const invoices = Array.isArray(invoicesRaw) ? invoicesRaw : [];
  const deposits = Array.isArray(depositsRaw) ? depositsRaw : [];

  const outstanding = invoices
    .filter((i: any) => (i.status ?? '').toString().toLowerCase() !== 'paid')
    .reduce((sum: number, i: any) => sum + (i.total ?? 0), 0);

  const totalDeposit = deposits.reduce(
    (sum: number, d: any) => sum + (d.amount ?? 0),
    0
  );

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Billing"
        description="Invoices, payments and security deposits"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Outstanding"
          value={`RM ${outstanding.toLocaleString()}`}
          icon={AlertCircle}
          helper={outstanding > 0 ? 'Please settle soon' : 'All paid'}
        />
        <StatCard
          label="Invoices"
          value={invoices.length}
          icon={CreditCard}
          helper="All time"
        />
        <StatCard
          label="Security deposit"
          value={`RM ${totalDeposit.toLocaleString()}`}
          icon={ShieldCheck}
          helper={`${deposits.length} record${
            deposits.length === 1 ? '' : 's'
          }`}
        />
      </div>
      <ParentBilling
        //@ts-ignore
        deposits={deposits}
        //@ts-ignore
        invoices={invoices}
      />
    </>
  );
}

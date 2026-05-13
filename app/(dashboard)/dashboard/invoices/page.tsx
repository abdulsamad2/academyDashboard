import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getInvoices } from '@/action/invoice';
import InvoicesComponent from './component/invoiceTable';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Invoices', link: '/dashboard/invoices' }
];

export default async function Page() {
  const result = await getInvoices();
  const invoices = Array.isArray(result) ? result : [];

  const totalAmount = invoices.reduce(
    (sum: number, i: any) => sum + (i.total ?? 0),
    0
  );
  const paid = invoices.filter(
    (i: any) => (i.status ?? '').toString().toLowerCase() === 'paid'
  );
  const unpaid = invoices.length - paid.length;
  const paidAmount = paid.reduce(
    (sum: number, i: any) => sum + (i.total ?? 0),
    0
  );

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoice${
          invoices.length === 1 ? '' : 's'
        } on file`}
        actions={
          <Button asChild>
            <Link href="/dashboard/generateinvoice/new">
              <Plus className="mr-2 h-4 w-4" />
              New invoice
            </Link>
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          label="Total billed"
          value={`RM ${totalAmount.toLocaleString()}`}
          icon={FileText}
        />
        <StatCard
          label="Paid"
          value={`RM ${paidAmount.toLocaleString()}`}
          icon={CheckCircle2}
          helper={`${paid.length} invoice${paid.length === 1 ? '' : 's'}`}
        />
        <StatCard
          label="Outstanding"
          value={unpaid}
          icon={AlertCircle}
          helper="Awaiting payment"
        />
      </div>
      <InvoicesComponent
        //@ts-ignore
        data={invoices}
      />
    </>
  );
}

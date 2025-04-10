import { getInvoices } from '@/action/invoice';
import React from 'react'
import InvoicesComponent from './component/invoiceTable';
import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Invoices | Admin Dashboard',
  description: 'Manage invoices and payment status',
}

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Invoices', link: '/dashboard/invoices' }
];

type paramsProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const InvoicesPage = async (props: paramsProps) => {
  const searchParams = await props.searchParams;
  const invoices = await getInvoices();
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;

  // Get total count for pagination information
  //@ts-ignore
  const totalInvoices = invoices?.length || 0;
  
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Invoices (${totalInvoices})`}
            description="Manage invoices and payment status"
          />

          <Link
            href={'/dashboard/generateinvoice'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Generate New
          </Link>
        </div>
        <Separator />

        <InvoicesComponent 
          //@ts-ignore
          data={invoices || []} 
        />
      </div>
    </>
  )
}

export default InvoicesPage
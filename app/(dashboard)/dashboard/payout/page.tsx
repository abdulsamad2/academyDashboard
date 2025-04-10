import React from 'react'
import { getPayouts } from '@/action/payout'
import PayoutTable from '@/components/tables/payout-table/payout-table'
import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Teacher Payouts | Admin Dashboard',
  description: 'Manage teacher payouts and payment status',
}

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Payouts', link: '/dashboard/payout' }
];

type paramsProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const PayoutPage = async (props: paramsProps) => {
  const searchParams = await props.searchParams;
  const payouts = await getPayouts()
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;

  // Get total count for pagination information
  //@ts-ignore
  const totalTeachers = payouts?.length || 0;
  const pageCount = Math.ceil(totalTeachers / pageLimit);
  
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Teacher Payouts (${totalTeachers})`}
            description="Manage teacher payouts and payment status"
          />
        </div>
        <Separator />

        <PayoutTable 
          //@ts-ignore
          teacherPayouts={payouts || []}
        />
      </div>
    </>
  )
}

export default PayoutPage
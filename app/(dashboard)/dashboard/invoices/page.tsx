import { Breadcrumbs } from '@/components/breadcrumbs';
import { StudentTable } from '@/components/tables/student-tables/student-table';
import { columns } from '@/components/tables/student-tables/columns';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { catchAsync, cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { InoviceTable } from '@/components/tables/invoice-tables/invoice-table';
const prisma = new PrismaClient();

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Invoices', link: '/dashboard/inovices' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const invoices =await catchAsync(async () => {
    const invoices = await prisma.invoice.findMany({
      include: {
        student: true,
        tutor:true
      }
    });
    return invoices;
  })
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const allInvoices = searchParams.search || null;
  const offset = (page - 1) * pageLimit;
  const totalUsers = allInvoices?.length; //1000
  //@ts-ignore
  const pageCount = Math.ceil(totalUsers / pageLimit);
 

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Invoices (${totalUsers})`}
            description="Manage inovices"
          />

          <Link
            href={'/dashboard/invoices/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <InoviceTable
          searchKey="Name"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers?totalUsers:0}
          data={invoices?invoices:[]}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}

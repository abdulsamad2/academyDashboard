import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SubjectTable } from '@/components/tables/subject-table/student-table';
import { columns } from '@/components/tables/subject-table/columns';
import { db as prisma } from '@/db/db';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Subjects', link: '/dashboard/subject' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const subject = await prisma.subject.findMany();
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const totalUsers = subject.length;
  const pageCount = Math.ceil(totalUsers / pageLimit);

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Subjects"
        description={`${totalUsers} subject${totalUsers === 1 ? '' : 's'}`}
        actions={
          <Button asChild>
            <Link href="/dashboard/subject/new">
              <Plus className="mr-2 h-4 w-4" />
              Add subject
            </Link>
          </Button>
        }
      />
      <SubjectTable
        searchKey="name"
        pageNo={page}
        columns={columns}
        totalUsers={totalUsers}
        //@ts-ignore
        data={subject ? subject : []}
        pageCount={pageCount}
      />
    </>
  );
}

import { Breadcrumbs } from '@/components/breadcrumbs';
import { columns } from '@/components/tables/tutor-tables/columns';
import { TutorTable } from '@/components/tables/tutor-tables/tutor-table';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { db as prisma } from '@/db/db';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Tutor', link: '/dashboard/tutor' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const fmt = (date: Date) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;

  const result = await prisma.tutor.findMany({
    include: { user: true }
  });

  const tutor = result.map((t) => ({
    id: t.id,
    userId: t.user?.id,
    name: t.user?.name || 'N/A',
    email: t.user?.email || 'N/A',
    phone: t.user?.phone || 'N/A',
    education: t.education || 'N/A',
    teachingOnline: t.teachingOnline ? 'Yes' : 'No',
    city: t.user?.city || 'N/A',
    country: t.user?.country || 'N/A',
    profilepic: t.profilepic || 'N/A',
    nric: t.nric || 'N/A',
    resume: t.resume || 'N/A',
    hourly: t.hourly || 'N/A',
    createdAt: t.createdAt ? fmt(t.createdAt) : 'N/A',
    updatedAt: t.updatedAt || 'N/A',
    subjects: t.subjects || [],
    rating: t.rating || 0,
    tutorfeedback: t.feedback || [],
    adminId: t.adminId
  }));

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title={`Tutors`}
        description={`${result.length} tutor${
          result.length === 1 ? '' : 's'
        } on your roster`}
        actions={
          <Button asChild>
            <Link href="/dashboard/tutor/new">
              <Plus className="mr-2 h-4 w-4" />
              Add tutor
            </Link>
          </Button>
        }
      />
      <TutorTable
        searchKey="Name"
        pageNo={page}
        columns={columns}
        totalUsers={result.length}
        //@ts-ignore
        data={tutor}
        pageCount={Math.max(1, Math.ceil(result.length / 20))}
      />
    </>
  );
}

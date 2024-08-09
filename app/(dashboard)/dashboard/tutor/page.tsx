import { Breadcrumbs } from '@/components/breadcrumbs';
import { columns } from '@/components/tables/tutor-tables/columns';
import { TutorTable } from '@/components/tables/tutor-tables/tutor-table';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Tutor', link: '/dashboard/tutor' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};
const fromat = (date: Date, format: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;
  const result = await prisma.tutor.findMany({
    skip: offset,
    take: pageLimit,
    include: {
      user: true
    }
  });
  const tutor = result.map((tutor) => ({
    id: tutor.id,
    name: tutor.user.name,
    email: tutor.user.email,
    phone: tutor.user.phone,
    education: tutor.education,
    dob: tutor.user.dob,
    teachingOnline: tutor.teachingOnline ? 'Yes' : 'No',
    city: tutor.user.city,
    country: tutor.user.country,
    image: tutor.user.image,

    createdAt: fromat(tutor.createdAt, 'en-US'),
    updatedAt: tutor.updatedAt
  }));

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Tutors (${tutor?.length})`}
            description="Manage tutors)"
          />

          <Link
            href={'/dashboard/tutor/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <TutorTable
          searchKey="country"
          pageNo={page}
          columns={columns}
          totalUsers={25}
          data={tutor}
          pageCount={10}
        />
      </div>
    </>
  );
}

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
  let result = await prisma.tutor.findMany({
    include: {
      user: true
    }
  });

  // Ensure result is an empty array if no tutors are found

  // Map the result to the desired format
  const tutor = result.map((tutor) => ({
    id: tutor.id,
    name: tutor.user?.name || 'N/A', // Use 'N/A' or some default value if user or name is missing
    email: tutor.user?.email || 'N/A', // Use 'N/A' or some default value if user or email is missing
    phone: tutor.user?.phone || 'N/A', // Use 'N/A' or some default value if user or phone is missing
    education: tutor.education || 'N/A', // Use 'N/A' or some default value if education is missing
    teachingOnline: tutor.teachingOnline ? 'Yes' : 'No',
    city: tutor.user?.city || 'N/A', // Use 'N/A' or some default value if user or city is missing
    country: tutor.user?.country || 'N/A', // Use 'N/A' or some default value if user or country is missing
    profilepic: tutor.profilepic || 'N/A', // Use 'N/A' or some default value if user or image is missing
    nric: tutor.nric || 'N/A',
    stt: tutor.stt || 'N/A',
    resume: tutor.resume || 'N/A',
    hourly: tutor.hourly || 'N/A',
    createdAt: tutor.createdAt ? fromat(tutor.createdAt, 'en-US') : 'N/A', // Handle formatting with default value
    updatedAt: tutor.updatedAt || 'N/A' // Handle missing updatedAt with default value
  }));

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Tutors (${result?.length})`}
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
          //@ts-ignore
          data={tutor}
          pageCount={10}
        />
      </div>
    </>
  );
}

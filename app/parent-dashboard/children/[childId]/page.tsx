import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StudentForm } from '@/components/forms/student-form';
import { Prisma, PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Student', link: '/dashboard/student' },
  { title: 'Edit', link: '#' }
];

export default async function Page({
  params
}: {
  params: { childId: string };
}) {
  const id = params.childId;

  // Add error handling for invalid IDs
  if (!id) {
    notFound();
  }

  try {
    // Fetch student data
    const data = await prisma.student.findUnique({
      where: {
        id: id
      }
    });

    // If student not found, handle gracefully
    if (!data) {
      notFound();
    }

    // Fetch subjects
    const subjects = await prisma.subject.findMany();

    // Format data for the form
    // Only transform the data if it exists
    const formattedData = data
      ? {
          ...data,
          gender: data.sex, // Map sex to gender for the form
          level: data.class, // Map class to level for the form
          adminId: data.adminId ?? undefined // Ensure adminId is string or undefined
          // Add any other necessary field mappings
        }
      : null;

    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />

          <StudentForm
            subject={subjects}
            initialData={formattedData}
            key={id} // Use the ID as key to force re-render when ID changes
          />
        </div>
      </ScrollArea>
    );
  } catch (error) {
    console.error('Error fetching student data:', error);
    // In a real app, you might want to render an error component
    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <h2 className="text-lg font-medium text-red-800">
              Error loading student data
            </h2>
            <p className="mt-1 text-sm text-red-700">
              There was a problem loading this student&apos;s information.
              Please try again.
            </p>
          </div>
        </div>
      </ScrollArea>
    );
  }
}

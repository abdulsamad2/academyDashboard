'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { CombinedCell } from '../student-tables/combined-cell';
import RatingStars from '@/components/stars';
import  AssignedStudentsButton  from '@/components/assignedStudentsButton';
interface Tutor {
  id: string; // This is the Tutor.id
  name: string; // This comes from User.name
  city: string; // This comes from User.city
  email: string; // This comes from User.email
  phone: string; // This comes from User.phone
  education: string; // This comes from Tutor.education
  teachingOnline: boolean; // This comes from Tutor.teachingOnline
  hourly: string | number; // This comes from Tutor.hourly
  subjects: string[]; // This comes from Tutor.subjects
  rating: string | number; // This comes from Tutor.rating
  createdAt: Date; // This comes from Tutor.createdAt
  profilepic?: string; // This comes from Tutor.profilepic
  userId?: string; // This is the User.id which we need for StudentTutor queries
  tutorfeedback: string; // This comes from Tutor.tutorfeedback
}

export const columns: ColumnDef<Tutor>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'adminId',
    header: 'adminId'
  },

  {
    id: 'combinedName',
    header: 'NAME & CITY',
    cell: ({ row }) => (
      <CombinedCell data={row.original} fields={['name', 'city']} />
    )
  },
  {
    id: 'combinedContact',
    header: 'Contact',
    cell: ({ row }) => (
      <CombinedCell data={row.original} fields={['email', 'phone']} />
    )
  },

  {
    accessorKey: 'education',
    header: 'EDUCATION'
  },
  {
    accessorKey: 'teachingOnline',
    header: 'ONLINE'
  },
  {
    accessorKey: 'rating',
    header: 'RATING',
    cell: ({ row }) => {
      const ratingValue = row.original.rating;
      return (
        <RatingStars
          rating={
            typeof ratingValue === 'number'
              ? ratingValue
              : parseFloat(ratingValue)
          }
        />
      );
    }
  },
  {
    id: 'subjects',
    header: 'Subject',
    cell: ({ row }) => <CombinedCell data={row.original.subjects} />
  },
  {
    id: 'assignedStudents',
    header: 'STUDENTS',
    cell: ({ row }) => {
      // Only render if we have a valid userId
      if (!row.original.userId) {
        return <div className="text-sm text-muted-foreground">No User ID</div>;
      }

      return (
        <AssignedStudentsButton
          tutorId={row.original.userId}
          tutorName={row.original.name}
        />
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const data = {
        ...row.original,
        rating:
          typeof row.original.rating === 'number'
            ? row.original.rating
            : parseFloat(row.original.rating)
      };
      return <CellAction data={data} />;
    }
  }
];

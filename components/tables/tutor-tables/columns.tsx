'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import {
  EntityCell,
  IdChip,
  RatingCell,
  StackedCell,
  StatusBadge,
  TagsCell
} from '@/components/ui/table-cells';
import AssignedStudentsButton from '@/components/assignedStudentsButton';

interface Tutor {
  id: string;
  name: string;
  city: string;
  email: string;
  phone: string;
  education: string;
  teachingOnline: boolean | string;
  hourly: string | number;
  subjects: string[];
  rating: string | number;
  createdAt: Date;
  profilepic?: string;
  userId?: string;
  tutorfeedback: string;
  adminId?: string | null;
}

export const columns: ColumnDef<Tutor>[] = [
  {
    id: 'tutor',
    accessorKey: 'name',
    header: 'Tutor',
    cell: ({ row }) => (
      <EntityCell
        name={row.original.name}
        subtitle={row.original.city || undefined}
        imageSrc={row.original.profilepic}
      />
    )
  },
  {
    id: 'contact',
    header: 'Contact',
    cell: ({ row }) => (
      <StackedCell
        primary={row.original.email}
        secondary={row.original.phone}
      />
    )
  },
  {
    accessorKey: 'education',
    header: 'Education',
    cell: ({ row }) => (
      <span className="text-sm capitalize text-foreground">
        {row.original.education || '—'}
      </span>
    )
  },
  {
    id: 'mode',
    header: 'Mode',
    cell: ({ row }) => {
      const online =
        row.original.teachingOnline === true ||
        row.original.teachingOnline === 'Yes';
      return (
        <StatusBadge
          variant={online ? 'success' : 'muted'}
          label={online ? 'Online' : 'In-person'}
        />
      );
    }
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => {
      const v = row.original.rating;
      return <RatingCell rating={typeof v === 'number' ? v : parseFloat(v)} />;
    }
  },
  {
    id: 'subjects',
    header: 'Subjects',
    cell: ({ row }) => <TagsCell tags={row.original.subjects} max={2} />
  },
  {
    id: 'assignedStudents',
    header: 'Students',
    cell: ({ row }) => {
      if (!row.original.userId) {
        return <span className="text-xs text-muted-foreground">—</span>;
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
    accessorKey: 'adminId',
    header: 'ID',
    cell: ({ row }) => <IdChip id={row.original.adminId ?? undefined} />
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const data = {
        ...row.original,
        rating:
          typeof row.original.rating === 'number'
            ? row.original.rating
            : parseFloat(row.original.rating)
      };
      return (
        <div className="flex justify-end">
          <CellAction data={data} />
        </div>
      );
    }
  }
];

'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { CombinedCell } from '../student-tables/combined-cell';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      return <span className="font-medium">{row.original.date}</span>;
    }
  },
  {
    id: 'student',
    header: 'Student',
    cell: ({ row }) => (
      <CombinedCell data={row.original} fields={['name', 'studentAdminId']} />
    )
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="rounded-md font-normal">
          {row.original.subject}
        </Badge>
      );
    }
  },
  {
    id: 'time',
    header: 'Class Time',
    cell: ({ row }) => (
      <CombinedCell data={row.original} fields={['startTime', 'endTime']} />
    )
  },
  {
    accessorKey: 'classDuration',
    header: 'Duration',
    cell: ({ row }) => {
      return <span className="text-muted-foreground">{row.original.classDuration}</span>;
    }
  },
  {
    id: 'tutor',
    header: 'Tutor',
    cell: ({ row }) => (
      <CombinedCell data={row.original} fields={['tutor', 'tutorAdminId']} />
    )
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <CellAction
        //@ts-ignore
        data={row.original}
      />
    )
  }
];

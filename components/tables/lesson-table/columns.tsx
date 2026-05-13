'use client';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { EntityCell, IdChip, StackedCell } from '@/components/ui/table-cells';

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-foreground">
        {/* @ts-ignore */}
        {row.original.date}
      </span>
    )
  },
  {
    id: 'student',
    header: 'Student',
    cell: ({ row }) => (
      <EntityCell
        //@ts-ignore
        name={row.original.name}
        //@ts-ignore
        subtitle={row.original.studentAdminId}
      />
    )
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => (
      <span className="text-sm text-foreground">
        {/* @ts-ignore */}
        {row.original.subject ?? '—'}
      </span>
    )
  },
  {
    id: 'time',
    header: 'Time',
    cell: ({ row }) => (
      <StackedCell
        //@ts-ignore
        primary={row.original.startTime}
        //@ts-ignore
        secondary={row.original.endTime}
      />
    )
  },
  {
    accessorKey: 'classDuration',
    header: 'Duration',
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-muted-foreground">
        {/* @ts-ignore */}
        {row.original.classDuration}
      </span>
    )
  },
  {
    id: 'tutor',
    header: 'Tutor',
    cell: ({ row }) => (
      <StackedCell
        //@ts-ignore
        primary={row.original.tutor}
        //@ts-ignore
        secondary={row.original.phone}
      />
    )
  },
  {
    accessorKey: 'tutorAdminId',
    header: 'ID',
    cell: ({ row }) => (
      // @ts-ignore
      <IdChip id={row.original.tutorAdminId} />
    )
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <CellAction
          //@ts-ignore
          data={row.original}
        />
      </div>
    )
  }
];

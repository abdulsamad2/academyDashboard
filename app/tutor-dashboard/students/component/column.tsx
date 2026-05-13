'use client';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cellactions';
export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'hoursperWeek',
    header: 'Hours Per Week'
  },
  {
    accessorKey: 'class',
    header: 'LEVEL'
  },
  {
    accessorKey: 'subject',
    header: 'SUBJECT'
  },
  {
    accessorKey: 'studymode',
    header: 'STUDY MODE'
  },

  {
    id: 'actions',
    cell: ({ row }) => (
      <CellAction
        //@ts-ignore
        data={row.original}
      />
    )
  }
];

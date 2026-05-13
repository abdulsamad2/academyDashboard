'use client';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cellAction';
import { CombinedCell } from '@/components/tables/student-tables/combined-cell';
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
    accessorKey: 'level',
    header: 'LEVEL'
  },
  {
    id: 'combined',
    header: 'Tutor',
    cell: ({ row }) => <CombinedCell data={row.original.tutor} />
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

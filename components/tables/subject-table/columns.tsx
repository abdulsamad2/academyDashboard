'use client';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    header: 'SUBJECT'
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

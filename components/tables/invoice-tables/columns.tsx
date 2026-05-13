'use client';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'Student Name',
    header: 'NAME'
  },
  {
    accessorKey: 'city',
    header: 'CITY'
  },
  {
    accessorKey: 'email',
    header: 'EMAIL'
  },
  {
    accessorKey: 'phone',
    header: 'Phone'
  },
  {
    accessorKey: 'createdAt',
    header: 'JOINED'
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <CellAction //@ts-ignore
        data={row.original}
      />
    )
  }
];

'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { CombinedCell } from '../student-tables/combined-cell';
interface Parent {
  id: string;
  name: string;
  city: string;
  email: string;
  phone: string;
  students: String[];
  createdAt: string;
}

export const columns: ColumnDef<Parent>[] = [
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
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'city',
    header: 'CITY'
  },
  {
    id: 'combined',
    header: 'PHONE & EMAIL',
    cell: ({ row }) => (
      <CombinedCell data={row.original} fields={['phone', 'email']} />
    ),
  },
  {
    id: 'combined',
    header: 'StUDENTS',
    cell: ({ row }) => (
      <CombinedCell data={row.original.students}/>
    ),
 },
  {
    accessorKey: 'createdAt',
    header: 'JOINED'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction//@ts-ignore
    data={row.original} />
  }
];

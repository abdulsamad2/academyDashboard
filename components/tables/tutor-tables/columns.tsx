'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { CombinedCell } from '../student-tables/combined-cell';
interface Tutor {
  subjects: any;
  id: string;
  name: string;
  city: string;
  email: string;
  phone: string;
  education: string;
  teachingOnline: boolean;
  hourly: number;
  createdAt: Date;
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
    id: 'combined',
    header: 'NAME & CITY',
    cell: ({ row }) => (
      <CombinedCell data={row.original} fields={['name', 'city']} />
    ),
  },
  {
    id: 'combined',
    header: 'Contact',
    cell: ({ row }) => (
      <CombinedCell data={row.original} fields={['email', 'phone']} />
    ),
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
    id: 'combined',
    header: 'Subject',
    cell: ({ row }) => (
      <CombinedCell data={row.original.subjects} />
    ),
  },
 
  {
    id: 'actions',
    cell: ({ row }) => <CellAction
    //@ts-ignore
 data={row.original} />
  }
];

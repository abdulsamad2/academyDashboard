'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { CombinedCell } from './combined-cell';

interface Student {
  id: string;
  name: string;
  class: string;
  parent: string;
  parentEmail: string;
  parentPhone: string;
  hoursperWeek: number;
  subject: string;
  studymode: string;
}
export const columns: ColumnDef<Student>[] = [
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
    header: 'NAME & LEVEL',
    cell: ({ row }) => (
      <CombinedCell data={row.original} fields={['name', 'class']} />
    ),
  },
  {
    id: 'combined',
    header: ' PARENT',
    cell: ({ row }) => (
      <CombinedCell data={row.original} fields={['parent', 'parentPhone']} />
    ),
  },
  {
    accessorKey: 'hoursperWeek',
    header: 'Hours Per Week'
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
    cell: ({ row }) => <CellAction
    //@ts-ignore
 data={row.original} />
  }
];

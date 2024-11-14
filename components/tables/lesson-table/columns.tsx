'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { CombinedCell } from '../student-tables/combined-cell';

export const columns: ColumnDef<Employee>[] = [
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
    accessorKey: 'date',
    header: 'Date'
  },
  {
    id: 'combined',
    header: 'Name & Subject',
    cell: ({ row }) => (
      <CombinedCell data={row.original} fields={['name', 'subject']} />
    ),
  },

  {
    id: 'combined',
    header: 'Start Time & End Time',
    cell: ({ row }) => (
      <CombinedCell data={row.original} fields={['startTime', 'endTime']} />
    ),
  },
  
  {
    accessorKey: 'classDuration',
    header: 'Class Duration'},
    {
      id: 'combined',
      header: 'Tutor',
      cell: ({ row }) => (
        <CombinedCell data={row.original} fields={['tutor', 'phone']} />
      ),
    },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction
    //@ts-ignore
 data={row.original} />
  }
];

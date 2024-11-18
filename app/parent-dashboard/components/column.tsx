'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import {CellAction} from "./cellAction"
import { CombinedCell } from '@/components/tables/student-tables/combined-cell';
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
    cell: ({ row }) => (
      <CombinedCell data={row.original.tutor} />
    ),
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

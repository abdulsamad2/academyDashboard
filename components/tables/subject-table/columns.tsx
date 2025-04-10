'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: 'Subject',
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.original.name}
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <CellAction
        //@ts-ignore
        data={row.original} 
      />
    )
  }
];

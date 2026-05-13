'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import {
  EntityCell,
  IdChip,
  StackedCell,
  TagsCell
} from '@/components/ui/table-cells';

interface Parent {
  id: string;
  name: string;
  city: string;
  email: string;
  phone: string;
  students: string[];
  createdAt: string;
  adminId?: string | null;
}

export const columns: ColumnDef<Parent>[] = [
  {
    accessorKey: 'name',
    header: 'Parent',
    cell: ({ row }) => (
      <EntityCell
        name={row.original.name}
        subtitle={row.original.city || undefined}
      />
    )
  },
  {
    id: 'contact',
    header: 'Contact',
    cell: ({ row }) => (
      <StackedCell
        primary={row.original.email}
        secondary={row.original.phone}
      />
    )
  },
  {
    id: 'students',
    header: 'Children',
    cell: ({ row }) => <TagsCell tags={row.original.students ?? []} max={2} />
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.createdAt}
      </span>
    )
  },
  {
    accessorKey: 'adminId',
    header: 'ID',
    cell: ({ row }) => <IdChip id={row.original.adminId ?? undefined} />
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <CellAction
          //@ts-ignore
          data={row.original}
        />
      </div>
    )
  }
];

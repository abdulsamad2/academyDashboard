'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import {
  EntityCell,
  IdChip,
  StackedCell,
  StatusBadge,
  TagsCell
} from '@/components/ui/table-cells';

interface Student {
  id: string;
  name: string;
  class: string;
  parent: string;
  parentEmail: string;
  parentPhone: string;
  hoursperWeek: number;
  subject: string[] | string;
  studymode: string;
  adminId?: string | null;
  assignedTutors?: string;
}

const modeVariant = (mode?: string) => {
  if (!mode) return 'muted' as const;
  const v = mode.toLowerCase();
  if (v.includes('online')) return 'success' as const;
  if (v.includes('person') || v.includes('home')) return 'info' as const;
  return 'muted' as const;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: 'name',
    header: 'Student',
    cell: ({ row }) => (
      <EntityCell
        name={row.original.name}
        subtitle={row.original.class || undefined}
      />
    )
  },
  {
    id: 'parent',
    header: 'Parent',
    cell: ({ row }) => (
      <StackedCell
        primary={row.original.parent}
        secondary={row.original.parentPhone}
      />
    )
  },
  {
    id: 'subjects',
    header: 'Subjects',
    cell: ({ row }) => {
      const subjects = Array.isArray(row.original.subject)
        ? row.original.subject
        : row.original.subject
        ? [row.original.subject]
        : [];
      return <TagsCell tags={subjects} max={2} />;
    }
  },
  {
    accessorKey: 'hoursperWeek',
    header: 'Hours/week',
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-foreground">
        {row.original.hoursperWeek ?? 0}h
      </span>
    )
  },
  {
    accessorKey: 'studymode',
    header: 'Mode',
    cell: ({ row }) => (
      <StatusBadge
        variant={modeVariant(row.original.studymode)}
        label={row.original.studymode || 'Unspecified'}
      />
    )
  },
  {
    accessorKey: 'assignedTutors',
    header: 'Tutors',
    cell: ({ row }) => (
      <span className="truncate text-sm text-foreground">
        {row.original.assignedTutors ?? '—'}
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

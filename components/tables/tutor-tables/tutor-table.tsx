'use client';

import { useState } from 'react';
import {
  ColumnDef,
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { DataTableShell } from '@/components/ui/data-table-shell';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  pageSizeOptions?: number[];
  /** Legacy props accepted but unused (table paginates client-side). */
  pageNo?: number;
  totalUsers?: number;
  pageCount?: number;
}

const multiFieldFilter: FilterFn<any> = (row, _columnId, filterValue) => {
  const term = String(filterValue).toLowerCase().trim();
  if (!term) return true;
  const name = String(row.getValue('name') || '').toLowerCase();
  if (name.includes(term)) return true;
  const adminId = String(row.getValue('adminId') || '').toLowerCase();
  if (adminId.includes(term)) return true;
  return false;
};

export function TutorTable<TData, TValue>({
  columns,
  data,
  pageSizeOptions = [10, 20, 30, 50]
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: { pageIndex, pageSize },
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    filterFns: { multiField: multiFieldFilter },
    //@ts-ignore
    globalFilterFn: 'multiField'
  });

  return (
    <DataTableShell
      table={table}
      columnCount={columns.length}
      searchValue={globalFilter}
      onSearchChange={setGlobalFilter}
      searchPlaceholder="Search by name or admin ID…"
      pageSizeOptions={pageSizeOptions}
      emptyLabel="No tutors yet."
      recordLabel="tutors"
    />
  );
}

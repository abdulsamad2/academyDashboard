'use client';

import { useState } from 'react';
import {
  ColumnDef,
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

export function LessonTable<TData, TValue>({
  columns,
  data,
  searchKey,
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
    state: { pagination: { pageIndex, pageSize }, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    filterFns: {
      fuzzy: (row, _columnId, value) => {
        const searchValue = String(row.getValue(searchKey) ?? '').toLowerCase();
        return searchValue.includes(String(value).toLowerCase());
      }
    },
    //@ts-ignore
    globalFilterFn: 'fuzzy'
  });

  return (
    <DataTableShell
      table={table}
      columnCount={columns.length}
      searchValue={globalFilter}
      onSearchChange={setGlobalFilter}
      searchPlaceholder="Search by student name…"
      pageSizeOptions={pageSizeOptions}
      emptyLabel="No lessons yet."
      recordLabel="lessons"
    />
  );
}

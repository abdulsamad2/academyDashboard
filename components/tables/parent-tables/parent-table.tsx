'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  FilterFn
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Users
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  pageSizeOptions?: number[];
}

// Custom filter function that searches across multiple fields
const multiFieldFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const searchTerms = String(filterValue).toLowerCase().trim();
  if (!searchTerms) return true;

  // Search in name field
  const nameValue = String(row.getValue('name') || '').toLowerCase();
  if (nameValue.includes(searchTerms)) return true;

  // Search in adminId field
  const adminIdValue = String(row.getValue('adminId') || '').toLowerCase();
  if (adminIdValue.includes(searchTerms)) return true;

  return false;
};

export function ParentTable<TData, TValue>({
  columns,
  data,
  searchKey,
  pageSizeOptions = [10, 20, 30, 40, 50]
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
    filterFns: {
      multiField: multiFieldFilter
    },
      //@ts-ignore
    globalFilterFn: 'multiField'
  });

  return (
    <Card className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Parents</h2>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search by name or admin ID..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="h-10 w-full pl-9 pr-4 md:w-[300px]"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <ScrollArea className="h-[calc(80vh-220px)] rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <Table className="min-w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="sticky top-0 z-10 bg-card bg-muted/50 font-semibold text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 py-4 md:flex-row">
        <div className="order-2 text-sm text-muted-foreground md:order-1">
          Showing {table.getFilteredRowModel().rows.length} of {data.length}{' '}
          parents
        </div>
        <div className="order-1 flex w-full flex-col items-center gap-4 sm:flex-row md:order-2 md:w-auto">
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <p className="whitespace-nowrap text-sm font-medium">
              Rows per page
            </p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <div className="whitespace-nowrap text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="hidden h-8 w-8 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden h-8 w-8 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

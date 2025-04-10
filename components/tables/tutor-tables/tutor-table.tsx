'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  FilterFn,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Users,
  X,
} from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  pageSizeOptions?: number[];
}

// Custom filter function that searches across multiple fields
const multiFieldFilter: FilterFn<any> = (row, columnId, filterValue, filterMeta) => {
  try {
    // @ts-ignore - filterMeta typing needs to be addressed
    const searchTerm = String(filterValue || '').toLowerCase().trim();
    if (!searchTerm) return true;

    // Helper function to safely get value from a row
    const safeGetValue = (row: any, id: string): string | undefined => {
      try {
        // Skip non-existent columns
        const allCells = row.getAllCells();
        let columnExists = false;
        
        for (let i = 0; i < allCells.length; i++) {
          if (allCells[i].column.id === id) {
            columnExists = true;
            break;
          }
        }
        
        if (!columnExists) {
          return undefined;
        }
        
        // Don't use getValue for combined fields
        if (id === 'name' && !columnExists) {
          return row.original.name?.toLowerCase();
        }
        
        const value = row.getValue(id);
        return value !== undefined && value !== null ? String(value).toLowerCase() : undefined;
      } catch (error) {
        // Column doesn't exist or can't be accessed
        return undefined;
      }
    };
    
    // For direct object access, never use getValue - use the original data
    const original = row.original || {};
    
    // Search in all the fields of the original data as a fallback
    if (original) {
      for (const key in original) {
        const value = original[key];
        if (value !== null && value !== undefined) {
          // Handle arrays specially (like subjects array)
          if (Array.isArray(value)) {
            for (const item of value) {
              if (item !== null && item !== undefined && String(item).toLowerCase().includes(searchTerm)) {
                return true;
              }
            }
          } 
          // Handle string fields
          else if (typeof value === 'string' || typeof value === 'number') {
            if (String(value).toLowerCase().includes(searchTerm)) {
              return true;
            }
          }
        }
      }
    }
    
    // Try to access specific columns safely
    // Only try columns that actually exist
    const columnIds = row.getAllCells().map(cell => cell.column.id);
    
    for (const colId of columnIds) {
      const value = safeGetValue(row, colId);
      if (value && value.includes(searchTerm)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    // Return true as a fallback to show all items when there's an error
    return true;
  }
};

export function TutorTable<TData, TValue>({
  columns,
  data,
  searchKey,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filter out the select column if it exists (to remove checkboxes)
  const filteredColumns = columns.filter(column => column.id !== 'select');

  const table = useReactTable({
    data,
    columns: filteredColumns,
    state: {
      pagination: { pageIndex, pageSize },
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    filterFns: {
      multiField: multiFieldFilter,
    },
    meta: {
      searchKey
    },
    // @ts-ignore - This is a valid filter function name
    globalFilterFn: 'multiField',
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 bg-primary/10 rounded-full">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tutors</h2>
            <p className="text-sm text-muted-foreground">
              Manage and monitor your tutor profiles
            </p>
          </div>
        </div>
        <div className="relative w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or admin ID..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-9 pr-4 w-full md:w-[300px] h-10 rounded-full focus-visible:ring-primary"
            />
            {globalFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full aspect-square rounded-full"
                onClick={() => setGlobalFilter('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table with improved scrolling */}
      <div className="rounded-xl border shadow-sm overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id}
                      className="font-semibold text-muted-foreground py-4 px-4 first:pl-6 last:pr-6"
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
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={`transition-colors hover:bg-muted/20 ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4 px-4 first:pl-6 last:pr-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={filteredColumns.length} 
                    className="py-16 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                      <Search className="h-8 w-8 text-muted-foreground/60" />
                      <p className="text-base font-medium">No tutors found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination with more modern styling */}
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between bg-muted/5 p-4 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground order-2 md:order-1">
          <span className="font-medium text-foreground">{table.getFilteredRowModel().rows.length}</span> of <span className="font-medium text-foreground">{data.length}</span> tutors
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 order-1 md:order-2 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-9 w-[70px] rounded-md focus:ring-primary">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
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
            <div className="text-sm font-medium">
              Page <span className="font-semibold text-foreground">{table.getState().pagination.pageIndex + 1}</span> of{' '}
              <span className="font-semibold text-foreground">{table.getPageCount() || 1}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-md hidden lg:flex border-muted-foreground/20"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-md border-muted-foreground/20"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-md border-muted-foreground/20"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-md hidden lg:flex border-muted-foreground/20"
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
    </div>
  );
}
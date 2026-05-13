'use client';

import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  type LucideIcon
} from 'lucide-react';

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
import { cn } from '@/lib/utils';

interface DataTableShellProps<TData> {
  table: TanstackTable<TData>;
  columnCount: number;
  title?: string;
  icon?: LucideIcon;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  toolbarRight?: React.ReactNode;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  emptyLabel?: string;
  recordLabel?: string;
}

export function DataTableShell<TData>({
  table,
  columnCount,
  title,
  icon: Icon,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search…',
  toolbarRight,
  showPageSize = true,
  pageSizeOptions = [10, 20, 30, 50, 100],
  emptyLabel = 'No matching records.',
  recordLabel = 'records'
}: DataTableShellProps<TData>) {
  const totalRows = table.getFilteredRowModel().rows.length;
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = Math.max(1, table.getPageCount());
  const pageSize = table.getState().pagination.pageSize;
  const showPagination = pageCount > 1;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-elevated-sm">
      {/* Toolbar */}
      <div className="flex flex-col-reverse gap-3 border-b border-border/80 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {title || Icon ? (
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
              {title}
            </div>
          ) : null}
          <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-2 py-0.5 text-2xs font-medium text-muted-foreground">
            {selectedRows > 0 ? (
              <>
                <span className="text-foreground">{selectedRows}</span>
                <span className="mx-1 opacity-50">/</span>
                {totalRows} selected
              </>
            ) : (
              <>
                {totalRows} {recordLabel}
              </>
            )}
          </span>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-2 sm:max-w-md sm:justify-end">
          {onSearchChange ? (
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue ?? ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-9 border-border/80 pl-9 text-sm"
              />
            </div>
          ) : null}
          {toolbarRight}
        </div>
      </div>

      {/* Table (grows to fill remaining height) */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columnCount}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    {emptyLabel}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Footer — only show if needed */}
      {(showPagination || showPageSize) && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/80 px-4 py-2 text-2xs sm:flex-row">
          <p className="text-muted-foreground">
            {selectedRows > 0
              ? `${selectedRows} of ${totalRows} selected`
              : `${totalRows} ${recordLabel}`}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {showPageSize && totalRows > 10 ? (
              <div className="flex items-center gap-1.5">
                <p className="whitespace-nowrap text-muted-foreground">Rows</p>
                <Select
                  value={`${pageSize}`}
                  onValueChange={(value) => table.setPageSize(Number(value))}
                >
                  <SelectTrigger className="h-7 w-[60px] text-xs">
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {pageSizeOptions.map((s) => (
                      <SelectItem key={s} value={`${s}`}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {showPagination ? (
              <>
                <p className="whitespace-nowrap text-muted-foreground">
                  Page <span className="text-foreground">{pageIndex + 1}</span>{' '}
                  / {pageCount}
                </p>
                <div className="flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-7 w-7', !showPageSize && 'hidden')}
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="First page"
                  >
                    <ChevronsLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-7 w-7', !showPageSize && 'hidden')}
                    onClick={() => table.setPageIndex(pageCount - 1)}
                    disabled={!table.getCanNextPage()}
                    aria-label="Last page"
                  >
                    <ChevronsRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

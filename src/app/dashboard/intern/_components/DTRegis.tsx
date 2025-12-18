'use client';

import { useState, useEffect } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Loading from '@/app/Loading';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  batchFilter?: string;
  batchSpecificMode?: boolean;
  className?: {
    table?: string;
    header?: string;
    parent?: string;
  };
  isError?: boolean;
  error?: any;
}

export default function DTRegis<TData, TValue>({
  columns,
  data,
  isLoading,
  className,
  batchFilter,
  isError,
  error,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);

  const advBatchFilter = batchFilter;

  const [showFilter, setShowFilter] = useState<boolean>(
    advBatchFilter != '' ? true : false,
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    if (advBatchFilter) {
      table.getColumn('batch')?.setFilterValue(advBatchFilter);
    }
  }, [advBatchFilter, table]);

  return (
    <div
      className={`w-full flex flex-col gap-3 ${className?.parent} scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100`}
    >
      <div className='flex items-center space-x-2'>
        <Switch checked={showFilter} onCheckedChange={setShowFilter} />
        <Label htmlFor='advfilter-check' className='text-typo-dark'>
          Enable Advance Filter
        </Label>
      </div>
      <div className={`gap-4 ${!showFilter ? 'hidden' : 'flex'}`}>
        <Input
          placeholder='Filter Applier Name...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />

        <Input
          placeholder='Filter Batch Id...'
          value={(table.getColumn('batch')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('batch')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table className={`${className?.table} `}>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead className={className?.header} key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                {isLoading ? (
                  <Loading />
                ) : isError && error.message === 'Request timed out' ? (
                  'Request Timed Out'
                ) : (
                  'No Results'
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

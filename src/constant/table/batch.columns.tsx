'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { BatchTableTypes } from '@/types/BatchTypes';
import _Fetch from '@/hooks/request.hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DialogValueTypes } from '@/types/DialogTypes';

type ColumnsBatchPropsType = {
  dialogToggle: (props: DialogValueTypes) => void;
  setFormState: (props: any) => void;
};

export const columnsBatch = ({
  dialogToggle,
  setFormState,
}: ColumnsBatchPropsType): ColumnDef<BatchTableTypes>[] => [
  {
    accessorKey: 'no',
    header: 'No',
  },
  {
    accessorKey: 'batchId',
    header: 'Batch ID',
  },
  {
    accessorKey: 'batchName',
    header: 'Batch Name',
  },
  {
    accessorKey: 'startDate',
    header: 'Start',
    enableSorting: true,
  },
  {
    accessorKey: 'endDate',
    header: 'Deadline',
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue<'Pending' | 'Hiring' | 'Done' | 'Failed'>(
        'status',
      );
      const color =
        status === 'Pending'
          ? 'bg-amber-500'
          : status === 'Hiring'
            ? 'bg-blue-500'
            : status === 'Done'
              ? 'bg-green-500'
              : 'bg-red-500';

      return (
        <div
          className={`w-4 h-4 rounded-full ${color}`}
          role='img'
          aria-label={status}
          title={status}
        />
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const handleDeleteBatch = async () => {
        const body = { batchId: row.original.batchId };
        await _Fetch('/intern/batch', 'DELETE', body);
      };
      const handleEditBatch = async () => {
        dialogToggle({
          target: 'Batch',
          action: 'Edit',
        });
        setFormState((prev: any) => ({
          ...prev,
          data: {
            ...row.original,
            batchStartTime: new Date(row.original.startDate)
              .toTimeString()
              .split(' ')[0], // "HH:mm:ss"
            batchEndTime: new Date(row.original.endDate)
              .toTimeString()
              .split(' ')[0], // "HH:mm:ss"
          },
        }));
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEditBatch}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteBatch}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

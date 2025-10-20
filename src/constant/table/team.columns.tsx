'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { userData } from '@/types/UserTypes';
import Typography from '@/components/Typography';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { setTeamData } from '@/lib/redux/slices/teamSlice';
import { useMutation } from '@/hooks/useQuery.hooks';
import { DialogValueTypes } from '@/types/DialogTypes';

type DialogToggleType = (props: DialogValueTypes) => void;

function TeamActionsCell({
  row,
  dialogToggle,
}: {
  row: any;
  dialogToggle: DialogToggleType;
}) {
  const dispatch = useDispatch();

  const { mutate } = useMutation({
    path: `/user?id=${row.original.id}`,
    queryKey: ['user'],
    method: 'DELETE',
  });

  const handleEditClick = () => {
    dispatch(setTeamData(row.original));
    dialogToggle({ target: 'Team', action: 'Edit' });
  };

  const handleDeleteClick = () => {
    mutate({});
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
        <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteClick}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columnsTeamData = ({
  dialogToggle,
}: {
  dialogToggle: DialogToggleType;
}): ColumnDef<userData>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown />
      </Button>
    ),
    size: 30,
    enableSorting: true,
    cell: ({ getValue }) => {
      const name = getValue<string>();
      if (!name) return null;
      return <Typography variant='c2'>{name}</Typography>;
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 30,
    cell: ({ getValue }) => {
      const email = getValue<string>();
      if (!email) return null;
      return <Typography variant='c2'>{email}</Typography>;
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    size: 30,
    cell: ({ getValue }) => {
      const role = getValue<string>();
      if (!role) return null;
      return <Typography variant='c2'>{role}</Typography>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    size: 30,
    cell: ({ row }) => (
      <TeamActionsCell row={row} dialogToggle={dialogToggle} />
    ),
  },
];

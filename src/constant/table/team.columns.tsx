'use client';

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
    queryKey: ['users'],
    method: 'DELETE',
    successMessage: 'Delete Team Success',
    errorMessage: 'Delete Team Failed',
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
    size: 30,
    enableSorting: true,
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown />
      </Button>
    ),
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
    id: 'verified',
    accessorFn: row => row.verified,
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const a = rowA.getValue<boolean>('verified') ? 1 : 0;
      const b = rowB.getValue<boolean>('verified') ? 1 : 0;
      return a - b;
    },
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ getValue }) => {
      const isVerified = getValue<boolean>();
      return (
        <Typography variant='c2'>
          {isVerified ? 'Verified' : 'Waiting confirmation'}
        </Typography>
      );
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

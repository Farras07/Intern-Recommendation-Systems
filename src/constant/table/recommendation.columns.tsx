'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { userData } from '@/types/UserTypes';
import { RecommendationType } from '@/types/RecommendationTypes';
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

// function RecommendationActionsCell({ row, dialogToggle }: { row: any, dialogToggle: DialogToggleType }) {
//   const dispatch = useDispatch();

//   const { mutate } = useMutation({
//     path: `/user?id=${row.original.id}`,
//     queryKey: ['user'],
//     method: 'DELETE',
//   });

//   const handleEditClick = () => {
//     dispatch(setTeamData(row.original))
//     dialogToggle({ target: 'Team', action: 'Edit' })
//   };

//   const handleDeleteClick = () => {
//     mutate({});
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="h-8 w-8 p-0">
//           <span className="sr-only">Open menu</span>
//           <MoreHorizontal />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
//         <DropdownMenuItem onClick={handleDeleteClick}>Delete</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
export const columnsRecommendationsData = (
  labels: string[],
): ColumnDef<any>[] => {
  const baseColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'candidateName',
      header: 'Name',
      cell: ({ getValue }) => (
        <Typography variant='c2'>{getValue<string>()}</Typography>
      ),
    },
    {
      accessorKey: 'candidateEmail',
      header: 'Email',
      cell: ({ getValue }) => (
        <Typography variant='c2'>{getValue<string>()}</Typography>
      ),
    },
  ];
  const matrixColumns: ColumnDef<any>[] = labels.map(label => ({
    accessorKey: label,
    header: label,
    cell: ({ getValue }) => (
      <Typography variant='c2'>{getValue<number>()}</Typography>
    ),
  }));
  const endColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'topsisScore',
      header: 'Topsis Score',
      cell: ({ getValue }) => (
        <Typography variant='c2'>{getValue<number>().toFixed(3)}</Typography>
      ),
    },
    {
      accessorKey: 'rank',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Rank <ArrowUpDown />
        </Button>
      ),
      cell: ({ getValue }) => (
        <Typography variant='c2'>{getValue<number>()}</Typography>
      ),
    },
  ];

  return [...baseColumns, ...matrixColumns, ...endColumns];
};

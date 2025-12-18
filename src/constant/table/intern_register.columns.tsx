'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { RegistDataTypes, VacancyRegisType } from '@/types/registDataTypes';
import Typography from '@/components/Typography';
import { ArrowUpDown, MoreHorizontal, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { setCurrentApplyId } from '@/lib/redux/slices/registerSlice';
import { useMutation } from '@/hooks/useQuery.hooks';
import { stageOrder } from '../stages.items';
import { useSession } from 'next-auth/react';

export const columnsRegisterData = ({
  dialogToggle,
  currentStage,
}: {
  dialogToggle: () => void;
  currentStage?: string | null;
}): ColumnDef<RegistDataTypes>[] => [
  {
    accessorKey: 'id',
    header: 'Apply ID',
    size: 30,
    cell: ({ getValue }) => {
      const id = getValue<string>();
      if (!id) return null;

      return <Typography variant='c2'>{id}</Typography>;
    },
  },
  {
    accessorKey: 'batch',
    header: 'Batch ID',
    size: 30,
    cell: ({ getValue }) => {
      const batch = getValue<string>();
      if (!batch) return null;

      return <Typography variant='c2'>{batch}</Typography>;
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
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown />
      </Button>
    ),
    size: 30,
    enableSorting: true, // 🔹 make sure sorting is enabled
    cell: ({ getValue }) => {
      const name = getValue<string>();
      if (!name) return null;

      return <Typography variant='c2'>{name}</Typography>;
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    size: 30,
    cell: ({ getValue }) => {
      const phone = getValue<string>();
      if (!phone) return null;

      return <Typography variant='c2'>{phone}</Typography>;
    },
  },
  {
    accessorFn: row => row.vacancy[0] as VacancyRegisType | undefined,
    header: 'Role 1',
    size: 30,
    cell: ({ getValue }) => {
      const value = getValue() as VacancyRegisType | undefined;
      const lastStage = value?.lastStage ?? 'N/A';
      const currentLastStageIndex = stageOrder.indexOf(lastStage);
      let currentStageIndex;
      if (currentStage) currentStageIndex = stageOrder.indexOf(currentStage);
      const title = value?.role?.title ?? 'N/A';
      return (
        <Typography variant='c2'>
          {title}{' '}
          {currentStageIndex
            ? currentStageIndex > currentLastStageIndex && (
                <span className='text-red-500 text-[12px] block'>
                  (Eliminated: {lastStage})
                </span>
              )
            : ''}
        </Typography>
      );
    },
  },
  {
    accessorFn: row => row.vacancy[1] as VacancyRegisType | undefined,
    header: 'Role 2',
    size: 30,
    cell: ({ getValue }) => {
      const value = getValue() as VacancyRegisType | undefined;
      const lastStage = value?.lastStage ?? 'N/A';
      const currentLastStageIndex = stageOrder.indexOf(lastStage);
      let currentStageIndex;
      if (currentStage) currentStageIndex = stageOrder.indexOf(currentStage);
      const title = value?.role?.title ?? 'N/A';
      return value ? (
        <Typography variant='c2'>
          {title}{' '}
          {currentStageIndex
            ? currentStageIndex > currentLastStageIndex && (
                <span className='text-red-500 text-[12px] block'>
                  (Eliminated: {lastStage})
                </span>
              )
            : ''}
        </Typography>
      ) : (
        <div className='w-10 flex justify-center'>
          <X color='#FF0000' />
        </div>
      );
    },
  },
  {
    accessorFn: row => row.vacancy as VacancyRegisType[] | undefined,
    header: 'Documents',
    size: 30,
    cell: ({ row, getValue }) => {
      const value = getValue() as VacancyRegisType[] | undefined;
      if (!value) return null;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>See Documents</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Documents</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <a
                  href={row.original.cv}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-full h-full'
                >
                  Curriculum Vitae
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {value.map((vac, index) =>
                vac?.portfolio?.link !== '' || vac?.achievement?.cert !== '' ? (
                  <DropdownMenuSub key={index}>
                    <DropdownMenuSubTrigger>
                      {vac?.role?.title ?? 'Unknown Role'}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {vac?.portfolio?.link && (
                          <DropdownMenuItem>
                            <a
                              href={vac.portfolio.link}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='w-full h-full'
                            >
                              Portfolio
                            </a>
                          </DropdownMenuItem>
                        )}
                        {vac?.achievement?.cert && (
                          <DropdownMenuItem>
                            <a
                              href={vac.achievement.cert}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='w-full h-full'
                            >
                              Certificate Achievement
                            </a>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ) : null,
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    size: 30,
    cell: ({ row }) => <ActionPart row={row} dialogToggle={dialogToggle} />,
  },
];

export function ActionPart({
  row,
  dialogToggle,
}: {
  row: any;
  dialogToggle: () => void;
}) {
  const { data: session } = useSession();
  if (!session) return;

  const { mutate } = useMutation({
    path: `/intern/vacancy/register/${row.original.id}`,
    queryKey: ['registrationData'],
    method: 'DELETE',
    successMessage: 'Delete Registration Data Success',
    errorMessage: 'Delete Registration Data Failed',
  });
  const dispatch = useDispatch();
  const handleEditClick = () => {
    dispatch(setCurrentApplyId(row.original.id));
    dialogToggle();
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
        {session.user.role === 'Admin' && (
          <DropdownMenuItem onClick={handleDeleteClick}>
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

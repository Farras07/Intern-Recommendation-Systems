'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { RegistDataTypes } from '@/types/registDataTypes';
import Typography from '@/components/Typography';
import { ArrowUpDown, File, MoreHorizontal, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { setCurrentApplyId } from '@/lib/redux/slices/registerSlice';

export const columnsRegisterData = ({
  dialogToggle,
}: {
  dialogToggle: () => void;
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
    accessorFn: row => row.vacancy[0],
    header: 'Role 1',
    size: 30,
    cell: ({ getValue }) => {
      const value = getValue();
      const { title } = value.role;
      return <Typography variant='c2'>{title}</Typography>;
    },
  },
  {
    accessorFn: row => row.vacancy[1],
    header: 'Role 2',
    size: 30,
    cell: ({ getValue }) => {
      let title = 'none';
      const value = getValue();
      if (value) title = value.role.title;
      //   const { title } = value.role
      return value ? (
        <Typography variant='c2'>{title}</Typography>
      ) : (
        <div className='w-10 flex justify-center'>
          <X color='#FF0000' />
        </div>
      );
    },
  },
  {
    accessorFn: row => row.vacancy,
    header: 'Documents',
    size: 30,
    cell: ({ row, getValue }) => {
      const value = getValue();
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
                vac.portofolioLink !== '' || vac.achievement.cert !== '' ? (
                  <DropdownMenuSub key={index}>
                    <DropdownMenuSubTrigger>
                      {vac.role.title}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {vac.portofolioLink !== '' && (
                          <DropdownMenuItem>
                            <a
                              href={vac.portofolioLink}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='w-full h-full'
                            >
                              Portfolio
                            </a>
                          </DropdownMenuItem>
                        )}
                        {vac.achievement.cert !== '' && (
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
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const handleEditClick = () => {
        dispatch(setCurrentApplyId(row.original.id));
        dialogToggle();
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
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

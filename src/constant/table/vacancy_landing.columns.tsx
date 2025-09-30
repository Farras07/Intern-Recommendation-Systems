'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { VacancyLandingType } from '@/types/JobTypes';
import { formatLocalDateTime } from '@/hooks/date-format.hooks';
import Typography from '@/components/Typography';
import { useDispatch } from 'react-redux';
import { setStep } from '@/lib/redux/slices/formSlice';
import { setPushRoleVacancy } from '@/lib/redux/slices/roleVacancySlice';

type ColumnsVacancyLandingPropsType = {
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
};

export const columnsVacancyLanding = ({
  setShowPopup,
}: ColumnsVacancyLandingPropsType): ColumnDef<VacancyLandingType>[] => [
  {
    accessorKey: 'id',
    header: 'Vacancy Id',
    size: 30,
    cell: ({ getValue }) => {
      const id = getValue<string>();
      if (!id) return null;

      return <Typography variant='p'>{id}</Typography>;
    },
  },
  {
    accessorKey: 'role.title',
    header: 'Role',
    size: 30,
    cell: ({ getValue }) => {
      const title = getValue<string>();
      if (!title) return null;

      return <Typography variant='p'>{title}</Typography>;
    },
  },
  {
    accessorKey: 'batch.name',
    header: 'Batch',
    size: 30,
    cell: ({ getValue }) => {
      const batchName = getValue<string>();
      if (!batchName) return null;

      return <Typography variant='p'>{batchName}</Typography>;
    },
  },
  {
    // id: 'status',
    header: 'Status',
    size: 30,
    cell: () => {
      return (
        <div
          className={`w-4 h-4 rounded-full bg-blue-500`}
          role='img'
          aria-label={'Hiring'}
          title={'Hiring'}
        />
      );
    },
  },
  {
    id: 'Deadline',
    header: 'Deadline',
    accessorFn: row => row.batch.endDate,
    size: 30,
    cell: ({ getValue }) => {
      const endDate = getValue<number>();
      if (!endDate) return null;

      // Firestore gives seconds → multiply by 1000 to get ms
      const formattedDate = formatLocalDateTime(new Date(endDate * 1000));

      return <Typography variant='p'>{formattedDate}</Typography>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    size: 30,
    cell: ({ row }) => {
      const dispatch = useDispatch();
      return (
        <div className='flex justify-end'>
          <Button
            onClick={() => {
              setShowPopup(true);
              dispatch(setPushRoleVacancy(row.original));
              dispatch(setStep({ type: 'Next' }));
            }}
            className='bg-typo-blue-sky text-white'
          >
            Apply
          </Button>
        </div>
      );
    },
  },
];

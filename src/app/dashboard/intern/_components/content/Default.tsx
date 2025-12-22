'use client';
import { useState, useEffect } from 'react';
import CollapsibleContainer from '@/components/CollapsibleContainer';
import Typography from '@/components/Typography';
import Filter from '../Filter';
import { useQuery } from '@/hooks/useQuery.hooks';
import { columnsRegisterData } from '@/constant/table/intern_register.columns';
import DTRegis from '@/app/dashboard/intern/_components/DTRegis';
import { useSearchParams } from 'next/navigation';
import { stageOrder } from '@/constant/stages.items';
import { RegistDataTypes } from '@/types/registDataTypes';

export default function DefaultRegistrationPage({
  dialogToggle,
  roleFilter,
  setRoleFilter,
}: {
  dialogToggle: () => void;
  roleFilter: string;
  setRoleFilter: (roleFilter: string) => void;
}) {
  const searchParams = useSearchParams();
  const batch = searchParams.get('batchId') ?? '';
  const stage = searchParams.get('stage') ? searchParams.get('stage') : '';
  const [dataIntern, setDataIntern] = useState([]);
  const { data, isError, error, isLoading } = useQuery({
    path: `/intern/vacancy/register?${roleFilter != 'all' ? `&role=${roleFilter}` : ''}`,
    queryKey: ['registrationData', roleFilter],
    timeout: 30000,
  });
  const { data: batchInfo, isLoading: batchInfoIsLoading } = useQuery({
    path: `/intern/batch?id=${batch}`,
    queryKey: ['batch', batch],
    timeout: 10000,
  });

  useEffect(() => {
    if (data && stage) {
      const currentStageIndex = stageOrder.indexOf(stage);

      const filteredData = data.filter((candidate: RegistDataTypes) => {
        return candidate.vacancy.some(vac => {
          const vacStageIndex = stageOrder.indexOf(vac.lastStage);
          return vacStageIndex >= currentStageIndex;
        });
      });

      setDataIntern(filteredData);
    } else {
      setDataIntern(data);
    }
  }, [data, stage]);

  return (
    <CollapsibleContainer
      selfIndex={1}
      activeIndex={0}
      rowSpan={7}
      collapsible={false}
      className={`col-span-4 row-span-7`}
    >
      <section className='flex h-[10%] justify-between items-center p-4'>
        <Typography variant='h6' weight='semibold'>
          Intern Data
        </Typography>
        <Filter role={roleFilter} setRole={setRoleFilter} />
      </section>
      <section className=' h-[90%] flex flex-col gap-4'>
        {batch && stage && (
          <section>
            <Typography variant='p' color='dark'>
              {!batchInfoIsLoading && stage
                ? batchInfo.batch.batchName
                : 'Wait a second...'}
            </Typography>
            <Typography variant='p' color='blue-sky' className='-mt-1'>
              {!batchInfoIsLoading && stage ? stage : 'Wait a second...'}
            </Typography>
          </section>
        )}
        <DTRegis
          columns={columnsRegisterData({ dialogToggle, currentStage: stage })}
          data={dataIntern ?? []}
          isLoading={isLoading}
          batchFilter={batch ? batch : ''}
          isError={isError}
          error={error}
          className={{ parent: 'max-h-[70vh]' }}
        />
      </section>
    </CollapsibleContainer>
  );
}

'use client';
import CollapsibleContainer from '@/components/CollapsibleContainer';
import Typography from '@/components/Typography';
import Filter from '../Filter';
import { useQuery } from '@/hooks/useQuery.hooks';
import { columnsRegisterData } from '@/constant/table/intern_register_stage.columns';
import DTRegis from '@/app/dashboard/intern/_components/DTRegis';
import { useSearchParams } from 'next/navigation';
import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BatchSpecificContent({
  dialogToggle,
  roleFilter,
  setRoleFilter,
}: {
  dialogToggle: () => void;
  roleFilter: string;
  setRoleFilter: (roleFilter: string) => void;
}) {
  const searchParams = useSearchParams();
  const batchId = searchParams.get('batchId');
  console.log('role: ', roleFilter);
  const { data, isError, error, isLoading } = useQuery({
    path: `/intern/vacancy/register?batchId=${batchId}${roleFilter != 'all' ? `&role=${roleFilter}` : ''}`,
    queryKey: ['registrationData', roleFilter],
    timeout: 15000,
  });
  console.log(data);
  const { data: batchInfo } = useQuery({
    path: `/intern/batch?batchId=${batchId}`,
    queryKey: ['batch'],
    timeout: 10000,
  });
  const router = useRouter();

  const handleGoBack = () => {
    // Optional: Add a small fade-out animation before routing
    document.body.classList.add('fade-out');

    setTimeout(() => {
      router.push('/dashboard/intern');
    }, 300); // delay to let transition play
  };

  return (
    <CollapsibleContainer
      selfIndex={1}
      activeIndex={0}
      rowSpan={7}
      collapsible={false}
      className={`col-span-4 row-span-7`}
    >
      <section className='flex h-[10%] justify-between items-center p-4'>
        <div className='flex justify-between items-center gap-4'>
          <div
            className='w-fit h-fit p-2 rounded-lg shadow-md hover:bg-light-gray/[10%] cursor-pointer'
            onClick={handleGoBack}
          >
            <MoveLeft size={20} />
          </div>
          <Typography variant='h6' weight='semibold'>
            Registration
          </Typography>
        </div>
        <Filter
          role={roleFilter}
          setRole={setRoleFilter}
          batchSpecicMode={true}
        />
      </section>
      <section className='h-[90%] flex flex-col gap-4'>
        <section>
          <Typography variant='p' color='dark'>
            {batchInfo ? batchInfo.batches[0].batchName : 'Unknown'}
          </Typography>
          <Typography variant='p' color='blue-sky' className='-mt-1'>
            {batchInfo ? batchInfo.batches[0].stage : 'Unknown Stage'}
          </Typography>
        </section>
        <div className='max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100'>
          <DTRegis
            columns={columnsRegisterData({ dialogToggle })}
            data={data ?? []}
            isLoading={isLoading}
            batchSpecificMode={true}
            isError={isError}
            error={error}

            // batchFilter={batch ? batch : ''}
          />
        </div>
      </section>
    </CollapsibleContainer>
  );
}

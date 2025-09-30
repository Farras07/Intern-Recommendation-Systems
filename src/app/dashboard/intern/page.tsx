'use client';
import { useState, useEffect, useRef } from 'react';
import Layout from '@/layouts/dashboard/LayoutContainer';
import CollapsibleContainer from '@/components/CollapsibleContainer';
import Typography from '@/components/Typography';
import Filter from './_components/Filter';
import { useQuery } from '@/hooks/useQuery.hooks';
import { columnsRegisterData } from '@/constant/table/intern_register.columns';
import DTRegis from '@/app/dashboard/intern/_components/DTRegis';
import { useSearchParams } from 'next/navigation';
import DialogTab from './_components/dialogTab';

type BatchFilter = 'active' | 'all';

export default function InternPage() {
  const searchParams = useSearchParams();
  const batch = searchParams.get('batchId');

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [batchFilter, setBatchFilter] = useState<BatchFilter>('active');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { data, isLoading } = useQuery({
    path: `/intern/vacancy/register?batchType=${batchFilter}${roleFilter != 'all' ? `&role=${roleFilter}` : ''}`,
    queryKey: ['registrationData', batchFilter, roleFilter],
  });
  const dialogToggle = () => {
    setIsDialogOpen(!isDialogOpen);
  };
  console.log(isDialogOpen);

  return (
    <Layout>
      <CollapsibleContainer
        selfIndex={1}
        activeIndex={0}
        rowSpan={7}
        collapsible={false}
        className={`col-span-4 row-span-7`}
      >
        <section className='flex h-[10%] justify-between items-center p-4'>
          <Typography variant='h6' weight='semibold'>
            Registration
          </Typography>
          <Filter
            batch={batchFilter}
            setBatch={setBatchFilter}
            role={roleFilter}
            setRole={setRoleFilter}
          />
        </section>
        <section className=' h-[90%] flex flex-col gap-4'>
          <DTRegis
            columns={columnsRegisterData({ dialogToggle })}
            data={data ?? []}
            isLoading={isLoading}
            batchFilter={batch ? batch : ''}
          />
        </section>
      </CollapsibleContainer>
      <DialogTab open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </Layout>
  );
}

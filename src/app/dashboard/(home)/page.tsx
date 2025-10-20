'use client';

import Layout from '@/layouts/dashboard/LayoutContainer';
import { Search, UserPlus } from 'lucide-react';
import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import TeamCard from '@/components/TeamCard';
import CollapsibleContainer from '@/components/CollapsibleContainer';
import handleToggleCollapsibleContainer from '@/hooks/resize-container.hooks';
import { useQuery } from '@/hooks/useQuery.hooks';
import Loading from '@/app/Loading';
import HomeDialog from '@/components/Home-Dialog';
import { DialogValueTypes } from '@/types/DialogTypes';
import PieceStages from '../_piece/stages';

export default function DashboardHome() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<DialogValueTypes>({
    target: null,
    action: null,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isPending } = useQuery({
    path: '/user',
    queryKey: ['users'],
  });
  const { data: batchActive, isPending: isReqBatchActivePending } = useQuery({
    path: '/intern/vacancy/stage',
    queryKey: ['batchActive'],
  });

  const handleIconSearchClick = () => {
    inputRef.current?.focus();
  };

  const dialogToggle = ({ target, action }: DialogValueTypes) => {
    setIsDialogOpen(!isDialogOpen);
    setDialogType({
      target,
      action,
    });
  };
  return (
    <Layout>
      <CollapsibleContainer
        selfIndex={1}
        activeIndex={activeIndex}
        onClick={() =>
          handleToggleCollapsibleContainer({
            index: 1,
            setState: setActiveIndex,
          })
        }
        rowSpan={7}
        collapsible={false}
        className={`col-span-3 row-span-3 max-h-[33vh] overflow-y-scroll p-9`}
      >
        <Typography variant='h6' weight='semibold'>
          Ongoing Registration Stage
        </Typography>
        {isReqBatchActivePending ? (
          <Loading />
        ) : batchActive ? (
          batchActive.map((batch: { batchId: string; stage: string }) => (
            <div key={batch.batchId} className='mt-10'>
              <PieceStages batchId={batch.batchId} stage={batch.stage} />
            </div>
          ))
        ) : (
          <Typography>There are no ongoing registration</Typography>
        )}
      </CollapsibleContainer>
      <CollapsibleContainer
        selfIndex={2}
        activeIndex={activeIndex}
        onClick={() =>
          handleToggleCollapsibleContainer({
            index: 2,
            setState: setActiveIndex,
          })
        }
        rowSpan={7}
        className='col-span-3 row-span-4'
      >
        <section className='flex justify-between items-center'>
          <Typography variant='h6' weight='semibold'>
            Vacancy
          </Typography>
          <div className='relative w-64'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              size={18}
              name='vacancySearch'
              onClick={handleIconSearchClick}
            />

            <Input
              ref={inputRef}
              id='vacancySearch'
              name='vacancySearch'
              type='text'
              placeholder='Search...'
              className='pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </section>
      </CollapsibleContainer>

      <CollapsibleContainer
        collapsible={true}
        selfIndex={3}
        onClick={() =>
          handleToggleCollapsibleContainer({
            index: 3,
            setState: setActiveIndex,
          })
        }
        activeIndex={activeIndex}
        rowSpan={7}
        // className="sticky px-4 pt-7 pb-5 row-start-2 col-start-4 row-span-6 flex flex-col"
        className='sticky row-start-2 col-start-4 row-span-7 flex flex-col'
      >
        <div className='flex flex-col items-center gap-6'>
          <Typography variant='h6' weight='semibold'>
            Team
          </Typography>
          <div className='w-full flex flex-col gap-2'>
            {isPending && <Loading />}
            {Array.isArray(data) &&
              data.map((user: any) => (
                <TeamCard
                  key={user.email}
                  name={user.name}
                  image={user.image}
                  role={user.role}
                  email={user.email}
                />
              ))}
          </div>
        </div>

        {/* Spacer pushes button to bottom */}
        <div className='mt-auto w-full text-center'>
          <Button
            variant='outline-black'
            className='cursor-pointer'
            onClick={() => dialogToggle({ target: 'Team', action: 'Add' })}
          >
            <UserPlus fill='black' />
            <Typography variant='btn' weight='semibold'>
              Invite
            </Typography>
          </Button>
        </div>
      </CollapsibleContainer>
      <HomeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        target={dialogType.target}
        action={dialogType.action}
        // formState={formState}
      />
    </Layout>
  );
}

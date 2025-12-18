'use client';

import Layout from '@/layouts/dashboard/LayoutContainer';
import { UserPlus } from 'lucide-react';
import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import TeamCard from '@/components/TeamCard';
import CollapsibleContainer from '@/components/CollapsibleContainer';
import handleToggleCollapsibleContainer from '@/hooks/resize-container.hooks';
import { useQuery } from '@/hooks/useQuery.hooks';
import Loading from '@/app/Loading';
import HomeDialog from '@/components/Home-Dialog';
import { DialogValueTypes } from '@/types/DialogTypes';
import PieceStages from '../_piece/stages';
import { useSession } from 'next-auth/react';

export default function DashboardHome() {
  const { data: session } = useSession();

  if (!session) return;

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<DialogValueTypes>({
    target: null,
    action: null,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useQuery({
    path: '/user?verified=true',
    queryKey: ['verifiedUsers'],
  });
  const { data: unverifiedTeam, isLoading: isUnverifiedTeamLoading } = useQuery(
    {
      path: '/user?verified=false',
      queryKey: ['unverifiedUsersNum'],
      timeout: 7000,
    },
  );
  const { data: batchActive, isLoading: isReqBatchActivePending } = useQuery({
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
        className={`col-start-1 col-span-3 row-start-2 row-span-7 max-h-[83vh] overflow-y-scroll p-9`}
      >
        <Typography variant='h6' weight='semibold'>
          Ongoing Registration Stage
        </Typography>
        {isReqBatchActivePending ? (
          <Loading />
        ) : batchActive ? (
          batchActive.map((batch: { batchId: string; stage: string }) => (
            <div key={batch.batchId} className='mt-10'>
              <PieceStages
                batchId={batch.batchId}
                stage={batch.stage}
                sessionRole={session.user.role}
              />
            </div>
          ))
        ) : (
          <Typography>There are no ongoing registration</Typography>
        )}
      </CollapsibleContainer>

      <CollapsibleContainer
        collapsible={true}
        selfIndex={2}
        onClick={() =>
          handleToggleCollapsibleContainer({
            index: 2,
            setState: setActiveIndex,
          })
        }
        activeIndex={activeIndex}
        rowSpan={7}
        // className="sticky px-4 pt-7 pb-5 row-start-2 col-start-4 row-span-6 flex flex-col"
        className='row-start-2 col-start-4 row-span-7 flex flex-col'
      >
        <div className='flex flex-col items-center gap-6 '>
          <Typography variant='h6' weight='semibold'>
            Team
          </Typography>
          <div className='w-full h-[50vh] overflow-y-auto flex flex-col gap-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100'>
            {isLoading && <Loading />}
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
          <div className='flex justify-center'>
            {isUnverifiedTeamLoading ? (
              <Loading />
            ) : (
              <Typography color='lightgray' variant='btn'>
                Waiting for confirmation (
                {unverifiedTeam ? unverifiedTeam.length : 0})
              </Typography>
            )}
          </div>
        </div>

        {/* Spacer pushes button to bottom */}
        {session.user.role === 'Admin' && (
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
        )}
      </CollapsibleContainer>
      <HomeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        target={dialogType.target}
        action={dialogType.action}
      />
    </Layout>
  );
}

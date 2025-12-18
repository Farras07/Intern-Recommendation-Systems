'use client';
import CollapsibleContainer from '@/components/CollapsibleContainer';
import Layout from '@/layouts/dashboard/LayoutContainer';
import Typography from '@/components/Typography';
import { useQuery } from '@/hooks/useQuery.hooks';
import DTTeam from './_components/DTTeam';
import { columnsTeamData } from '@/constant/table/team.columns';
import { useState, useEffect } from 'react';
import { userData } from '@/types/UserTypes';
import { Plus } from 'lucide-react';
import HomeDialog from '@/components/Home-Dialog';
import { DialogValueTypes } from '@/types/DialogTypes';
import { useSession } from 'next-auth/react';
import Warning from '@/components/Warning';

type dataProps = {
  data: userData[];
  unverifiedNum: number;
};

export default function Team() {
  const { data: session } = useSession();

  if (session?.user.role === 'Judge') {
    return <Warning message={'You Are not Allowed To Access This Page!'} />;
  }

  const [adminData, setAdminData] = useState<dataProps>({
    data: [],
    unverifiedNum: 0,
  });
  const [judgeData, setJudgeData] = useState<dataProps>({
    data: [],
    unverifiedNum: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<DialogValueTypes>({
    target: null,
    action: null,
  });
  const { data: userData, isLoading } = useQuery({
    path: '/user',
    queryKey: ['users'],
  });
  useEffect(() => {
    if (!isLoading && Array.isArray(userData)) {
      const admins: userData[] = [];
      const judges: userData[] = [];
      let unverifiedAdminCount = 0;
      let unverifiedJudgeCount = 0;

      for (const user of userData) {
        if (user.role === 'Admin') {
          admins.push(user);
          if (!user.verified) unverifiedAdminCount++;
        }

        if (user.role === 'Judge') {
          judges.push(user);
          if (!user.verified) unverifiedJudgeCount++;
        }
      }

      setAdminData({ data: admins, unverifiedNum: unverifiedAdminCount });
      setJudgeData({ data: judges, unverifiedNum: unverifiedJudgeCount });
    }
  }, [isLoading, userData]);

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
        collapsible={false}
        selfIndex={1}
        activeIndex={1}
        className={`col-span-4 row-span-7 p-9`}
      >
        <div className='flex gap-5 items-center'>
          <Typography variant='h5' weight='semibold'>
            Team
          </Typography>
          <Plus
            color='white'
            strokeWidth={3}
            size={20}
            className='cursor-pointer rounded-full bg-black'
            onClick={() => dialogToggle({ target: 'Team', action: 'Add' })}
          />
        </div>
        <section className='w-full flex'>
          <div className='w-1/2 flex flex-col gap-4 p-3'>
            <section>
              <Typography
                variant='h6'
                className='text-center'
                weight='semibold'
              >
                Admin
              </Typography>
              <Typography
                variant='c2'
                className='text-center'
                weight='medium'
                color='lightgray'
              >
                Waiting For Confirmation ({adminData.unverifiedNum})
              </Typography>
            </section>
            <DTTeam
              columns={columnsTeamData({ dialogToggle })}
              data={Array.isArray(adminData.data) ? adminData.data : []}
              isLoading={isLoading}
              className={{
                parent:
                  'max-h-[55vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100',
              }}
            />
          </div>
          <div className='w-1/2 flex flex-col gap-4 p-3'>
            <section>
              <Typography
                variant='h6'
                className='text-center'
                weight='semibold'
              >
                Judges
              </Typography>
              <Typography
                variant='c2'
                className='text-center'
                weight='medium'
                color='lightgray'
              >
                Waiting For Confirmation ({judgeData.unverifiedNum})
              </Typography>
            </section>
            <DTTeam
              columns={columnsTeamData({ dialogToggle })}
              data={Array.isArray(judgeData.data) ? judgeData.data : []}
              isLoading={isLoading}
              className={{
                parent:
                  'max-h-[55vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100',
              }}
            />
          </div>
        </section>
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

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

export default function Team() {
  const [adminData, setAdminData] = useState<userData[]>([]);
  const [judgeData, setJudgeData] = useState<userData[]>([]);
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
      const admins = userData.filter(user => user.role === 'Admin');
      setAdminData(admins);

      const judges = userData.filter(user => user.role === 'Judge');
      setJudgeData(judges);
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
            <Typography variant='h6' className='text-center' weight='semibold'>
              Admin
            </Typography>
            <DTTeam
              columns={columnsTeamData({ dialogToggle })}
              data={Array.isArray(adminData) ? adminData : []}
              isLoading={isLoading}
            />
          </div>
          <div className='w-1/2 flex flex-col gap-4 p-3'>
            <Typography variant='h6' className='text-center' weight='semibold'>
              Judges
            </Typography>
            <DTTeam
              columns={columnsTeamData({ dialogToggle })}
              data={Array.isArray(judgeData) ? judgeData : []}
              isLoading={isLoading}
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

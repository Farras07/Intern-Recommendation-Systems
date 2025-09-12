'use client';

import Layout from '@/layouts/dashboard/LayoutContainer';
import { Search, UserPlus } from 'lucide-react';
import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import TeamCard from '@/components/TeamCard';
import CollapsibleContainer from '@/components/CollapsibleContainer';
import { SessionUserData } from '@/types/SessionDataTypes';
import handleToggleCollapsibleContainer from '@/hooks/resize-container.hooks';
import DashboardNavbar from '@/components/DashboardNavbar';
import { useQuery } from '@/hooks/useQuery.hooks';
import Loading from '@/app/Loading';
import HomeDialog from '@/components/Home-Dialog';
import { DialogValueTypes } from '@/types/DialogTypes';

export default function DashboardHome() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<DialogValueTypes>({
    target: null,
    action: null,
  });

  // const [formState, setFormState] = useState({
  //   data: {},
  // });
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isPending } = useQuery({
    path: '/user',
    queryKey: ['users'],
  });
  console.log(data);

  const handleIconSearchClick = () => {
    inputRef.current?.focus();
  };

  if (!session?.user) return null;
  const { name }: SessionUserData = session.user as SessionUserData;

  const dialogToggle = ({ target, action }: DialogValueTypes) => {
    setIsDialogOpen(!isDialogOpen);
    setDialogType({
      target,
      action,
    });
  };
  return (
    <Layout>
      <div className='grid grid-cols-4 grid-rows-[fit-content(100%)_1fr] gap-3 h-full '>
        <DashboardNavbar username={name} />
        <CollapsibleContainer
          selfIndex={1}
          activeIndex={activeIndex}
          onClick={() =>
            handleToggleCollapsibleContainer({
              index: 1,
              setState: setActiveIndex,
            })
          }
          rowSpan={6}
          className={`col-span-3 row-span-3`}
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
          selfIndex={2}
          activeIndex={activeIndex}
          onClick={() =>
            handleToggleCollapsibleContainer({
              index: 2,
              setState: setActiveIndex,
            })
          }
          rowSpan={6}
          className='col-span-3 row-span-3'
        >
          p
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
          // className="sticky px-4 pt-7 pb-5 row-start-2 col-start-4 row-span-6 flex flex-col"
          className='sticky row-start-2 col-start-4 row-span-6 flex flex-col'
        >
          <div className='flex flex-col items-center gap-6'>
            <Typography variant='h6' weight='semibold'>
              Team
            </Typography>
            <div className='w-full flex flex-col gap-2'>
              {isPending && <Loading />}
              {Array.isArray(data?.user) &&
                data.user.map((user: any) => (
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
      </div>
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

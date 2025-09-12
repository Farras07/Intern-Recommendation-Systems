'use client';

import { useState, useEffect } from 'react';
import Layout from '@/layouts/dashboard/LayoutContainer';
import CollapsibleContainer from '@/components/CollapsibleContainer';
import handleToggleCollapsibleContainer from '@/hooks/resize-container.hooks';
import { useSession } from 'next-auth/react';
import Typography from '@/components/Typography';
import DashboardNavbar from '@/components/DashboardNavbar';
import { SessionUserData } from '@/types/SessionDataTypes';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { columns } from '@/constant/table/columns.table';
import { DataTable } from '@/components/Data-Table';
import { jobRoleType, VacancyTypes } from '@/types/JobTypes';
import { DialogPopUp } from '@/components/Vacancy-Dialog';
import { DialogValueTypes } from '@/types/DialogTypes';
import { showToast, DANGER_TOAST, SUCCESS_TOAST } from '@/components/Toast';
import _Fetch from '@/hooks/request.hooks';
import { BatchTableTypes } from '@/types/BatchTypes';
import { columnsBatch } from '@/constant/table//batch.columns';

export default function Vacancy() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<DialogValueTypes>({
    target: null,
    action: null,
  });
  const [isActionFinish, setIsActionFinish] = useState<boolean>(false);
  const [currentBatch, setCurrentBatch] = useState<string>('');
  const [currentRole, setCurrentRole] = useState<string>('');

  const [rolesData, setRolesData] = useState<jobRoleType[]>([]);
  const [batchData, setBatchData] = useState<BatchTableTypes[]>([]);
  const [vacancyData, setVacancyData] = useState<VacancyTypes[]>([]);

  const [formState, setFormState] = useState({
    batch: {
      currentBatch,
      onCurrentBatchChange: setCurrentBatch,
    },
    role: {
      currentRole,
      onCurrentRoleChange: setCurrentRole,
    },
    data: {},
  });
  const baseURL = process.env.NEXT_PUBLIC_BASEURL;

  useEffect(() => {
    const sourceRole = new EventSource('/api/intern/role/stream');
    const sourceBatch = new EventSource('/api/intern/batch/stream');
    const sourceVacancy = new EventSource('/api/intern/vacancy/stream');

    sourceRole.addEventListener('roles_update', event => {
      const data = JSON.parse(event.data);
      setRolesData(data);
    });
    sourceVacancy.addEventListener('vacancy_update', async event => {
      const vacancyData = JSON.parse(event.data);

      const fixData = await Promise.all(
        vacancyData.map(async (data: any, index: number) => {
          let status = 'Pending';
          const { batch } = await _Fetch(
            `/intern/batch?name=${data.batch}`,
            'GET',
          );

          const batchStartDateTime = new Date(batch.startDate);
          const batchEndDateTime = new Date(batch.endDate);
          const currentDate = new Date();

          if (currentDate > batchEndDateTime) status = 'Done';
          if (
            currentDate < batchEndDateTime &&
            currentDate > batchStartDateTime
          )
            status = 'Hiring';

          return {
            ...data,
            batchId: batch.batchId,
            startDate: batch.startDate,
            endDate: batch.endDate,
            no: index + 1,
            status,
          };
        }),
      );

      setVacancyData(fixData);
    });

    sourceBatch.addEventListener('batch_update', event => {
      const batchData = JSON.parse(event.data);
      const fixData = batchData.map((data: any, index: number) => {
        let status = 'Pending';

        const batchStartDateTime = new Date(data.startDate);
        const batchEndDateTime = new Date(data.endDate);
        const currentDate = new Date();

        if (currentDate > batchEndDateTime) status = 'Done';
        if (currentDate < batchEndDateTime && currentDate > batchStartDateTime)
          status = 'Hiring';

        return {
          ...data,
          startDate: data.startDate,
          endDate: data.endDate,
          no: index + 1,
          status,
        };
      });
      setBatchData(fixData);
    });

    return () => {
      sourceRole.close();
      sourceBatch.close();
    };
  }, []);

  const { data: session } = useSession();

  if (!session?.user) return null;
  const { name }: SessionUserData = session.user as SessionUserData;

  const dialogToggle = ({ target, action }: DialogValueTypes) => {
    setIsDialogOpen(!isDialogOpen);
    setDialogType({
      target,
      action,
    });
  };

  const handleDeleteVacancy = async (id: string) => {
    let toastMessage: string = '';
    try {
      await fetch(`${baseURL}/intern/role`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
        }),
      });
      toastMessage = 'Delete Vacancy Success';
      showToast(toastMessage, SUCCESS_TOAST);
    } catch (error) {
      toastMessage = 'Delete Vacancy Failed';
      showToast(toastMessage, DANGER_TOAST);
      console.log(error);
    }
  };
  return (
    <Layout>
      <section className='grid grid-cols-2 gap-3 h-full grid-rows-[fit-content(100%)_1fr]'>
        <DashboardNavbar username={name} />
        <CollapsibleContainer
          selfIndex={2}
          onClick={() =>
            handleToggleCollapsibleContainer({
              index: 2,
              setState: setActiveIndex,
            })
          }
          activeIndex={activeIndex}
          rowSpan={6}
          className='row-span-6'
        >
          <div className='flex gap-4 items-center'>
            <Typography variant='h6' weight='semibold'>
              Vacancy
            </Typography>
            <Plus
              color='white'
              strokeWidth={3}
              size={20}
              className='cursor-pointer rounded-full bg-black'
              onClick={() => dialogToggle({ target: 'Vacancy', action: 'Add' })}
            />
          </div>
          <div className='mt-5 flex flex-col gap-5'>
            <DataTable
              columns={columns({ dialogToggle, setFormState })}
              data={vacancyData}
            />
          </div>
        </CollapsibleContainer>
        <CollapsibleContainer
          selfIndex={1}
          onClick={() =>
            handleToggleCollapsibleContainer({
              index: 1,
              setState: setActiveIndex,
            })
          }
          activeIndex={activeIndex}
          rowSpan={6}
          className='row-span-5'
        >
          <div className='flex gap-4 items-center'>
            <Typography variant='h6' weight='semibold'>
              Batch
            </Typography>
            <Plus
              color='white'
              strokeWidth={3}
              size={20}
              className='cursor-pointer rounded-full bg-black'
              onClick={() => dialogToggle({ target: 'Batch', action: 'Add' })}
            />
          </div>
          <div className='mt-5 flex flex-col gap-5'>
            <DataTable
              columns={columnsBatch({ dialogToggle, setFormState })}
              data={batchData}
            />
          </div>
        </CollapsibleContainer>
        <CollapsibleContainer
          collapsible={false}
          selfIndex={3}
          onClick={() =>
            handleToggleCollapsibleContainer({
              index: 3,
              setState: setActiveIndex,
            })
          }
          activeIndex={activeIndex}
        >
          <Typography variant='h6' weight='semibold'>
            Role
          </Typography>
          <section className='mt-4 flex flex-wrap items-center gap-3'>
            <Button
              variant='default'
              className='cursor-pointer'
              onClick={() => dialogToggle({ target: 'Role', action: 'Add' })}
            >
              <Plus color='white' strokeWidth={2} />
              <Typography variant='c2' weight='semibold' color='white'>
                Add Role
              </Typography>
            </Button>
            {rolesData.length > 0 ? (
              rolesData.map((role, index) => {
                if (index < 6) {
                  // Show normal button for the first 6 roles
                  return (
                    <Button
                      key={role.id}
                      className='p-0 pr-2 border-0 group cursor-pointer'
                    >
                      <div
                        className='border border-black bg-background shadow-md rounded-[18px] hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-1 has-[>svg]:px-3 cursor-pointer'
                        onClick={() => {
                          setFormState(prev => ({
                            ...prev,
                            data: {
                              id: role.id,
                              title: role.title,
                              description: role.description,
                            },
                          }));
                          dialogToggle({ target: 'Role', action: 'Edit' });
                        }}
                      >
                        <Typography variant='c2' weight='semibold'>
                          {role.title}
                        </Typography>
                      </div>
                      <div
                        className='p-1 relative hidden group-hover:flex hover:bg-light-gray/[50%] rounded-md shadow-md cursor-pointer'
                        onClick={() => {
                          handleDeleteVacancy(role.id);
                          setIsActionFinish(!isActionFinish);
                        }}
                      >
                        <Trash color='red' />
                      </div>
                    </Button>
                  );
                }

                if (index === 6) {
                  // On the 7th item, show the "+N" button
                  const restRolesLength = rolesData.length - 6;
                  return (
                    <Button key='more-roles' variant='outline-black'>
                      <Typography variant='c2' weight='semibold'>
                        +{restRolesLength}
                      </Typography>
                    </Button>
                  );
                }

                // After index 6, render nothing
                return null;
              })
            ) : (
              <Typography>No Role</Typography>
            )}
          </section>
        </CollapsibleContainer>
      </section>
      <DialogPopUp
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        target={dialogType.target}
        action={dialogType.action}
        formState={formState}
      />
    </Layout>
  );
}

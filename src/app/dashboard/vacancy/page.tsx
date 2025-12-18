'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '@/layouts/dashboard/LayoutContainer';
import CollapsibleContainer from '@/components/CollapsibleContainer';
import handleToggleCollapsibleContainer from '@/hooks/resize-container.hooks';
import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { columns } from '@/constant/table/columns.table';
import { columnsBatch } from '@/constant/table/batch.columns';
import { DataTable } from '@/components/Data-Table';
import { DialogPopUp } from '@/components/Vacancy-Dialog';
import _Fetch from '@/hooks/request.hooks';
import { useMutation, useQuery } from '@/hooks/useQuery.hooks';
import { UTCToLocalTimezone } from '@/hooks/date-format.hooks';
import { jobRoleType, VacancyTableTypes } from '@/types/JobTypes';
import { DialogValueTypes } from '@/types/DialogTypes';
import { useSession } from 'next-auth/react';
import Warning from '@/components/Warning';

export default function Vacancy() {
  const { data: session } = useSession();

  if (session?.user.role === 'Judge') {
    return <Warning message={'You Are not Allowed To Access This Page!'} />;
  }

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<DialogValueTypes>({
    target: null,
    action: null,
  });
  const [formState, setFormState] = useState({
    batch: { currentBatch: '', onCurrentBatchChange: () => {} },
    role: { currentRole: '', onCurrentRoleChange: () => {} },
    data: {},
  });

  // === Fetching Data ===
  const { data: dataRole } = useQuery({
    path: '/intern/role',
    queryKey: ['role'],
  });
  const { data: dataBatch } = useQuery({
    path: '/intern/batch',
    queryKey: ['batch'],
  });
  const { data: dataVacancy } = useQuery({
    path: '/intern/vacancy?filter=all',
    queryKey: ['vacancy', 'batch'],
  });

  // === Delete Role Mutation ===
  const { mutate: mutateDeleteRole } = useMutation({
    path: '/intern/role',
    method: 'DELETE',
    queryKey: ['role'],
    successMessage: 'Role deleted successfully!',
    errorMessage: 'Failed to delete role!',
  });

  const dialogToggle = useCallback(({ target, action }: DialogValueTypes) => {
    setIsDialogOpen(prev => !prev);
    setDialogType({ target, action });
  }, []);

  // === Derived Data ===
  const batchData = useMemo(() => {
    if (!dataBatch?.batches) return [];
    return dataBatch.batches.map((b: any, i: number) => {
      const startDate = UTCToLocalTimezone(b.startDate);
      const endDate = UTCToLocalTimezone(b.endDate);
      const now = new Date();
      const status =
        now > new Date(b.endDate)
          ? 'Done'
          : now > new Date(b.startDate)
            ? 'Hiring'
            : 'Pending';
      return { ...b, startDate, endDate, status, no: i + 1 };
    });
  }, [dataBatch]);

  const [vacancyData, setVacancyData] = useState<VacancyTableTypes[]>([]);

  useEffect(() => {
    if (!dataVacancy?.vacancy) return;
    const formatVacancyData = async () => {
      const formatted = await Promise.all(
        dataVacancy.vacancy.map(async (v: any, i: number) => {
          const { batch } = await _Fetch(`/intern/batch?id=${v.batch}`, 'GET');
          const { role } = await _Fetch(`/intern/role?id=${v.role}`, 'GET');
          const startDate = UTCToLocalTimezone(batch.startDate);
          const endDate = UTCToLocalTimezone(batch.endDate);
          const now = new Date();
          const status =
            now > new Date(batch.endDate)
              ? 'Done'
              : now > new Date(batch.startDate)
                ? 'Hiring'
                : 'Pending';

          return {
            ...v,
            no: i + 1,
            batch: batch.batchName,
            role: role.title,
            startDate,
            endDate,
            status,
          };
        }),
      );
      setVacancyData(formatted);
    };
    formatVacancyData();
  }, [dataVacancy]);

  const handleDeleteRole = useCallback(
    (id: string) => {
      mutateDeleteRole({ id });
    },
    [mutateDeleteRole],
  );

  // === Render ===
  return (
    <Layout>
      {/* VACANCY SECTION */}
      <CollapsibleContainer
        selfIndex={2}
        onClick={() =>
          handleToggleCollapsibleContainer({
            index: 2,
            setState: setActiveIndex,
          })
        }
        activeIndex={activeIndex}
        rowSpan={7}
        className='row-span-7 col-span-2'
      >
        <Header
          title='Vacancy'
          onAdd={() => dialogToggle({ target: 'Vacancy', action: 'Add' })}
        />
        <DataTable
          columns={columns({ dialogToggle, setFormState })}
          data={vacancyData}
          className={{ parent: 'max-h-[65vh]' }}
        />
      </CollapsibleContainer>

      {/* BATCH SECTION */}
      <CollapsibleContainer
        selfIndex={1}
        onClick={() =>
          handleToggleCollapsibleContainer({
            index: 1,
            setState: setActiveIndex,
          })
        }
        activeIndex={activeIndex}
        rowSpan={7}
        className='row-span-4 col-span-2'
      >
        <Header
          title='Batch'
          onAdd={() => dialogToggle({ target: 'Batch', action: 'Add' })}
        />
        <DataTable
          columns={columnsBatch({ dialogToggle, setFormState })}
          data={batchData}
          className={{
            parent: `${activeIndex === 1 ? 'max-h-[65vh]' : 'max-h-[30vh]'}`,
          }}
        />
      </CollapsibleContainer>

      {/* ROLE SECTION */}
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
        className='row-span-3 col-span-2'
      >
        <Typography variant='h6' weight='semibold'>
          Role
        </Typography>
        <section className='mt-4 flex flex-wrap items-center gap-3'>
          <AddButton
            onClick={() => dialogToggle({ target: 'Role', action: 'Add' })}
          />
          <RoleList
            dataRole={dataRole}
            onDelete={handleDeleteRole}
            onEdit={dialogToggle}
            setFormState={setFormState}
          />
        </section>
      </CollapsibleContainer>

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

/* === Sub Components === */
const Header = ({ title, onAdd }: { title: string; onAdd: () => void }) => (
  <div className='flex gap-4 items-center mb-5'>
    <Typography variant='h6' weight='semibold'>
      {title}
    </Typography>
    <Plus
      color='white'
      strokeWidth={3}
      size={20}
      className='cursor-pointer rounded-full bg-black'
      onClick={onAdd}
    />
  </div>
);

const AddButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant='default' onClick={onClick}>
    <Plus color='white' strokeWidth={2} />
    <Typography variant='c2' weight='semibold' color='white'>
      Add Role
    </Typography>
  </Button>
);

const RoleList = ({
  dataRole,
  onDelete,
  onEdit,
  setFormState,
}: {
  dataRole: any;
  onDelete: (id: string) => void;
  onEdit: ({ target, action }: DialogValueTypes) => void;
  setFormState: any;
}) => {
  if (!dataRole?.roles?.length) return <Typography>No Role</Typography>;

  return (
    <>
      {dataRole.roles.slice(0, 6).map((role: jobRoleType) => (
        <Button
          key={role.id}
          className='p-0 pr-2 border-0 group cursor-pointer'
        >
          <div
            className='border border-black bg-background shadow-md rounded-[18px] hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-1 has-[>svg]:px-3 cursor-pointer'
            onClick={() => {
              setFormState((prev: any) => ({
                ...prev,
                data: {
                  id: role.id,
                  title: role.title,
                  description: role.description,
                },
              }));
              onEdit({ target: 'Role', action: 'Edit' });
            }}
          >
            <Typography variant='c2' weight='semibold'>
              {role.title}
            </Typography>
          </div>
          <div
            className='p-1 relative hidden group-hover:flex hover:bg-light-gray/[50%] rounded-md shadow-md cursor-pointer'
            onClick={() => onDelete(role.id)}
          >
            <Trash color='red' />
          </div>
        </Button>
      ))}
      {dataRole.roles.length > 6 && (
        <Button variant='outline-black'>
          <Typography variant='c2' weight='semibold'>
            +{dataRole.roles.length - 6}
          </Typography>
        </Button>
      )}
    </>
  );
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useQuery } from '@/hooks/useQuery.hooks';
import Loading from '@/app/Loading';
import { jobRoleType } from '@/types/JobTypes';

export default function Filter({
  role,
  setRole,
}: {
  // batch?: 'active' | 'all';
  // setBatch?: (currentBatch: 'active' | 'all') => void;
  role: string;
  setRole: (currentRole: string) => void;
  batchSpecicMode?: boolean;
}) {
  // const [selectedBatch, setSelectedBatch] = useState<'active' | 'all'| undefined>(batch);
  const [selectedRole, setSelectedRole] = useState(role);

  const { data, isLoading } = useQuery({
    path: `/intern/role`,
    queryKey: ['rolesData'],
  });

  return (
    <section className='flex gap-3 items-center'>
      {/* {!batchSpecicMode && setBatch && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>Filter Batch: {selectedBatch}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56' align='start'>
            <DropdownMenuLabel>Choose Batch</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedBatch}
              onValueChange={value => {
                const v = value as 'active' | 'all';
                setSelectedBatch(v);
                setBatch(v);
              }}
            >
              <DropdownMenuRadioItem value='active'>
                Active Batch
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='all'>All Batch</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )} */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline'>Filter Role: {selectedRole}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='start'>
          <DropdownMenuLabel>Choose Role</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedRole}
            onValueChange={value => {
              if (value != 'all') {
                const roleSelect = data.roles.filter(
                  (role: jobRoleType) => role.id == value,
                )[0];
                setSelectedRole(roleSelect.title);
                setRole(value);
              } else {
                setSelectedRole('all');
                setRole('all');
              }
            }}
          >
            <DropdownMenuRadioItem value={'all'}>all</DropdownMenuRadioItem>
            {isLoading ? (
              <Loading />
            ) : (
              data.roles.map((role: jobRoleType) => (
                <DropdownMenuRadioItem key={role.id} value={role.id}>
                  {role.title}
                </DropdownMenuRadioItem>
              ))
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Typography from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { formRoleQVacancySchema } from '@/constant/schemas.items';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { MoveRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setStep } from '@/lib/redux/slices/formSlice';
import { RootState } from '@/lib/redux/store';
import { useQuery } from '@/hooks/useQuery.hooks';
import { setPushRoleVacancy } from '@/lib/redux/slices/roleVacancySlice';
import { BatchItemType, FormVacancyItemType } from '@/types/OpenVacancyTypes';

export default function RolesQ() {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.roleVacancyPick.data);
  const dataForm = useSelector((state: RootState) => state.form.data);
  console.log(dataForm);
  const { data: openVacancyData } = useQuery({
    path: '/intern/vacancy?filter=open',
    queryKey: ['vacancyOpen'],
  });

  const vacancies = openVacancyData?.vacancy ?? [];
  const roleVacancy = vacancies
    .filter((vacancy: BatchItemType) => vacancy.batch.id == data[0]?.batch.id)
    .filter((vacancy: { id: string }) => vacancy.id != data[0]?.id);
  console.log(roleVacancy);
  const form = useForm<z.infer<typeof formRoleQVacancySchema>>({
    resolver: zodResolver(formRoleQVacancySchema),
    defaultValues: {
      vacancy_2: data[1]?.id || '',
    },
  });

  function onNext(values: z.infer<typeof formRoleQVacancySchema>) {
    if (values.vacancy_2 != '' && selectedRoleVacancy.id != data[1]?.id) {
      dispatch(setPushRoleVacancy(selectedRoleVacancy));
    }
    dispatch(setStep({ type: 'Next' }));
  }

  const selectedRoleVacancyId = form.watch('vacancy_2');
  const selectedRoleVacancy = roleVacancy.find(
    (role: { id: string }) => role.id === selectedRoleVacancyId,
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className='h-full w-full flex flex-col justify-between'
      >
        {/* Role choose container */}
        <div className='flex flex-1 justify-center px-8 py-6'>
          <div
            className='grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl bg-lightgray/20 
              shadow-lg rounded-2xl p-10 items-center'
          >
            {/* Role 1 */}
            <div className='flex flex-col items-center flex-1 p-4'>
              <Typography
                variant='h5'
                color='blue-sky'
                weight='bold'
                className='mb-2'
              >
                Role 1
              </Typography>
              <Typography variant='p' color='white' weight='medium'>
                {data[0]?.role.title}
              </Typography>
            </div>

            {/* Role 2 */}
            <div className='flex flex-col items-center flex-1 p-4'>
              <Typography
                variant='h5'
                color='blue-sky'
                weight='bold'
                className='mb-2'
              >
                Role 2 (Optional)
              </Typography>
              <FormField
                control={form.control}
                name='vacancy_2'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline'>
                            {selectedRoleVacancy?.role.title || 'Choose Role'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Role</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            {roleVacancy?.map((role: FormVacancyItemType) => (
                              <DropdownMenuRadioItem
                                key={role.id}
                                value={role.id}
                              >
                                {role.batch.name} - {role.role.title}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className='flex justify-center pb-16'>
          <Button
            variant={'hero-card'}
            type='submit'
            className='cursor-pointer hover:bg-amber-300 flex items-center gap-2'
          >
            <Typography color='dark' weight='semibold'>
              Next
            </Typography>
            <MoveRight />
          </Button>
        </div>
      </form>
    </Form>
  );
}

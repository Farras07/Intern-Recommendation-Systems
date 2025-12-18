'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { showToast, DANGER_TOAST } from '@/components/Toast';
import InvariantError from '@/exceptions/InvariantError';
import { DialogValueTypes } from '@/types/DialogTypes';
import { jobRoleType } from '@/types/JobTypes';
import Calendar from '@/components/App-Calendar';
import { useEffect, useState } from 'react';
import _Fetch from '@/hooks/request.hooks';
import {
  formVacancySchema,
  formBatchSchema,
  formRoleSchema,
} from '@/constant/schemas.items';
import { BatchResponseType } from '@/types/BatchTypes';
import { combineToUTC } from '@/hooks/date-format.hooks';
import { useMutation, useQuery } from '@/hooks/useQuery.hooks';
import { useSession } from 'next-auth/react';

type DialogProps = DialogValueTypes & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: {
    batch: {
      currentBatch?: string;
      onCurrentBatchChange?: (batch: string) => void;
    };
    role: {
      currentRole?: string;
      onCurrentRoleChange?: (role: string) => void;
    };
    data?: any;
  };
};

export function DialogPopUp({
  open,
  onOpenChange,
  target,
  action,
  formState,
}: DialogProps) {
  const { data: session } = useSession();
  if (!session) return null;

  const { data } = formState;
  const now = new Date();
  const [batchData, setBatchData] = useState<BatchResponseType[]>([]);
  const [roleData, setRoleData] = useState<jobRoleType[]>([]);

  const { data: dataBatch } = useQuery({
    path: '/intern/batch',
    queryKey: ['batch'],
  });
  const { data: dataRole } = useQuery({
    path: '/intern/role',
    queryKey: ['role'],
  });

  const { mutate: mutateAddRole } = useMutation({
    path: '/intern/role',
    method: 'POST',
    queryKey: ['role'],
    successMessage: 'Add Role Success',
    errorMessage: 'Add Role Failed',
  });
  const { mutate: mutatePutRole } = useMutation({
    path: '/intern/role',
    method: 'PUT',
    queryKey: ['role'],
    successMessage: 'Update Role Success',
    errorMessage: 'Update Role Failed',
  });
  const { mutate: mutateAddBatch } = useMutation({
    path: '/intern/batch',
    method: 'POST',
    queryKey: ['batch'],
    successMessage: 'Add Batch Success',
    errorMessage: 'Add Batch Failed',
  });
  const { mutate: mutatePutBatch } = useMutation({
    path: '/intern/batch',
    method: 'PUT',
    queryKey: ['batch'],
    successMessage: 'Update Batch Success',
    errorMessage: 'Update Batch Failed',
  });
  const { mutate: mutateAddVacancy } = useMutation({
    path: '/intern/vacancy',
    method: 'POST',
    queryKey: ['vacancy'],
    successMessage: 'Add Vacancy Success',
    errorMessage: 'Add Vacancy Failed',
  });
  const { mutate: mutatePutVacancy } = useMutation({
    path: '/intern/vacancy',
    method: 'PUT',
    queryKey: ['vacancy'],
    successMessage: 'Update Vacancy Success',
    errorMessage: 'Update Vacancy Failed',
  });

  const formVacancy = useForm<z.infer<typeof formVacancySchema>>({
    resolver: zodResolver(formVacancySchema),
    defaultValues: {
      batch: action == 'Edit' ? data.batch : '',
      role: action == 'Edit' ? data.role : '',
      skills:
        action == 'Edit'
          ? data.skills
          : [
              {
                priority: 0,
                skillName: '',
              },
            ],
    },
  });
  const formBatch = useForm<z.infer<typeof formBatchSchema>>({
    resolver: zodResolver(formBatchSchema),
    defaultValues: {
      batchName: action == 'Edit' ? data.batchName : '',
      batchStartDate: now,
      batchStartTime: '00:00',
      batchEndDate: now,
      batchEndTime: '00:00',
    },
  });
  const formRole = useForm<z.infer<typeof formRoleSchema>>({
    resolver: zodResolver(formRoleSchema),
    defaultValues: {
      roleTitle: action == 'Edit' ? data.title : '',
      roleDescription: action == 'Edit' ? data.description : '',
    },
  });

  const onSubmitVacancy = async (values: z.infer<typeof formVacancySchema>) => {
    try {
      if (action === 'Add') {
        mutateAddVacancy(values);
      }
      if (action === 'Edit') {
        mutatePutVacancy({ id: data.id, skills: values.skills });
      }
    } catch (error) {
      if (error instanceof InvariantError) {
        showToast(error.message, DANGER_TOAST);
      }
    } finally {
      onOpenChange(false);
    }
  };

  const onSubmitBatch = async (values: z.infer<typeof formBatchSchema>) => {
    try {
      const payload = {
        ...values,
        batchStartDate: combineToUTC(
          values.batchStartDate,
          values.batchStartTime,
        ),
        batchEndDate: combineToUTC(values.batchEndDate, values.batchEndTime),
      };

      if (action === 'Add') mutateAddBatch(payload);
      if (action === 'Edit')
        mutatePutBatch({ batchId: data.batchId, ...payload });
    } catch (error) {
      if (error instanceof InvariantError) {
        showToast(error.message, DANGER_TOAST);
      }
    } finally {
      onOpenChange(false);
    }
  };

  const onSubmitRole = async (values: z.infer<typeof formRoleSchema>) => {
    try {
      if (target === 'Role') {
        if (action === 'Add') {
          mutateAddRole({
            title: values.roleTitle,
            description: values.roleDescription,
          });
        } else if (action === 'Edit') {
          mutatePutRole({
            id: data?.id,
            title: values.roleTitle,
            description: values.roleDescription,
          });
        }
      }
    } catch (error) {
      if (error instanceof InvariantError) {
        showToast(error.message, DANGER_TOAST);
      }
    } finally {
      onOpenChange(false);
    }
  };

  useEffect(() => {
    const getBatchData = async () => {
      if (target === 'Vacancy') {
        setBatchData(dataBatch.batches);
        setRoleData(dataRole.roles);
      }
    };
    getBatchData();
  }, [target]);

  useEffect(() => {
    if (action === 'Edit' && target === 'Batch') {
      formBatch.reset({
        batchName: data.batchName || '',
        batchStartDate: new Date(data.startDate) || now,
        batchStartTime: data.batchStartTime || '00:00',
        batchEndDate: new Date(data.endDate) || now,
        batchEndTime: data.batchEndTime || '00:00',
      });
    }
    if (action === 'Edit' && target === 'Vacancy') {
      formVacancy.reset({
        batch: data.batch ? data.batch : '',
        role: data.role ? data.role : '',
        skills: data.skills
          ? data.skills
          : [
              {
                priority: 0,
                skillName: '',
              },
            ],
      });
    }
    if (action === 'Edit' && target === 'Role') {
      formRole.reset({
        roleTitle: data.title ? data.title : '',
        roleDescription: data.description ? data.description : '',
      });
    }
    if (!open) {
      formBatch.reset({
        batchName: '',
        batchStartDate: now,
        batchStartTime: '00:00',
        batchEndDate: now,
        batchEndTime: '00:00',
      });
      formVacancy.reset({
        batch: '',
        role: '',
        skills: [
          {
            priority: 0,
            skillName: '',
          },
        ],
      });
      formRole.reset({
        roleTitle: '',
        roleDescription: '',
      });
    }
  }, [open, formVacancy]);

  const selectedBatchId = formVacancy.watch('batch');
  const selectedBatch = batchData.find(
    batch => batch.batchId === selectedBatchId,
  );
  const selectedRoleId = formVacancy.watch('role');
  const selectedRole = roleData.find(role => role.id === selectedRoleId);

  const { control } = formVacancy;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {action} {target}
          </DialogTitle>
          <DialogDescription>
            {action} a {target} here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        {/* --------------------------- VACANCY --------------------------- */}
        {target === 'Vacancy' && (
          <div className='grid gap-4'>
            <Form {...formVacancy}>
              <form
                onSubmit={formVacancy.handleSubmit(onSubmitVacancy)}
                className='space-y-8'
              >
                <FormField
                  control={formVacancy.control}
                  name='batch'
                  render={() => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Batch</FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline'>
                            {selectedBatch
                              ? selectedBatch.batchName
                              : action === 'Edit'
                                ? data.batch
                                : 'Choose Batch'}
                          </Button>
                        </DropdownMenuTrigger>
                        {action != 'Edit' && (
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Batch</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <FormControl>
                              <DropdownMenuRadioGroup>
                                {batchData.map(batch => (
                                  <DropdownMenuItem
                                    key={batch.batchId}
                                    onClick={() =>
                                      formVacancy.setValue(
                                        'batch',
                                        batch.batchId,
                                        { shouldValidate: true },
                                      )
                                    }
                                  >
                                    {batch.batchName}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuRadioGroup>
                            </FormControl>
                          </DropdownMenuContent>
                        )}
                      </DropdownMenu>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formVacancy.control}
                  name='role'
                  render={() => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Role</FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline'>
                            {selectedRole
                              ? selectedRole.title
                              : action === 'Edit'
                                ? data.role
                                : 'Choose Role'}
                          </Button>
                        </DropdownMenuTrigger>
                        {action != 'Edit' && (
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Role</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <FormControl>
                              <DropdownMenuRadioGroup>
                                {roleData.map(role => (
                                  <DropdownMenuItem
                                    key={role.id}
                                    onClick={() =>
                                      formVacancy.setValue('role', role.id, {
                                        shouldValidate: true,
                                      })
                                    }
                                  >
                                    {role.title}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuRadioGroup>
                            </FormControl>
                          </DropdownMenuContent>
                        )}
                      </DropdownMenu>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormLabel className='mr-4'>Skills</FormLabel>
                {fields.map((field, index) => (
                  <div key={field.id} className='grid grid-cols-4 gap-2'>
                    {/* Priority */}
                    <FormField
                      control={control}
                      name={`skills.${index}.priority`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              min={1}
                              max={5}
                              step={1}
                              {...field}
                              onChange={e =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Skill Name */}
                    <FormField
                      control={control}
                      name={`skills.${index}.skillName`}
                      render={({ field }) => (
                        <FormItem className='col-span-2'>
                          <FormLabel>Skill Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Type skill'
                              {...field}
                              disabled={action === 'Edit'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remove button */}
                    <Button
                      type='button'
                      disabled={action === 'Edit'}
                      onClick={() => remove(index)}
                      className='place-self-end cursor-pointer'
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                {/* Add new skill */}
                <Button
                  type='button'
                  className='cursor-pointer'
                  onClick={() => append({ priority: 0, skillName: '' })}
                >
                  Add Skill
                </Button>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant='outline'
                      type='button'
                      className='cursor-pointer'
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type='submit' className='cursor-pointer'>
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
        {/* --------------------------- ROLE ---------------------------*/}
        {target === 'Role' && (
          <div className='grid gap-4'>
            <Form {...formRole}>
              <form
                onSubmit={formRole.handleSubmit(onSubmitRole)}
                className='space-y-8'
              >
                <FormField
                  control={formRole.control}
                  name='roleTitle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Title</FormLabel>
                      <FormControl>
                        <Input placeholder='Type Role Title' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formRole.control}
                  name='roleDescription'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Type Role Description'
                          // defaultValue={action === "Edit" ? data.description : ""}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant='outline'
                      type='button'
                      className='cursor-pointer'
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type='submit' className='cursor-pointer'>
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}

        {/* --------------------------- BATCH ---------------------------*/}
        {target === 'Batch' && (
          <Form {...formBatch}>
            <form
              onSubmit={formBatch.handleSubmit(onSubmitBatch)}
              className='space-y-8'
            >
              <FormField
                control={formBatch.control}
                name='batchName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Name</FormLabel>
                    <FormControl>
                      <Input placeholder={'Type Batch Name'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formBatch.control}
                name='batchStartDate'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Calendar
                        timeType='Start'
                        dateField={field}
                        timeField={formBatch.register('batchStartTime')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formBatch.control}
                name='batchEndDate'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Calendar
                        timeType='Deadline'
                        dateField={field}
                        timeField={formBatch.register('batchEndTime')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant='outline'
                    type='button'
                    className='cursor-pointer'
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type='submit' className='cursor-pointer'>
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// const addVacancySubmit = async (payload: any) => {
//   try {
//     await _Fetch('/intern/vacancy', 'POST', payload);
//   } catch (error) {
//     throw error;
//   }
// };

// const updateVacancySubmit = async (payload: any) => {
//   try {
//     await _Fetch('/intern/vacancy', 'PUT', payload);
//   } catch (error) {
//     throw error;
//   }
// };

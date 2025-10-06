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
import { showToast, SUCCESS_TOAST, DANGER_TOAST } from '@/components/Toast';
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
  const { data } = formState;
  const now = new Date();

  const [batchData, setBatchData] = useState<BatchResponseType[]>([]);
  const [roleData, setRoleData] = useState<jobRoleType[]>([]);

  const formVacancy = useForm<z.infer<typeof formVacancySchema>>({
    resolver: zodResolver(formVacancySchema),
    defaultValues: {
      batch: '',
      role: '',
      skills: [
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
      roleTitle: data?.title || '',
      roleDescription: data?.description || '',
    },
  });

  const onSubmitVacancy = async (values: z.infer<typeof formVacancySchema>) => {
    let toastMessage = '';
    console.log(values);
    try {
      if (action === 'Add') {
        await addVacancySubmit(values);
      }
      if (action === 'Edit') {
        await updateVacancySubmit({ id: data.id, ...values });
      }

      toastMessage = `${action} ${target} Success`;
      showToast(toastMessage, SUCCESS_TOAST);
    } catch (error) {
      if (error instanceof InvariantError) {
        toastMessage = error.message;
      } else {
        toastMessage = `${action} ${target} failed`;
      }
      showToast(toastMessage, DANGER_TOAST);
    } finally {
      onOpenChange(false);
    }
  };

  const onSubmitBatch = async (values: z.infer<typeof formBatchSchema>) => {
    let toastMessage = '';
    try {
      if (action === 'Add') {
        await addBatchSubmit(values);
      }
      if (action === 'Edit') {
        await updateBatchSubmit({ batchId: data.batchId, ...values });
      }

      toastMessage = `${action} ${target} Success`;
      showToast(toastMessage, SUCCESS_TOAST);
    } catch (error) {
      if (error instanceof InvariantError) {
        toastMessage = error.message;
      } else {
        toastMessage = `${action} ${target} failed`;
      }
      showToast(toastMessage, DANGER_TOAST);
    } finally {
      onOpenChange(false);
    }
  };

  const onSubmitRole = async (values: z.infer<typeof formRoleSchema>) => {
    let toastMessage = '';
    try {
      if (target === 'Role') {
        if (action === 'Add') {
          await addRoleSubmit({
            title: values.roleTitle,
            description: values.roleDescription,
          });
        } else if (action === 'Edit') {
          await updateRoleSubmit({
            id: data?.id,
            title: values.roleTitle,
            description: values.roleDescription,
          });
        }
      }

      toastMessage = `${action} ${target} Success`;
      showToast(toastMessage, SUCCESS_TOAST);
    } catch (error) {
      if (error instanceof InvariantError) {
        toastMessage = error.message;
      } else {
        toastMessage = `${action} ${target} failed`;
      }
      showToast(toastMessage, DANGER_TOAST);
    } finally {
      onOpenChange(false);
    }
  };

  useEffect(() => {
    const getBatchData = async () => {
      if (target === 'Vacancy') {
        const batchData = await _Fetch('/intern/batch', 'GET');
        const roleData = await _Fetch('/intern/role', 'GET');
        setBatchData(batchData.batches);
        setRoleData(roleData.roles);
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
    }
  }, [open, formVacancy]);

  const selectedBatch = formVacancy.watch('batch');
  const selectedRole = formVacancy.watch('role');
  const { control } = formVacancy;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills', // This must match schema field
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
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Batch</FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline'>
                            {selectedBatch || 'Choose Batch'}
                          </Button>
                        </DropdownMenuTrigger>
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
                                      batch.batchName,
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
                      </DropdownMenu>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formVacancy.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Role</FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline'>
                            {selectedRole || 'Choose Role'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Role</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <FormControl>
                            <DropdownMenuRadioGroup>
                              {roleData.map(role => (
                                <DropdownMenuItem
                                  key={role.id}
                                  onClick={() =>
                                    formVacancy.setValue('role', role.title, {
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
                            <Input placeholder='Type skill' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remove button */}
                    <Button
                      type='button'
                      onClick={() => remove(index)}
                      className='place-self-end'
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                {/* Add new skill */}
                <Button
                  type='button'
                  onClick={() => append({ priority: 0, skillName: '' })}
                >
                  Add Skill
                </Button>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant='outline' type='button'>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type='submit'>Save changes</Button>
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
                        <Input
                          placeholder={
                            action === 'Edit' ? data.title : 'Type Role Title'
                          }
                          {...field}
                        />
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
                          placeholder={
                            action === 'Edit'
                              ? data.description
                              : 'Type Role Description'
                          }
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
                    <Button variant='outline' type='button'>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type='submit'>Save changes</Button>
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
                  <Button variant='outline' type='button'>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type='submit'>Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

const addRoleSubmit = async ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  try {
    const req = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/intern/role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    });
    const res = await req.json();
    if (req.status === 400) {
      throw new InvariantError(res.message);
    }
  } catch (error) {
    throw error;
  }
};
const updateRoleSubmit = async ({ id, title, description }: jobRoleType) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/intern/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        title,
        description,
      }),
    });
  } catch (error) {
    throw error;
  }
};
const addBatchSubmit = async (payload: any) => {
  try {
    const req = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/intern/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const res = await req.json();
    if (req.status === 400) {
      throw new InvariantError(res.message);
    }
  } catch (error) {
    throw error;
  }
};
const updateBatchSubmit = async (payload: any) => {
  try {
    await _Fetch('/intern/batch', 'PUT', payload);
  } catch (error) {
    throw error;
  }
};

const addVacancySubmit = async (payload: any) => {
  try {
    await _Fetch('/intern/vacancy', 'POST', payload);
  } catch (error) {
    throw error;
  }
};

const updateVacancySubmit = async (payload: any) => {
  try {
    await _Fetch('/intern/vacancy', 'PUT', payload);
  } catch (error) {
    throw error;
  }
};

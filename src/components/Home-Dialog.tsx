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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { showToast, DANGER_TOAST } from '@/components/Toast';
import InvariantError from '@/exceptions/InvariantError';
import { DialogValueTypes } from '@/types/DialogTypes';
import { formTeamInviteSchema } from '@/constant/schemas.items';
import { useMutation } from '@/hooks/useQuery.hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useEffect } from 'react';

type DialogProps = DialogValueTypes & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function HomeDialogPopUp({
  open,
  onOpenChange,
  target,
  action,
}: DialogProps) {
  const dataUser = useSelector((state: RootState) => state.team.teamData);

  const formTeamInvite = useForm<z.infer<typeof formTeamInviteSchema>>({
    resolver: zodResolver(formTeamInviteSchema),
    defaultValues: {
      email: '',
      role: '',
      verified: false,
    },
  });

  useEffect(() => {
    if (action == 'Edit') {
      if (dataUser) {
        formTeamInvite.reset({
          email: dataUser.email || '',
          role: dataUser.role || '',
          verified: dataUser.verified || false,
        });
      }
    } else if (action === 'Add') {
      formTeamInvite.reset({
        email: '',
        role: '',
        verified: false,
      });
    }
  }, [dataUser, action, open]);

  const inviteTeamMutate = useMutation({
    path: '/user',
    method: 'POST',
    queryKey: ['users'],
    successMessage: 'Invite Team Success',
    errorMessage: 'Invite Team Failed',
  });
  const updateTeamMutate = useMutation({
    path: `/user?id=${dataUser?.id}`,
    method: 'PUT',
    queryKey: ['users'],
    successMessage: 'Update Team Success',
    errorMessage: 'Update Team Failed',
  });
  const selectedRole = formTeamInvite.watch('role');
  const verifiedState = formTeamInvite.watch('verified');

  const onSubmitVacancy = async (
    values: z.infer<typeof formTeamInviteSchema>,
  ) => {
    try {
      if (action === 'Add') {
        inviteTeamMutate.mutate({
          email: values.email,
          role: values.role,
          verified: true,
        });
      } else {
        updateTeamMutate.mutate({
          role: values.role,
          verified: values.verified,
        });
      }
    } catch (error) {
      if (error instanceof InvariantError) {
        showToast(error.message, DANGER_TOAST);
      }
    } finally {
      onOpenChange(false);
    }
  };

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

        <div className='grid gap-4'>
          <Form {...formTeamInvite}>
            <form
              onSubmit={formTeamInvite.handleSubmit(onSubmitVacancy)}
              className='space-y-8'
            >
              <FormField
                control={formTeamInvite.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Email</FormLabel>
                    <Input
                      placeholder='Type Email to Invite'
                      disabled={action === 'Edit'}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formTeamInvite.control}
                name='role'
                render={() => (
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
                            <DropdownMenuItem
                              onClick={() =>
                                formTeamInvite.setValue('role', 'Admin', {
                                  shouldValidate: true,
                                })
                              }
                            >
                              Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                formTeamInvite.setValue('role', 'Judge', {
                                  shouldValidate: true,
                                })
                              }
                            >
                              Judge
                            </DropdownMenuItem>
                          </DropdownMenuRadioGroup>
                        </FormControl>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {action === 'Edit' && (
                <FormField
                  control={formTeamInvite.control}
                  name='verified'
                  render={() => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Status</FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline'>
                            {`${verifiedState && verifiedState === true ? 'Verified' : 'Not Verified'}` ||
                              'Verified?'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <FormControl>
                            <DropdownMenuRadioGroup>
                              <DropdownMenuItem
                                onClick={() =>
                                  formTeamInvite.setValue('verified', true, {
                                    shouldValidate: true,
                                  })
                                }
                              >
                                Verified
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  formTeamInvite.setValue('verified', false, {
                                    shouldValidate: true,
                                  })
                                }
                              >
                                Not Verified
                              </DropdownMenuItem>
                            </DropdownMenuRadioGroup>
                          </FormControl>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
      </DialogContent>
    </Dialog>
  );
}

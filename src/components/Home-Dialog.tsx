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
import { showToast, SUCCESS_TOAST, DANGER_TOAST } from '@/components/Toast';
import InvariantError from '@/exceptions/InvariantError';
import { DialogValueTypes } from '@/types/DialogTypes';
import { formTeamInviteSchema } from '@/constant/schemas.items';
import { useMutation } from '@/hooks/useQuery.hooks';

type DialogProps = DialogValueTypes & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState?: {
    data?: any;
  };
};

export default function HomeDialogPopUp({
  open,
  onOpenChange,
  target,
  action,
  // formState,
}: DialogProps) {
  // const { data } = formState;

  const formTeamInvite = useForm<z.infer<typeof formTeamInviteSchema>>({
    resolver: zodResolver(formTeamInviteSchema),
    defaultValues: {
      email: '',
      role: '',
    },
  });

  const inviteTeamMutate = useMutation({
    path: '/user',
    method: 'POST',
    queryKey: ['users'],
  });
  const selectedRole = formTeamInvite.watch('role');

  const onSubmitVacancy = async (
    values: z.infer<typeof formTeamInviteSchema>,
  ) => {
    const toast = { message: '', type: DANGER_TOAST };

    try {
      console.log(values);
      inviteTeamMutate.mutate({
        email: values.email,
        role: values.role,
        verified: true,
      });
      toast.message = `${action} ${target} Success`;
      toast.type = SUCCESS_TOAST;
    } catch (error) {
      if (error instanceof InvariantError) {
        toast.message = error.message;
      } else {
        toast.message = `${action} ${target} failed`;
      }
    } finally {
      showToast(toast.message, toast.type);
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

        {/* --------------------------- VACANCY --------------------------- */}
        {action === 'Add' && (
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
                      <Input placeholder='Type Email to Invite' {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formTeamInvite.control}
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
      </DialogContent>
    </Dialog>
  );
}

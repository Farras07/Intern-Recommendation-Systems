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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formShortlistCandidates } from '@/constant/schemas.items';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import Typography from '@/components/Typography';
import InvariantError from '@/exceptions/InvariantError';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useQuery, useMutation } from '@/hooks/useQuery.hooks';
import { useSession } from 'next-auth/react';
import Calendar from '@/components/App-Calendar';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ShortlistDialog({ open, onOpenChange }: DialogProps) {
  const { data: session } = useSession();
  const recommendation = useSelector(
    (state: RootState) => state.shortlist.data,
  );

  const { data: judges, isLoading } = useQuery({
    path: '/user?role=Judge',
    queryKey: ['judge'],
  });

  const { mutate } = useMutation({
    path: '/recommendation',
    queryKey: ['registrationData'],
    method: 'POST',
  });

  const dialogContent = {
    main: {
      title: 'Shortlist Candidates',
      description: 'You can shortlist candidate right here',
    },
  };
  const now = new Date();

  const formShortlist = useForm<z.infer<typeof formShortlistCandidates>>({
    resolver: zodResolver(formShortlistCandidates),
    defaultValues: {
      candidateAmount: 0,
      interviewDate: now,
      interviewStartTime: '00:00',
      durationTime: 0,
      interviewer: [{ role: '', judgesEmail: [] }],
    },
  });

  const { fields } = useFieldArray({
    control: formShortlist.control,
    name: 'interviewer',
  });

  useEffect(() => {
    if (recommendation?.recommendation) {
      formShortlist.reset({
        candidateAmount: 0,
        interviewDate: now,
        interviewStartTime: '00:00',
        durationTime: 0,
        interviewer: recommendation.recommendation.map((rec: any) => ({
          role: rec.role,
          judgesEmail: [],
        })),
      });
    }
  }, [recommendation]);

  const onSubmitShortlist = async (values: z.infer<typeof formShortlist>) => {
    const toastMessage = '';
    try {
      mutate({
        session: {
          accessToken: session?.token.accessToken,
          name: session?.user.name,
          email: session?.user.email,
        },
        values,
        candidates: recommendation,
      });
    } catch (error) {
      console.log(error);
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{dialogContent.main.title}</DialogTitle>
          <DialogDescription>
            <Typography as='span' variant='c2' color='lightgray'>
              {dialogContent.main.description}
            </Typography>
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[45vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100'>
          <Form {...formShortlist}>
            <form
              onSubmit={formShortlist.handleSubmit(onSubmitShortlist)}
              className='space-y-8'
            >
              <FormField
                control={formShortlist.control}
                name='candidateAmount'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-[40%]'>
                    <FormLabel>Candidates Amount</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formShortlist.control}
                name='interviewDate'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Calendar
                        timeType='Start'
                        dateField={field}
                        timeField={formShortlist.register('interviewStartTime')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formShortlist.control}
                name='durationTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Interview Per Candidate</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='outline'
                            className='w-full justify-between'
                          >
                            {field.value
                              ? `${field.value} Minutes`
                              : 'Pick Duration'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-[250px]'>
                          <DropdownMenuLabel>Select Duration</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={String(field.value)}
                            onValueChange={value =>
                              field.onChange(Number(value))
                            }
                          >
                            <DropdownMenuRadioItem value='10'>
                              10 Minutes
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value='15'>
                              15 Minutes
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.map((field, index) => (
                <div key={field.id} className='border p-4 rounded-lg space-y-4'>
                  <Typography as='h3' variant='c2' className='font-semibold'>
                    {formShortlist.watch(`interviewer.${index}.role`) ||
                      `Role #${index + 1}`}
                  </Typography>

                  <FormField
                    control={formShortlist.control}
                    name={`interviewer.${index}.judgesEmail`}
                    render={({ field }) => {
                      const selected = field.value || [];
                      return (
                        <FormItem>
                          <FormLabel>Judges</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant='outline'
                                  className='w-full justify-between'
                                >
                                  {selected.length > 0
                                    ? `${selected.length} selected`
                                    : 'Select judges'}
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent className='w-[250px]'>
                                <DropdownMenuLabel>
                                  Select Judges
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {judges.map(judge => (
                                  <DropdownMenuCheckboxItem
                                    key={judge.id}
                                    checked={selected.includes(judge.email)}
                                    onCheckedChange={checked => {
                                      const newSelection = checked
                                        ? [...selected, judge.email]
                                        : selected.filter(
                                            e => e !== judge.email,
                                          );
                                      field.onChange(newSelection);
                                    }}
                                  >
                                    {judge.email}
                                  </DropdownMenuCheckboxItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              ))}
              <div className='flex justify-end px-4 gap-4'>
                <Button
                  onClick={() => onOpenChange(false)}
                  className='cursor-pointer'
                >
                  Cancel
                </Button>
                <Button type='submit' className='cursor-pointer'>
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

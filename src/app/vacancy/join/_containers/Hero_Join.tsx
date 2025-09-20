'use client';

import Typography from '@/components/Typography';
import Herotext from '@/components/ui/Hero_Text';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
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
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formVacancyFilterSchema } from '@/constant/schemas.items';
import { Button } from '@/components/ui/button';

export default function Hero_Join() {
  const formVacancyFilter = useForm<z.infer<typeof formVacancyFilterSchema>>({
    resolver: zodResolver(formVacancyFilterSchema),
    defaultValues: {
      role: '',
      batch: '',
    },
  });

  const onSubmitFilter = async (
    values: z.infer<typeof formVacancyFilterSchema>,
  ) => {
    console.log(values);
  };

  return (
    <section className='flex flex-col items-center px-4 pt-28 xl:pt-36'>
      <Badge variant='marker' className='flex gap-2 items-center'>
        <Image src='/icons/marker.svg' width={22} height={22} alt='Benefit' />
        <Typography variant='p' font='poppins' weight='semibold'>
          Vacancy
        </Typography>
      </Badge>

      <Herotext
        text={'Current Intern Vacancy At Fleek Creative'}
        className='xl:text-center'
      />
      <Typography
        variant='p'
        color='lightgray'
        className='text-justify md:text-center'
      >
        From professional growth opportunities to work life balance, our
        benefits are designed to help you thrive
      </Typography>

      <Form {...formVacancyFilter}>
        <form
          onSubmit={formVacancyFilter.handleSubmit(onSubmitFilter)}
          className='flex flex-col gap-10'
        >
          <div className='flex gap-5 mt-6'>
            <FormField
              control={formVacancyFilter.control}
              name='role'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline'>
                        {field.value || 'Choose Role'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Role</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <FormControl>
                        <DropdownMenuRadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <DropdownMenuRadioItem value='social'>
                            Social Media Specialist
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value='ops'>
                            Operational
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </FormControl>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formVacancyFilter.control}
              name='batch'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline'>Choose Batch</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Batch</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <FormControl>
                        <DropdownMenuRadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <DropdownMenuRadioItem value='social'>
                            Social Media Specialist
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value='ops'>
                            Operational
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </FormControl>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit'>Filter</Button>
        </form>
      </Form>
    </section>
  );
}

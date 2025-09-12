'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type CalendarPropsType = {
  timeType: 'Start' | 'Deadline';
  dateField: any;
  timeField: any;
};

export default function AppCalendar({
  timeType,
  dateField,
  timeField,
}: CalendarPropsType) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className='flex gap-4'>
      {/* Date Picker */}
      <div className='flex flex-col gap-3'>
        <Label htmlFor={`${timeType}-date`} className='px-1'>
          {timeType} Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              id={`${timeType}-date`}
              className='w-32 justify-between font-normal'
            >
              {dateField.value
                ? dateField.value.toLocaleDateString()
                : 'Select date'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
            <Calendar
              mode='single'
              selected={dateField.value}
              captionLayout='dropdown'
              onSelect={date => {
                dateField.onChange(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div className='flex flex-col gap-3'>
        <Label htmlFor={`${timeType}-time`} className='px-1'>
          {timeType} Time
        </Label>
        <Input
          type='time'
          id={`${timeType}-time`}
          step='60'
          {...timeField} // bind to RHF
          className='bg-background w-[4rem] flex justify-center appearance-none [&::-webkit-calendar-picker-indicator]:hidden'
        />
      </div>
    </div>
  );
}

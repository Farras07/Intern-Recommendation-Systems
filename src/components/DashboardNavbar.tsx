import Typography from './Typography';
import Image from 'next/image';
import { Bell } from 'lucide-react';

export default function DashboardNavbar({
  username,
}: {
  username?: string | null;
}) {
  return (
    <section className='col-span-full row-start-1 rows-span-1 h-[10vh] bg-white shadow-md rounded-lg py-4 px-5 flex justify-between'>
      <div className='flex flex-col justify-center'>
        <Typography variant='p' weight='bold'>
          Hello, {username}!
        </Typography>
        <Typography variant='c2' weight='regular'>
          One for manage everything
        </Typography>
      </div>
      <div className='px-2 flex gap-4'>
        <div className='rounded-[24px] bg-sky flex items-center gap-3 px-3 py-1 shadow-md'>
          <Typography variant='c2' weight='semibold' color='white'>
            1 Jul 05
          </Typography>
          <div className='rounded-full bg-white p-2 border-1 border-black'>
            <Image
              src={'/icons/calendar.svg'}
              width={18}
              height={18}
              alt='calendar'
            />
          </div>
        </div>
        <button className='relative flex items-center justify-center p-2 hover:bg-light-gray/[10%] hover:shadow-md cursor-pointer rounded-lg'>
          {/* Bell icon in a circle */}
          <div className='rounded-full bg-white p-2 border border-black shadow-md'>
            <Bell fill='black' strokeWidth={3} size={24} />
          </div>

          {/* Notification badge */}
          <span className='relative -top-4 rounded-full bg-white border border-black w-4 h-4 flex items-center justify-center text-[0.6rem] font-bold'>
            2
          </span>
        </button>
      </div>
    </section>
  );
}

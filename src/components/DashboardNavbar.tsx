import Typography from './Typography';
import Image from 'next/image';

export default function DashboardNavbar({
  username,
}: {
  username?: string | null;
}) {
  const currentTime = new Date();
  const date = currentTime.getDate();
  const month = currentTime.toLocaleString('en-US', { month: 'short' });
  const year = currentTime.getFullYear().toString().slice(-2);
  const formmatedDate = `${date} ${month} ${year}`;

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
            {formmatedDate}
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
      </div>
    </section>
  );
}

import Typography from '@/components/Typography';
import Herocard from '../_components/Hero_Card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function Positions() {
  return (
    <section className='w-full px-3 xl:px-container py-20 grid gap-20'>
      <div
        id='marker'
        className='flex flex-col text-center items-center gap-2 px-4 xl:px-0'
      >
        <Badge variant='marker' className='flex gap-2 items-center'>
          <Image
            src='/icons/marker.svg'
            width={22}
            height={22}
            alt='Positions'
          />
          <Typography variant='p' font='poppins' weight='semibold'>
            Positions
          </Typography>
        </Badge>
        <Typography variant='h5' color='blue-sky' weight='bold'>
          Intern Positions
        </Typography>
      </div>

      <div className='grid grid-cols-1 px-2 xl:grid-cols-2 gap-16'>
        <div className='flex justify-center'>
          <Herocard />
        </div>
        <div className='flex flex-col justify-center gap-6'>
          <Typography
            variant='h5'
            weight='semibold'
            color='dark'
            className='text-center xl:text-start'
          >
            Videography
          </Typography>
          <Typography
            variant='p'
            weight='medium'
            className='text-justify md:text-center xl:text-start'
          >
            Start your career journey by join our internship programs. Discover
            your true potential right now!
          </Typography>
        </div>
      </div>
    </section>
  );
}

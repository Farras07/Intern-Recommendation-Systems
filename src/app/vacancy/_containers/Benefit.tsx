import Typography from '@/components/Typography';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function Benefit() {
  return (
    <section className='grid grid-rows-4 gap-72 md:gap-52 xl:gap-32 w-screen max-h-[70vh] xl:px-container pt-28 xl:pt-container'>
      <div
        id='marker'
        className='col-rows flex flex-col text-center items-center gap-2 px-4 xl:px-0'
      >
        <Badge variant='marker' className='flex gap-2 items-center'>
          <Image src='/icons/marker.svg' width={22} height={22} alt='Benefit' />
          <Typography variant='p' font='poppins' weight='semibold'>
            Benefit
          </Typography>
        </Badge>
        <div>
          <Typography variant='h5' color='blue-sky' weight='bold'>
            Why you should do intern at Fleek Creative?
          </Typography>
          <Typography variant='p' weight='regular'>
            From professional growth opportunities to work life balance, our
            benefits are designed to help you thrive
          </Typography>
        </div>
      </div>
      <div className='row-span-3 grid grid-cols-3 gap-5'>
        <div className='col-span-full xl:col-span-1 flex justify-center'>
          <Badge variant='card' size='card:lg' className='flex flex-col gap-2 '>
            <Image
              src='/icons/mentoring.svg'
              width={60}
              height={60}
              alt='Benefit'
            />
            <Typography variant='p' font='poppins' weight='semibold'>
              Mentoring
            </Typography>
            <Typography
              variant='c1'
              font='poppins'
              weight='regular'
              className='max-w-full break-words whitespace-normal text-center'
            >
              Mentoring to get career advised from professional and try to
              innovate
            </Typography>
          </Badge>
        </div>
        <div className='col-span-full xl:col-span-1 flex justify-center'>
          <Badge variant='card' size='card:lg' className='flex flex-col gap-2 '>
            <Image
              src='/icons/collab.svg'
              width={60}
              height={60}
              alt='Benefit'
            />
            <Typography variant='p' font='poppins' weight='semibold'>
              Collaborative Culture
            </Typography>
            <Typography
              variant='c1'
              font='poppins'
              weight='regular'
              className='max-w-full break-words whitespace-normal text-center'
            >
              Be a part of supportive and dynamic team that values creativivity,
              growth and teamwork
            </Typography>
          </Badge>
        </div>
        <div className='col-span-full xl:col-span-1 flex justify-center'>
          <Badge variant='card' size='card:lg' className='flex flex-col gap-2 '>
            <Image
              src='/icons/chart.svg'
              width={60}
              height={60}
              alt='Benefit'
            />
            <Typography variant='p' font='poppins' weight='semibold'>
              Opportunity To Be Our Team
            </Typography>
            <Typography
              variant='c1'
              font='poppins'
              weight='regular'
              className='max-w-full break-words whitespace-normal text-center'
            >
              Be a part of supportive and dynamic team that values creativivity,
              growth and teamwork
            </Typography>
          </Badge>
        </div>
      </div>
    </section>
  );
}

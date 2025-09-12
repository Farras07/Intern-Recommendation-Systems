import Typography from '@/components/Typography';
import Herotext from '@/components/ui/Hero_Text';
import Herocard from '../_components/Hero_Card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function Positions() {
  return (
    // <section className="grid grid-cols-2 grid-flow-col xl:grid-flow-row bg-gradient_azure_white w-screen xl:h-screen xl:px-container pt-md gap-10 xl:gap-5">
    //      <div className="flex justify-center col-span-full xl:col-span-1">
    //         <Herocard/>
    //     </div>
    //     <div className="col-span-full xl:col-span-1">
    //         <Herotext variant={'h3'} text={'Gain Working Field Experience With Us!'}/>
    //         <Typography variant="p" weight="medium" className="px-3 text-center xl:text-start xl:px-container">Start your career journey by join our internship
    //                     programs. Discover your true potential right now!
    //         </Typography>
    //     </div>
    // </section>
    <section className='grid grid-rows-4 gap-28 md:gap-52 xl:gap-32 w-screen h-screen mt-96 xl:px-container pt-60 md:pt-48 xl:pt-container'>
      <div
        id='marker'
        className='col-rows flex flex-col text-center items-center gap-2 px-4 xl:px-0'
      >
        <Badge variant='marker' className='flex gap-2 items-center'>
          <Image src='/icons/marker.svg' width={22} height={22} alt='Benefit' />
          <Typography variant='p' font='poppins' weight='semibold'>
            Positions
          </Typography>
        </Badge>
        <div>
          <Typography variant='h5' color='blue-sky' weight='bold'>
            Intern Positions
          </Typography>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-16 xl:gap-0 grid-flow-col xl:grid-flow-row'>
        <div className='flex justify-center col-span-full xl:col-span-1'>
          <Herocard />
        </div>
        <div className='col-span-full xl:col-span-1 flex flex-col justify-center xl:gap-10 '>
          <Typography
            variant='h4'
            weight='semibold'
            color='dark'
            className='text-center xl:text-start'
          >
            Videography
          </Typography>
          <Typography
            variant='p'
            weight='medium'
            className='text-justify xl:text-start mt-10 xl:mt-0'
          >
            Start your career journey by join our internship programs. Discover
            your true potential right now!
          </Typography>
        </div>
      </div>
    </section>
  );
}

import Typography from '@/components/Typography';
import Herotext from '@/components/ui/Hero_Text';
import Herocard from '../_components/Hero_Card';
export default function Hero() {
  return (
    <section className='grid grid-cols-2 grid-flow-col xl:grid-flow-row bg-gradient_azure_white w-screen xl:h-screen xl:px-container pt-md gap-10 xl:gap-5'>
      <div className='col-span-full xl:col-span-1'>
        <Herotext
          variant={'h3'}
          text={'Gain Working Field Experience With Us!'}
        />
        <Typography
          variant='p'
          weight='medium'
          className='px-3 text-center xl:text-start xl:px-container'
        >
          Start your career journey by join our internship programs. Discover
          your true potential right now!
        </Typography>
      </div>
      <div className='flex justify-center col-span-full xl:col-span-1'>
        <Herocard />
      </div>
    </section>
  );
}

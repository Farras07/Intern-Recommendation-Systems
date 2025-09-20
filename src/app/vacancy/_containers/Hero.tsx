import Typography from '@/components/Typography';
import Herotext from '@/components/ui/Hero_Text';
import Herocard from '../_components/Hero_Card';

export default function Hero() {
  return (
    <section className='grid gap-10 px-3 md:px-10 xl:gap-5 grid-cols-1 xl:grid-cols-2 bg-gradient_azure_white w-full xl:px-container py-24'>
      <div>
        <Herotext variant='h3' text='Gain Working Field Experience With Us!' />
        <Typography
          variant='p'
          weight='medium'
          className='text-justify md:text-center xl:text-start xl:px-container mt-4'
        >
          Start your career journey by join our internship programs. Discover
          your true potential right now!
        </Typography>
      </div>
      <div className='flex justify-center px-2 xl:px-0 xl:items-end'>
        <Herocard />
      </div>
    </section>
  );
}

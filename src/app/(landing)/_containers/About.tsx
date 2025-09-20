import Image from 'next/image';
import Typography from '@/components/Typography';

export default function About() {
  return (
    <section
      id={'about'}
      className='w-full flex flex-col-reverse mt-26 md:mt-0 px-4 xl:gap-10 xl:flex-row xl:px-container'
    >
      <div className='w-full h-[80vh] xl:w-[43%] xl:h-[36rem] flex justify-center items-center xl:justify-start '>
        <Image
          src={'/landing/about.svg'}
          width={700}
          height={700}
          alt='about'
        />
      </div>
      <div className='w-full h-[80vh] xl:w-[57%] xl:h-[36rem] flex flex-col justify-center'>
        <Typography
          variant='h5'
          weight='bold'
          font='poppins'
          color='blue-sky'
          className='text-3xl xl:text-h5'
        >
          ABOUT FLEEK CREATIVE
        </Typography>
        <Typography
          variant='h4'
          weight='bold'
          font='poppins'
          color='dark'
          className='text-4xl xl:text-h4'
        >
          Make Your Brand Stand Out
        </Typography>
        <Typography
          variant='p'
          weight='regular'
          font='poppins'
          color='dark'
          className='mt-6 text-justify'
        >
          At our core, we help you make a lasting impact that resonates with
          your audience. Whether you&apos;re launching a new venture or evolving
          an existing one, we craft digital experiences that leave a mark. In a
          rapidly shifting landscape, we empower you to grow strong — not just
          to survive, but to lead. With shmart strategy, bold creativity, and
          the right technology, we position your brand to thrive in today&apos;s
          digital world.
        </Typography>
      </div>
    </section>
  );
}

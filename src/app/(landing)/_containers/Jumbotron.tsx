import Image from 'next/image';
import Typography from '@/components/Typography';
import Herotext from '@/components/ui/Hero_Text';

export default function Jumbotron() {
  return (
    <section
      id='jumbotron'
      className='w-full bg-ghost-white flex flex-col gap-16 xl:flex-row xl:px-container pt-32 pb-16'
    >
      {/* ========== Left Side ========== */}
      <div className='flex flex-col justify-center w-full px-1 md:px-5  xl:w-[57%]'>
        <Herotext text='Empower Your Digital Strategies With Us' />
        <div className='mt-3 xl:pl-container'>
          <Typography
            variant='p'
            weight='medium'
            font='poppins'
            className='w-full xl:w-[30rem] text-center xl:text-left'
          >
            Transform your digital presence with cutting-edge design and
            development solutions that drive real results.
          </Typography>
        </div>
      </div>

      {/* ========== Right Side ========== */}
      <div className='w-full xl:w-[43%] flex justify-center items-center'>
        <Image
          src='/landing/jumbotron.svg'
          width={800}
          height={800}
          alt='jumbotron'
          className='max-w-full h-auto'
        />
      </div>
    </section>
  );
}

import Image from 'next/image';
import Typography from '@/components/Typography';
import Herotext from '@/components/ui/Hero_Text';
export default function Jumbotron() {
  return (
    <>
      <section
        id={'jumbotron'}
        className='xl:h-screen w-screen bg-ghost-white flex flex-col xl:flex-row xl:px-container pt-32'
      >
        {/* =========================================== Left Side =========================================== */}
        <div className='flex flex-col justify-center xl:justify-start w-screen h-[60vh] px-2 xl:w-[57%] xl:h-[36rem]'>
          <Herotext text={'Empower Your Digital Strategies With Us'} />
          <div className='mt-3 xl:pl-container'>
            <Typography
              variant='p'
              weight='medium'
              font='poppins'
              className='w-screen xl:w-[30rem] text-center pr-4'
            >
              Transform your digital presence with cutting-edge design and
              development solutions that drive real results.
            </Typography>
          </div>
        </div>

        {/* =========================================== Right Side =========================================== */}

        <div className='w-screen xl:w-[43%] h-[60vh] md:h-screen xl:h-[36rem] flex justify-center xl:justify-around xl:items-center px-1 xl:px-7 py-10'>
          <Image
            src={'landing/jumbotron.svg'}
            width={800}
            height={800}
            alt='jumbotron'
          />
        </div>
      </section>
    </>
  );
}

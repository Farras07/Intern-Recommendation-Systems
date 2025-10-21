import Image from 'next/image';
import { Button } from '@/components/ui/button';
export default function Hero_Card() {
  return (
    <div className='relative w-fit mx-auto z-10'>
      <Image
        src={'landing/card-image.svg'}
        width={320}
        height={320}
        alt='Fleek Creative'
        className='rounded-[56px] shadow-lg ring-7 ring-gray-400'
      />
      <Button
        size={'xxl'}
        variant={'hero-card'}
        className='absolute bottom-10 xl:bottom-12 left-1/2 -translate-x-1/2 cursor-pointer'
      >
        <a
          href='/vacancy/join'
          className='w-full h-full flex justify-center items-center'
        >
          Join Now!
        </a>
      </Button>
    </div>
  );
}

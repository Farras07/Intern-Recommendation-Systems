import Typography from '@/components/Typography';
import Image from 'next/image';
export default function Warning({
  message = 'You Are not Allowed To Access This Page! You Need to Login First',
}: {
  message?: string;
}) {
  return (
    <section className='h-screen w-screen flex flex-col gap-10 items-center justify-center text-center'>
      <Image
        src={'/icons/warning.svg'}
        width={500}
        height={500}
        alt={'Warning'}
      />
      <Typography variant='h5' color='lightgray' className=''>
        {message}
      </Typography>
    </section>
  );
}

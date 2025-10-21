import Typography from '@/components/Typography';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function Benefit() {
  return (
    <section className='w-full xl:px-container py-20 grid gap-20'>
      <div
        id='marker'
        className='flex flex-col text-center items-center gap-2 px-4 xl:px-0'
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
          <Typography variant='p' weight='regular' className='text-justify'>
            From professional growth opportunities to work life balance, our
            benefits are designed to help you thrive
          </Typography>
        </div>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-10'>
        {[
          {
            icon: '/icons/mentoring.svg',
            title: 'Mentoring',
            text: 'Mentoring to get career advised from professional and try to innovate',
          },
          {
            icon: '/icons/collab.svg',
            title: 'Collaborative Culture',
            text: 'Be a part of supportive and dynamic team that values creativity, growth and teamwork',
          },
          {
            icon: '/icons/chart.svg',
            title: 'Opportunity To Be Our Team',
            text: 'Be a part of supportive and dynamic team that values creativity, growth and teamwork',
          },
        ].map((b, i) => (
          <div key={i} className='flex justify-center'>
            <Badge
              variant='card'
              size='card:lg'
              className='flex flex-col gap-2'
            >
              <Image src={b.icon} width={60} height={60} alt={b.title} />
              <Typography variant='p' font='poppins' weight='semibold'>
                {b.title}
              </Typography>
              <div className='w-[90%] break-words whitespace-normal text-center'>
                <Typography variant='c1' font='poppins' weight='regular'>
                  {b.text}
                </Typography>
              </div>
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}

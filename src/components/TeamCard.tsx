'use client';
import Typography from './Typography';
import Image from 'next/image';
import { role } from '@/types/UserTypes';
import { User2 } from 'lucide-react';
type TeamCardProps = {
  name: string;
  image: string;
  role: keyof typeof role;
  email: string;
};

export default function TeamCard(props: TeamCardProps) {
  const { name, image, role, email } = props;
  console.log(props);

  return (
    <section
      id={email}
      className='px-4 py-2 flex items-center gap-3 bg-white hover:bg-light-gray/[2%] shadow-md rounded-lg cursor-pointer'
    >
      <figure className='rounded-full bg-gray/30 h-10 w-10 overflow-hidden flex justify-center items-center'>
        {image ? (
          <Image
            src={image}
            width={100}
            height={100}
            alt={`${name}'s profile picture`}
            className='rounded-full'
          />
        ) : (
          <User2 size={30} />
        )}
      </figure>

      <figcaption>
        <Typography variant='c1' weight='semibold'>
          {email}
        </Typography>
        <Typography variant='c1' weight='regular'>
          {role}
        </Typography>
      </figcaption>
    </section>
  );
}

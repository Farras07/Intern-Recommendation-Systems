import React from 'react';
import Typography, {
  TypographyVariant,
  FontVariant,
  FontWeight,
} from '../Typography';
import Image from 'next/image';

type HeroTextProps = {
  variant?: keyof typeof TypographyVariant;
  font?: keyof typeof FontVariant;
  weight?: keyof typeof FontWeight;
  text: String;
};

const Hero_Text: React.FC<HeroTextProps> = ({
  variant = 'h2',
  font = 'poppins',
  weight = 'semibold',
  text,
}) => {
  return (
    <div className='flex flex-col text-center xl:text-start gap-[-4rem]'>
      <Image
        className='relative z-10 items-baseline'
        src={'landing/waterSplash.svg'}
        width={80}
        height={80}
        alt='splash'
      />
      <Typography
        variant={variant}
        weight={weight}
        font={font}
        className='text-5xl md:text-6xl xl:text-[72px] leading-14 md:leading-16 xl:leading-[90px] xl:px-4 xl:pl-container -translate-y-3 xl:-translate-y-6'
      >
        {text}
      </Typography>
    </div>
  );
};

export default Hero_Text;

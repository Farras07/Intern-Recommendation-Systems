import * as React from 'react';

import { cn } from '@/lib/utils';

export enum TypographyVariant {
  'c1',
  'c2',
  'btn',
  'bt',
  'p',
  't',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
}

export enum TypographyColor {
  'white',
  'dark',
  'blue-sky',
}

export enum FontVariant {
  'poppins',
  'teko',
  'inter',
}

export enum FontWeight {
  'regular',
  'medium',
  'semibold',
  'bold',
}

type TypographyProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  weight?: keyof typeof FontWeight;
  color?: keyof typeof TypographyColor;
  font?: keyof typeof FontVariant;
  variant?: keyof typeof TypographyVariant;
  children: React.ReactNode;
};

export default function Typography<T extends React.ElementType>({
  as,
  children,
  weight = 'regular',
  className,
  color = 'dark',
  font = 'poppins',
  variant = 'p',
  ...props
}: TypographyProps<T> &
  Omit<React.ComponentProps<T>, keyof TypographyProps<T>>) {
  const Component = as || 'p';

  return (
    <Component
      className={cn(
        // *=============== FONT ==================
        font === 'poppins' && 'font-poppins',
        font === 'teko' && 'font-teko',
        font === 'inter' && 'font-inter',

        // *=============== FONT-WEIGHT ==================
        weight === 'regular' && 'font-normal',
        weight === 'medium' && 'font-medium',
        weight === 'semibold' && 'font-semibold',
        weight === 'bold' && 'font-bold',

        // *=============== VARIANT-TAG ==================
        variant === 'c1' && 'text-[12px] leading-[24px]', // Fixed: Added missing opening bracket
        variant === 'c2' && 'text-[14px] leading-[24px]',
        variant === 'btn' && 'text-[16px] leading-[24px]',
        variant === 'bt' && 'text-[16px] leading-[24px]',
        variant === 'p' && 'text-[18px] leading-[24px]',
        variant === 't' && 'text-[20px] leading-[24px]',
        variant === 'h6' && 'text-[24px] leading-[32px]',
        variant === 'h5' && 'text-[32px] leading-[48px]',
        variant === 'h4' && 'text-[48px] leading-[64px]',
        variant === 'h3' && 'text-[64px] leading-[84px]',
        variant === 'h2' && 'text-[72px] leading-[90px]',
        variant === 'h1' && 'text-[80px] leading-[96px]',

        // *=============== Font Colors ==================
        color === 'white' && 'text-typo-white',
        color === 'dark' && 'text-typo-dark',
        color === 'blue-sky' && 'text-typo-blue-sky',

        // *=============== OTHERS ==================
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

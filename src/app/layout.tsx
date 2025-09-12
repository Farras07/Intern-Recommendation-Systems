import './globals.css';

import type { Metadata } from 'next';
import { Poppins, Rubik, Inter } from 'next/font/google';

import { cn } from '@/lib/utils';

import Providers from '@/lib/Providers';
import SessionProviderServer from '@/components/SessionWrapperServer';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  adjustFontFallback: false,
});

const teko = Rubik({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-teko',
  adjustFontFallback: false,
});

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: 'Fleek Creative',
  description:
    'EOS Analytic is modern data exploration and visualization platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={cn(poppins.variable, teko.variable, inter.variable)}
    >
      <body>
        <SessionProviderServer>
          <Providers>{children}</Providers>
        </SessionProviderServer>
      </body>
    </html>
  );
}

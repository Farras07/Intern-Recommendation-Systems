// const { Poppins } = require('next/font/google');

// tailwind.config.js
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        typo: {
          dark: '#2A2A2A',
          white: '#FFFF',
          'blue-sky': '#458FFF',
        },
        gray: '#56585C',
        lightgray: '#8F8C8C',
        pastel: '#FFA982',
        yellow: '#FDDC5A',
        tangerine: '#FF5733',
        sky: '#458FFF',
        'ghost-white': '#F6F5FF',
        'light-blue': '#74ABFF',
        'light-gray': '#7B7B7B',
        azure: '#D9ECFB',
      },
      backgroundImage: {
        gradient_azure_white:
          'linear-gradient(to bottom, #D9ECFB 80%, #ffffff)',
        'hero-card': "url('/landing/card-image.svg')",
      },
      padding: {
        container: '3rem',
        sm: '2rem',
        md: '8rem',
        lg: '12rem',
        xl: '24rem',
      },
      margin: {
        nav: ['80px'],
      },
      fontSize: {
        c1: ['12px', '24px'],
        c2: ['14px', '24px'],
        btn: ['16px', '24px'],
        bt: ['16px', '24px'],
        p: ['18px', '24px'],
        t: ['20px', '24px'],
        h6: ['24px', '32px'],
        h5: ['32px', '48px'],
        h4: ['48px', '64px'],
        h3: ['64px', '84px'],
        h2: ['72px', '90px'],
        h1: ['80px', '96px'],
      },

      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        teko: ['var(--font-teko)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

import Image from 'next/image';
import Typography from '@/components/Typography';

import Navbar from '@/layouts/landing/Navbar';

import Jumbotron from './_containers/Jumbotron';
import About from './_containers/About';

export default function Home() {
  return (
    <>
      <Navbar />
      <Jumbotron />
      <About />
    </>
  );
}

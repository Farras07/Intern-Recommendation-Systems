import Hero from './_containers/Hero';
import Benefit from './_containers/Benefit';
import Navbar from '@/layouts/landing/Navbar';
import Positions from './_containers/Positions';

export default function Vacancy() {
  return (
    <section className='w-screen'>
      <Navbar />
      <Hero />
      <Benefit />
      <Positions />
    </section>
  );
}

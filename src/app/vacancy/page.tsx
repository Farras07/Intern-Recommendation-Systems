import Typography from '@/components/Typography';
import HeroText from '@/components/ui/Hero_Text';
import Hero from './_containers/Hero';
import Benefit from './_containers/Benefit';
import Navbar from '@/layouts/landing/Navbar';
import Positions from './_containers/Positions';

export default function Vacancy() {
  return (
    <>
      <Navbar />
      <Hero />
      <Benefit />
      <Positions />
    </>
  );
}

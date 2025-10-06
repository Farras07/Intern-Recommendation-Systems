import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('@/layouts/landing/Navbar'), {
  ssr: false,
});
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

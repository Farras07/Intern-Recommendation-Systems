'use client';

import './Dummy';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import Navbar from '@/layouts/landing/Navbar';
import Jumbotron from './_containers/Jumbotron';
import About from './_containers/About';

export default function HomePage() {
  <>
    <Navbar />
    <Jumbotron />
    <About />
  </>;
}

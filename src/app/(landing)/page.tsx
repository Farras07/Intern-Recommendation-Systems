// Remove 'use client'; from here—keep the page as a server component
import './Dummy'; // Ensure this file exists; if it's a placeholder, remove or implement it

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import Navbar from '@/layouts/landing/Navbar';
import Jumbotron from './_containers/Jumbotron';
import About from './_containers/About';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Jumbotron />
      <About />
    </>
  );
}

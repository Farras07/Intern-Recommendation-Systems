'use client';

import React from 'react';
import { Modal, ModalContainer, useModal } from '@faceless-ui/modal';
import { HiOutlineXMark } from 'react-icons/hi2';
import { RxHamburgerMenu } from 'react-icons/rx';
import Image from 'next/image';
import Logo from '@/components/Logo';
import { navbarItems } from '@/constant/navbar.items';
export default function Navbar() {
  const { toggleModal } = useModal();
  return (
    <>
      <nav className='flex fixed z-50 justify-between xl:justify-center xl:items-center h-36 w-screen'>
        <div className='bg-gray w-screen xl:w-[83vw] h-20 xl:rounded-[26px] flex justify-between px-7'>
          <div className='flex items-center'>
            <div>
              <Logo />
            </div>
          </div>
          <div className='hidden xl:flex items-center justify-between gap-1 xl:gap-7'>
            {navbarItems.map(({ label, href }, index) => (
              <a
                className='font-teko text-xs w-24 h-fit py-2 text-center rounded-3xl text-typo-white hover:bg-white text-typo-dark hover:text-typo-dark'
                key={index}
                href={href}
              >
                {label}
              </a>
            ))}
          </div>
          <div className='flex items-center'>
            <button className='hidden xl:inline border-2 border-light-gray rounded-[10px] h-fit w-fit p-1 cursor-pointer'>
              <Image
                src={'/icons/sun.svg'}
                width={30}
                height={30}
                alt='toggle mode'
              />
            </button>
            <button
              onClick={() => toggleModal('mobile-nav')}
              className='border-2 border-light-gray rounded-[10px] h-fit w-fit p-1 xl:hidden cursor-pointer'
            >
              <RxHamburgerMenu />
            </button>
            <div></div>
          </div>
        </div>
      </nav>
      <Modal
        slug='mobile-nav'
        className='modal p-0 m-0 w-full
       bg-[rgba(0,0,0,0.8)] '
      >
        <div
          className='flex max-h-[100svh] min-h-[100svh] w-full flex-col px-5 pt-8
         '
        >
          <div className='flex items-center justify-between'>
            <Logo />
            <button
              onClick={() => toggleModal('mobile-nav')}
              className='z-[100] flex-none'
            >
              <HiOutlineXMark className='h-full w-7 stroke-[0.8] text-white' />
            </button>
          </div>
          <div className='w-full h-full flex flex-col justify-center items-center gap-16 mt-10'>
            {navbarItems.map(({ label, href }, index) => (
              <a
                className='font-teko w-32 h-fit py-2 text-center rounded-3xl text-typo-white text-2xl'
                key={index}
                href={href}
              >
                {label}
              </a>
            ))}
            <div className='items-center'>
              <button className='border-2 border-light-gray rounded-[10px] h-fit w-fit p-1 cursor-pointer'>
                <Image
                  src={'/icons/sun.svg'}
                  width={30}
                  height={30}
                  alt='toggle mode'
                />
              </button>
              <div></div>
            </div>
          </div>
        </div>
      </Modal>
      <ModalContainer />
      {/* <style jsx global>{`
        .modal-container {
          background-color: rgba(0, 0, 0, 0.8);
        }
        .modal {
          will-change: opacity;
          transition: opacity 250ms linear;
          opacity: 0;
        }
        .modal-item--appearActive,
        .modal-item--appearDone,
        .modal-item--enterActive,
        .modal-item--enterDone {
          opacity: 1;
        }

        .modal-item--exitActive,
        .modal-item--exitDone {
          opacity: 0;
        }
      `}</style> */}
    </>
  );
}

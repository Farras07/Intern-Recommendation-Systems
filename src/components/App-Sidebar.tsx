'use client';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Logo from './Logo';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import Typography from './Typography';
import { default as sidebarItems } from '@/constant/sidebar.items';

export function AppSidebar() {
  const { state } = useSidebar();
  const { data: session } = useSession();
  const { name, image, role } = session?.user;
  console.log(image);

  return (
    <Sidebar variant='floating' collapsible='icon'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarHeader
              className={`${state === 'expanded' ? 'flex' : 'hidden'} items-center `}
            >
              <div className='flex justify-center w-[90%] border-b-2 border-b-white '>
                <Logo />
              </div>
            </SidebarHeader>
            <SidebarMenu>
              {sidebarItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='flex items-center pb-9'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className={`w-[80%] h-18 ${state === 'expanded' ? 'bg-white rounded-[14px]' : 'rounded-full p-0'} `}
            >
              <figure
                className={`${state === 'expanded' ? 'w-12 h-12' : 'h-full w-full'} flex items-center `}
              >
                <Image
                  src={image}
                  width={100}
                  height={100}
                  alt={name}
                  className='rounded-full'
                />
              </figure>
              {state === 'expanded' && (
                <figcaption className='flex flex-col'>
                  <Typography
                    variant='bt'
                    weight='bold'
                    className='leading-none'
                  >
                    {name}
                  </Typography>
                  <Typography variant='c1' className='leading-none'>
                    {role}
                  </Typography>
                </figcaption>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side='top'
            className='w-[--radix-popper-anchor-width]'
          >
            <DropdownMenuItem>
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

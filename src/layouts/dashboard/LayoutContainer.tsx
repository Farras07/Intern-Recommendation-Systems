import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/App-Sidebar';
import DashboardNavbar from '@/components/DashboardNavbar';
import { useSession } from 'next-auth/react';
import { SessionUserData } from '@/types/SessionDataTypes';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  if (!session?.user) return null;
  const { name }: SessionUserData = session.user as SessionUserData;

  return (
    <div className='bg-ghost-white w-screen'>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <main className='px-5 py-5 w-full'>
          <div className='grid grid-cols-4 grid-rows-8 gap-3 h-full '>
            <DashboardNavbar username={name} />
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

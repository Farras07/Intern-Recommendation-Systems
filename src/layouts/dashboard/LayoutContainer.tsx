import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/App-Sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-ghost-white w-screen ">
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger className=""/>
        <main className="px-5 py-5 w-full">
          {children}
        </main>
      </SidebarProvider>
    </div>
  )
}
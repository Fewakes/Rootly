import AddContactDialog from '@/components/addContact';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DialogProvider } from '@/contexts/DialogContext';
import { AppSidebar } from '@/features/Layout/app-sidebar';
import { TopBar } from '@/features/Layout/TopBar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <DialogProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <TopBar />

        <SidebarProvider>
          <div className="flex flex-1 overflow-hidden min-h-0">
            <div className="h-[calc(100vh-3rem)]">
              <AppSidebar />
            </div>

            <main className="flex-1 min-h-0 overflow-auto p-6 bg-background relative">
              <Outlet />
              <AddContactDialog />
            </main>
          </div>
        </SidebarProvider>
      </div>
    </DialogProvider>
  );
}

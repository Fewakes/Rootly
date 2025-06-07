import AddContactDialog from '@/features/contacts/AddContactDialog';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/features/Layout/app-sidebar';
import { TopBar } from '@/features/Layout/TopBar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import AddTagDialog from '@/features/tags/AddTagDialog';
import AddCompanyDialog from '@/features/companies/addCompanyDialog';
import AddGroupDialog from '@/features/groups/AddGroupDialog';
import { DialogProvider } from '@/contexts/DialogContext';
import { AssignContactProvider } from '@/contexts/AssignContactContext';
import { AssignContactDialog } from '@/components/AssignContactDialog';

export default function Layout() {
  return (
    <AssignContactProvider>
      <DialogProvider>
        <div className="flex flex-col h-screen overflow-hidden">
          <TopBar />

          <SidebarProvider>
            <div className="flex flex-1 overflow-hidden min-h-0">
              <div className="h-[calc(100vh-3rem)]">
                <AppSidebar />
              </div>

              <main className="flex-1 min-h-screen overflow-auto p-6 bg-background relative">
                <Outlet />
                {/* Dialogs and Toasters */}
                <AddContactDialog />
                <AddTagDialog />
                <AddGroupDialog />
                <AddCompanyDialog />
                <AssignContactDialog />

                <Toaster
                  position="top-center"
                  toastOptions={{
                    style: {
                      background: '#fff',
                      color: '#005df4',
                    },
                  }}
                />
              </main>
            </div>
          </SidebarProvider>
        </div>
      </DialogProvider>
    </AssignContactProvider>
  );
}

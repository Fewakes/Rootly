import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { DialogProvider } from '@/contexts/DialogContext';
import AppSidebar from '@/features/Layout/app-sidebar';

import EditContactInfoDialog from '@/features/contact/EditContactInfoDialog';
import TagDialog from '@/features/tags/TagDialog';
import GroupDialog from '@/features/groups/GroupDialog';
import CompanyDialog from '@/components/ui/CompanyDialog';
import AddContactDialog from '@/features/contacts/AddContactDialog';
import EditContactProfileDialog from '@/features/contact/EditContactProfileDialog';

export default function Layout() {
  return (
    <DialogProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <SidebarProvider>
          <div className="flex flex-1 overflow-hidden min-h-0">
            <div className="h-full">
              <AppSidebar />
            </div>

            <main className="flex-1 min-h-screen overflow-auto p-6 bg-background relative">
              <Outlet />
              <AddContactDialog />
              <EditContactProfileDialog />
              <EditContactInfoDialog />
              <TagDialog />
              <GroupDialog />
              <CompanyDialog />
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
  );
}

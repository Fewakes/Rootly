import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Toaster } from 'sonner';
import { DialogProvider } from '@/contexts/DialogContext';
import AppSidebar from '@/features/Layout/app-sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

import EditContactInfoDialog from '@/features/contact/EditContactInfoDialog';
import TagDialog from '@/features/tags/TagDialog';
import GroupDialog from '@/features/groups/GroupDialog';
import CompanyDialog from '@/features/companies/CompanyDialog';
import AddContactDialog from '@/features/contacts/AddContactDialog';
import EditContactProfileDialog from '@/features/contact/EditContactProfileDialog';

const MobileHeader = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <header className="md:hidden flex items-center justify-between px-4 h-16 border-b bg-card sticky top-0 z-40">
    <Link to="/">
      <h1
        className="text-blue-600 text-2xl"
        style={{ fontFamily: "'Pacifico', cursive" }}
      >
        Rootly
      </h1>
    </Link>
    <Button onClick={onMenuClick} variant="ghost" size="icon">
      <Menu className="h-6 w-6" />
    </Button>
  </header>
);

export default function RootLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <DialogProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar
          isCollapsed={isCollapsed}
          onCollapseToggle={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>

        <AddContactDialog />
        <EditContactProfileDialog />
        <EditContactInfoDialog />
        <TagDialog />
        <GroupDialog />
        <CompanyDialog />
        <Toaster
          position="top-center"
          toastOptions={{ style: { background: '#fff', color: '#005df4' } }}
        />
      </div>
    </DialogProvider>
  );
}

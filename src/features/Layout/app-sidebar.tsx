import {
  Contact,
  Home,
  LogOut as LucideLogOut,
  PlusCircle,
  Building,
  Tags,
  Users,
  UserCircle2,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

import { useDialog } from '@/contexts/DialogContext';
import { useSignOut } from '@/logic/useSignOut';
import { useUserAuthProfile } from '@/logic/useUserAuthProfile';

const dashboardItems = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Contacts', url: '/contacts', icon: Contact },
  { title: 'Tags', url: '/tags', icon: Tags },
  { title: 'Groups', url: '/groups', icon: Users },
  { title: 'Companies', url: '/companies', icon: Building },
];

const workspaceItems = [
  {
    title: 'New Contact',
    dialog: 'addContact',
    icon: PlusCircle,
    color: 'text-green-500',
  },
  {
    title: 'New Tag',
    dialog: 'addTag',
    icon: PlusCircle,
    color: 'text-orange-500',
  },
  {
    title: 'New Group',
    dialog: 'addGroup',
    icon: PlusCircle,
    color: 'text-purple-500',
  },

  {
    title: 'New Company',
    dialog: 'addCompany',
    icon: PlusCircle,
    color: 'text-blue-500',
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openDialog } = useDialog();
  const { signOut } = useSignOut();
  const { user, loading, error } = useUserAuthProfile();

  const handleLogout = () => {
    signOut(() => {
      navigate('/login');
    });
  };

  return (
    <Sidebar className="h-screen border-r flex flex-col bg-gray-50 w-64">
      {/* Header: Logo and Search */}
      <div className="px-4 py-5 border-b text-center">
        <Link to="/" className="block w-full">
          <h1
            className="text-blue-600 text-3xl mb-4 select-none"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Rootly
          </h1>
        </Link>
        <input
          type="search"
          placeholder="Search..."
          className="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Navigation and Actions */}
      <SidebarContent className="flex-1 overflow-y-auto px-4">
        <SidebarGroup className="mb-4">
          <SidebarGroupLabel className="px-13= mb-2 mt-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map(item => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuItem key={item.title}>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-3 w-full rounded-md px-1 py-2 text-sm font-medium text-left transition-colors ${
                          isActive
                            ? 'bg-blue-100 text-blue-700 font-semibold'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <hr className="border-gray-200" />

        <SidebarGroup className="mb-4">
          <SidebarGroupLabel className="px-1 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Workspace
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {workspaceItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="flex items-center gap-3 w-full rounded-md px-1 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    onClick={() => openDialog(item.dialog)}
                  >
                    <item.icon
                      style={{ width: 23, height: 23 }}
                      className={item.color}
                    />

                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: User Info & Logout */}
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <UserCircle2 className="w-10 h-10 text-gray-500 rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {loading ? 'Loading...' : error ? 'Error' : user?.fullName || ''}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {loading
                ? '...'
                : error
                  ? 'Could not load email'
                  : user?.email || ''}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-md text-gray-500 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <LucideLogOut className="w-5 h-5" />
            <span className="sr-only">Logout</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

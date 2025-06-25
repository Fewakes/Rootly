import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// --- UI Components ---
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// --- Logic Hooks ---
import { useDialog } from '@/contexts/DialogContext';
import { useSignOut } from '@/logic/useSignOut';
import { useUserAuthProfile } from '@/logic/useUserAuthProfile';
import { useFavouriteContacts } from '@/logic/useFavouriteContacts'; // For the new section

// --- Icons ---
import {
  Contact,
  Home,
  LogOut as LucideLogOut,
  PlusCircle,
  Building,
  Tags,
  Users,
  UserCircle2,
  Star,
  Search,
} from 'lucide-react';

// --- Sidebar Configuration ---
const dashboardItems = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Contacts', url: '/contacts', icon: Contact },
  { title: 'Tags', url: '/tags', icon: Tags },
  { title: 'Groups', url: '/groups', icon: Users },
  { title: 'Companies', url: '/companies', icon: Building },
];

const workspaceActions = [
  { label: 'New Contact', dialog: 'addContact' },
  { label: 'New Company', dialog: 'addCompany' },
  { label: 'New Group', dialog: 'addGroup' },
  { label: 'New Tag', dialog: 'addTag' },
];

// --- Main Sidebar Component ---
export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openDialog } = useDialog();
  const { signOut } = useSignOut();
  const { user, loading: userLoading } = useUserAuthProfile();

  const [openCommand, setOpenCommand] = useState(false);
  const { contacts: favouriteContacts, loading: favsLoading } =
    useFavouriteContacts();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommand(open => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleLogout = () => {
    signOut(() => navigate('/login'));
  };

  const runCommand = (command: () => void) => {
    setOpenCommand(false);
    command();
  };

  return (
    <>
      <Sidebar className="h-screen border-r flex flex-col bg-card w-64">
        {/* Header: Logo and Quick Add Button */}
        <div className="px-4 py-5 border-b flex items-center justify-between">
          <Link to="/">
            <h1
              className="text-primary text-3xl select-none"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              Rootly
            </h1>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Create New">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Create New</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaceActions.map(action => (
                <DropdownMenuItem
                  key={action.dialog}
                  onClick={() => openDialog(action.dialog)}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Content: Search, Navigation, Favourites */}
        <SidebarContent className="flex-1 overflow-y-auto px-2 py-4">
          <div className="px-2 pb-2">
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground"
              onClick={() => setOpenCommand(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Search...
              <kbd className="ml-auto hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {dashboardItems.map(item => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium text-left transition-colors ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground/70 hover:bg-muted hover:text-foreground'}`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {favouriteContacts.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <Star className="h-3 w-3 text-yellow-500" /> Favourites
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {favouriteContacts.slice(0, 5).map(contact => (
                    <SidebarMenuItem key={contact.id}>
                      <Link
                        to={`/contacts/${contact.id}`}
                        className="flex items-center gap-3 w-full rounded-md px-3 py-1.5 text-sm font-medium text-left transition-colors text-foreground/70 hover:bg-muted hover:text-foreground"
                      >
                        <Avatar className="h-6 w-6 border">
                          <AvatarImage src={contact.avatar_url || ''} />
                          <AvatarFallback className="text-xs">
                            {contact.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{contact.name}</span>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* Footer: User Info & Logout */}
        <SidebarFooter className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border">
              {user?.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt="User Avatar" />
              )}
              <AvatarFallback>
                <UserCircle2 className="w-6 h-6 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {userLoading ? '...' : user?.fullName || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userLoading ? '...' : user?.email || ''}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              title="Logout"
              className="text-muted-foreground hover:bg-red-100 hover:text-red-600"
            >
              <LucideLogOut className="w-5 h-5" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Command Palette Dialog (hidden by default) */}
      <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {dashboardItems.map(item => (
              <CommandItem
                key={`cmd-${item.title}`}
                onSelect={() => runCommand(() => navigate(item.url))}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            {workspaceActions.map(action => (
              <CommandItem
                key={`cmd-${action.dialog}`}
                onSelect={() => runCommand(() => openDialog(action.dialog))}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>{action.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

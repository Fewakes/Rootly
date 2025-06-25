import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';

import { useDialog } from '@/contexts/DialogContext';
import { useSignOut } from '@/logic/useSignOut';
import { useUserAuthProfile } from '@/logic/useUserAuthProfile';
import { useFavouriteContacts } from '@/logic/useFavouriteContacts';

import {
  Home,
  Contact,
  Tags,
  Users,
  Building,
  PlusCircle,
  Star,
  Search,
  UserCircle2,
  LogOut as LucideLogOut,
  History,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

const dashboardItems = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Contacts', url: '/contacts', icon: Contact },
  { title: 'Companies', url: '/companies', icon: Building },
  { title: 'Groups', url: '/groups', icon: Users },
  { title: 'Tags', url: '/tags', icon: Tags },
  { title: 'Activity Log', url: '/activity-log', icon: History },
];
const workspaceActions = [
  { label: 'New Contact', dialog: 'addContact', icon: UserCircle2 },
  { label: 'New Company', dialog: 'addCompany', icon: Building },
  { label: 'New Group', dialog: 'addGroup', icon: Users },
  { label: 'New Tag', dialog: 'addTag', icon: Tags },
];
const performGlobalSearch = async (term: string) => {
  if (!term) return [];
  await new Promise(resolve => setTimeout(resolve, 300));
  return [{ type: 'Contact', name: `"${term}" in Contacts`, id: '1' }];
};

const SidebarNavContent = ({
  isCollapsed,
  onLinkClick,
}: {
  isCollapsed: boolean;
  onLinkClick?: () => void;
}) => {
  const location = useLocation();
  const { openDialog } = useDialog();
  const { contacts: favouriteContacts, loading: favsLoading } =
    useFavouriteContacts();
  const [favouritesExpanded, setFavouritesExpanded] = useState(false);
  const displayedFavourites = favouritesExpanded
    ? favouriteContacts
    : favouriteContacts.slice(0, 4);

  if (isCollapsed) {
    return (
      <nav className="flex-1 px-2 py-4 space-y-2">
        {dashboardItems.map(item => (
          <TooltipProvider key={item.title} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={item.url}
                  className={cn(
                    'flex items-center justify-center h-10 w-full rounded-md text-sm font-medium transition-colors',
                    location.pathname === item.url
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100',
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.title}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
      <div className="px-2">
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
          onClick={() => {
            onLinkClick?.();
            document.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }),
            );
          }}
        >
          <Search className="h-4 w-4 mr-2" />
          Search...
          <kbd className="ml-auto hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
            ⌘K
          </kbd>
        </Button>
      </div>

      <div className="space-y-1">
        <h3 className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Dashboard
        </h3>
        {dashboardItems.map(item => (
          <Link
            key={item.title}
            to={item.url}
            onClick={onLinkClick}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              location.pathname === item.url
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100',
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>

      {(favsLoading || favouriteContacts.length > 0) && (
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Favourites
          </h3>
          <div className="mt-1 space-y-1">
            {favsLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-muted rounded-md animate-pulse mx-3 my-1.5"
                  />
                ))
              : displayedFavourites.map(contact => (
                  <Link
                    key={contact.id}
                    to={`/contacts/${contact.id}`}
                    onClick={onLinkClick}
                    className="flex items-center gap-3 w-full rounded-md px-3 py-1.5 text-sm font-medium text-left transition-colors text-foreground/70 hover:bg-muted"
                  >
                    <Avatar className="h-6 w-6 border">
                      <AvatarImage src={contact.avatar_url || ''} />
                      <AvatarFallback className="text-xs">
                        {contact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{contact.name}</span>
                  </Link>
                ))}
          </div>
          {favouriteContacts.length > 4 && (
            <div className="px-3 pt-1">
              <Button
                variant="link"
                className="p-0 h-auto text-xs"
                onClick={() => setFavouritesExpanded(!favouritesExpanded)}
              >
                {favouritesExpanded
                  ? 'Show Less'
                  : `Show all ${favouriteContacts.length}...`}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function AppSidebar({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onCollapseToggle,
}) {
  const navigate = useNavigate();
  const { signOut } = useSignOut();
  const { user, loading: userLoading } = useUserAuthProfile();
  const { openDialog } = useDialog();
  const [openCommand, setOpenCommand] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        performGlobalSearch(searchQuery).then(setSearchResults);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = () => signOut(() => navigate('/login'));
  const runCommand = (command: () => void) => {
    setOpenCommand(false);
    command();
  };

  const sidebarHeader = (
    <div className="px-4 py-5 border-b text-center">
      <Link to="/">
        <h1
          className="text-blue-600 text-3xl select-none"
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          {isCollapsed && !isMobileOpen ? 'R' : 'Rootly'}
        </h1>
      </Link>
    </div>
  );

  const sidebarFooter = (
    <div className="p-4 border-t">
      {isCollapsed ? (
        // --- Collapsed Footer ---
        <div className="space-y-2">
          <Button
            onClick={onCollapseToggle}
            variant="ghost"
            size="icon"
            className="w-full h-10"
          >
            <ChevronsRight className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            title="Logout"
            className="w-full h-10 text-muted-foreground hover:bg-red-100 hover:text-red-600"
          >
            <LucideLogOut className="w-5 w-5" />
          </Button>
        </div>
      ) : (
        // --- Expanded Footer ---
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-sm mb-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="w-56 ml-2 mb-1"
            >
              {workspaceActions.map(action => (
                <DropdownMenuItem
                  key={action.dialog}
                  onClick={() => openDialog(action.dialog)}
                  className="gap-2"
                >
                  <action.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{action.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="w-10 h-10 border">
                <AvatarImage src={user?.avatarUrl || ''} alt="User Avatar" />
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
            </div>
            <div className="flex items-center">
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                title="Logout"
                className="text-muted-foreground hover:bg-red-100 hover:text-red-600 shrink-0"
              >
                <LucideLogOut className="w-5 h-5" />
              </Button>
              <Button
                onClick={onCollapseToggle}
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex text-muted-foreground"
              >
                <ChevronsLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          'h-screen flex-col border-r bg-gray-50 transition-all duration-300 hidden md:flex',
          isCollapsed ? 'w-20' : 'w-64',
        )}
      >
        {sidebarHeader}
        <SidebarNavContent isCollapsed={isCollapsed} />
        {sidebarFooter}
      </aside>

      <Sheet open={isMobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="w-64 p-0 flex flex-col bg-gray-50">
          {sidebarHeader}
          <SidebarNavContent isCollapsed={false} onLinkClick={onMobileClose} />
          {sidebarFooter}
        </SheetContent>
      </Sheet>

      <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <CommandInput
          placeholder="Type a command or search..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {searchQuery ? 'No results found.' : 'Start typing to search.'}
          </CommandEmpty>
          {searchResults.length > 0 && (
            <CommandGroup heading="Search Results">
              {searchResults.map(result => (
                <CommandItem
                  key={result.id}
                  onSelect={() =>
                    runCommand(() =>
                      navigate(`/${result.type.toLowerCase()}s/${result.id}`),
                    )
                  }
                >
                  <Contact className="mr-2 h-4 w-4" />
                  <span>{result.name}</span>
                  <span className="text-xs ml-2 text-muted-foreground">
                    {result.type}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
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
          <CommandSeparator />
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
        </CommandList>
      </CommandDialog>
    </>
  );
}

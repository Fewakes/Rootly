import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useDialog, type DialogName } from '@/contexts/DialogContext';
import { useSignOut } from '@/logic/useSignOut';
import { useUserAuthProfile } from '@/logic/useUserAuthProfile';
import { useFavouriteContacts } from '@/logic/useFavouriteContacts';
import {
  Home,
  Contact,
  Tags,
  Users,
  Building,
  Star,
  Search,
  UserCircle2,
  LogOut as LucideLogOut,
  History,
  ChevronsLeft,
  ChevronsRight,
  Plus,
} from 'lucide-react';

const dashboardItems = [
  { title: 'Home', url: '/', icon: Home, dialog: null },
  { title: 'Contacts', url: '/contacts', icon: Contact, dialog: 'addContact' },
  {
    title: 'Companies',
    url: '/companies',
    icon: Building,
    dialog: 'addCompany',
  },
  { title: 'Groups', url: '/groups', icon: Users, dialog: 'addGroup' },
  { title: 'Tags', url: '/tags', icon: Tags, dialog: 'addTag' },
  { title: 'Activity Log', url: '/activity-log', icon: History, dialog: null },
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
                      ? 'bg-blue-100 text-primaryBlue'
                      : 'text-gray-600 hover:bg-gray-100',
                  )}
                  onClick={onLinkClick}
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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Scrollable Content Area */}
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
            <div key={item.title} className="group relative">
              <Link
                to={item.url}
                onClick={onLinkClick}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname === item.url
                    ? 'bg-blue-100 text-primaryBlue font-semibold'
                    : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
              {item.dialog && (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:bg-gray-200 transition-opacity"
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          onLinkClick?.();
                          openDialog(item.dialog as DialogName);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      New {item.title.slice(0, -1)}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
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

      {/* Copyright notice at the bottom of the content area */}
      <div className="px-3 py-4">
        <p className="text-center text-xs text-muted-foreground">
          © 2025 by Jacob Slojkowski
        </p>
      </div>
    </div>
  );
};

export default function AppSidebar({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onCollapseToggle,
}: {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onCollapseToggle: () => void;
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
          className="text-primaryBlue text-3xl select-none"
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
        <div className="space-y-2">
          <Button
            onClick={onCollapseToggle}
            variant="ghost"
            size="icon"
            className="w-full h-10"
            title="Expand Sidebar"
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
              title="Collapse Sidebar"
            >
              <ChevronsLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
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
            {dashboardItems
              .filter(item => item.dialog)
              .map(item => (
                <CommandItem
                  key={`cmd-${item.dialog}`}
                  onSelect={() =>
                    runCommand(() => openDialog(item.dialog as DialogName))
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>New {item.title.slice(0, -1)}</span>
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

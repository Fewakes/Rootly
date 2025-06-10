import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useDialog } from '@/contexts/DialogContext';
import { getPopularGroups } from '@/services/groups';
import { getPopularTags } from '@/services/tags';
import { TAG_BG } from '@/lib/utils';
import type { Tag } from '@/types/types';

import {
  Contact,
  Home,
  LucideLogOut,
  LucideSettings,
  MessageSquare,
  Bell,
  LucideCircleUser,
  Plus,
  Tags,
  Users,
  Building,
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSignOut } from '@/logic/useSignOut';

const items = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Contacts', url: '/contacts', icon: Contact },
  { title: 'Tags', url: '/tags', icon: Tags },
  { title: 'Groups', url: '/groups', icon: Users },
  { title: 'Companies', url: '/companies', icon: Building },
];

export function AppSidebar() {
  const location = useLocation();
  const { openDialog } = useDialog();
  const [tags, setTags] = useState<Tag[]>([]);
  const [groups, setGroups] = useState<Tag[]>([]);
  const navigate = useNavigate();
  const { signOut, loading: isSigningOut, error: signOutError } = useSignOut();

  const handleLogout = async () => {
    signOut(
      () => {
        navigate('/login');
      },
      error => {
        alert('Failed to log out: ' + error.message);
      },
    );
  };

  useEffect(() => {
    getPopularTags(4).then(setTags);
    getPopularGroups(4).then(setGroups);
  }, []);

  return (
    <Sidebar className="h-screen border-r flex flex-col bg-background">
      {/* Logo and Search */}
      <div className="px-4 py-5 border-b border-border text-center">
        <Link to="/" className="block w-full">
          <h1
            className="text-primaryBlue text-3xl mb-4 select-none"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Rootly
          </h1>
        </Link>
        <input
          type="search"
          placeholder="Search contacts..."
          className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 caret-gray-700"
        />
      </div>

      {/* Main Content */}
      <SidebarContent className="flex-1 overflow-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-muted-foreground">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="text-sm font-medium text-foreground/80 hover:text-foreground"
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Groups */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-muted-foreground">
            Groups (Most Popular)
          </SidebarGroupLabel>
          <SidebarGroupAction
            title="Add Group"
            onClick={() => openDialog('addGroup')}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Add Group</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map(group => (
                <SidebarMenuItem key={group.id}>
                  <SidebarMenuButton className="text-sm font-medium text-foreground/80 hover:text-foreground">
                    {group.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tags */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-muted-foreground">
            Tags (Most Popular)
          </SidebarGroupLabel>
          <SidebarGroupAction
            title="Add Tag"
            onClick={() => openDialog('addTag')}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Add Tag</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {tags.map(tag => (
                <SidebarMenuItem key={tag.id}>
                  <SidebarMenuButton className="text-sm font-medium text-foreground/80 hover:text-foreground">
                    <span className="flex items-center gap-2">
                      <span
                        className={`${TAG_BG[tag.color] ?? 'bg-gray-500'} w-1 h-5 rounded-3xl`}
                      />
                      {tag.name}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer / User Panel */}
      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label="Messages"
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primaryBlue relative"
          >
            <MessageSquare className="w-5 h-5 text-gray-700" />
            <span className="absolute top-0 left-5 flex h-4 w-4 items-center justify-center rounded-full bg-primaryBlue text-white text-xs font-semibold">
              1
            </span>
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primaryBlue relative"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-0 left-5 flex h-4 w-4 items-center justify-center rounded-full bg-primaryBlue text-white text-xs font-semibold">
              9
            </span>
          </button>

          <button
            type="button"
            aria-label="User Account"
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primaryBlue"
          >
            <LucideCircleUser className="w-6 h-6 text-gray-700" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <LucideLogOut className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

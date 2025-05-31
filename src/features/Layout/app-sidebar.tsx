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
import { ButtonWithIcon } from '@/features/Layout/button-with-icon';
import { supabase } from '@/lib/supabaseClient';
import { getPopularGroups } from '@/services/groups';
import { getPopularTags } from '@/services/tags';
import type { Tag } from '@/types/types';
import {
  Contact,
  Home,
  LucideLogOut,
  LucideSettings,
  Plus,
  UserRoundPlus,
  Tags,
  Users,
  Building,
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TAG_BG } from '@/lib/utils';

// Navigation links (Main pages)
const items = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Contacts', url: '/contacts', icon: Contact },
  { title: 'Tags', url: '/tags', icon: Tags },
  { title: 'Groups', url: '/groups', icon: Users },
  { title: 'Companies', url: '/companies', icon: Building },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openDialog } = useDialog();
  const [tags, setTags] = useState<Tag[]>([]);
  const [groups, setGroups] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const popularTags = await getPopularTags(4);
      setTags(popularTags);
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      const popularGroups = await getPopularGroups(4);
      setGroups(popularGroups);
    };

    fetchGroups();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        return;
      }
      // Redirect to login page after logout
      navigate('/login');
    } catch (err) {
      console.error('Unexpected logout error:', err);
    }
  };

  return (
    <Sidebar>
      {/* Header with "Add new contact" button */}
      <SidebarHeader>
        <ButtonWithIcon onClick={() => openDialog('addContact')}>
          <div className="flex gap-3 cursor-pointer">
            <UserRoundPlus /> New Contact
          </div>
        </ButtonWithIcon>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Dashboard Navigation */}
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

        {/* Groups Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-muted-foreground">
            Groups (Most Popular)
          </SidebarGroupLabel>

          {/* Button to add new groups */}
          <SidebarGroupAction
            title="Add Groups"
            onClick={() => openDialog('addGroup')}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Add Groups</span>
          </SidebarGroupAction>

          {/* Group List */}
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map(group => (
                <SidebarMenuItem key={group.id}>
                  <SidebarMenuButton className="text-sm font-medium text-foreground/80 hover:text-foreground">
                    <span>{group.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tags Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-muted-foreground">
            Tags (Most Popular)
          </SidebarGroupLabel>

          {/* Button to add new tags */}
          <SidebarGroupAction
            title="Add Tags"
            onClick={() => openDialog('addTag')}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Add Tags</span>
          </SidebarGroupAction>

          {/* Tag List */}
          <SidebarGroupContent>
            <SidebarMenu>
              {tags.map(tag => (
                <SidebarMenuItem key={tag.id}>
                  <SidebarMenuButton className="text-sm font-medium text-foreground/80 hover:text-foreground">
                    <span className="flex items-center gap-2">
                      <span
                        className={`${TAG_BG[tag.color] ?? 'bg-gray-500'} w-1 h-5 rounded-3xl`}
                      ></span>
                      {tag.name}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

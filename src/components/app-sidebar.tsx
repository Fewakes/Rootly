import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Contact, Home, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Contacts',
    url: '/contacts',
    icon: Contact,
  },
  //   {
  //     title: 'New Groups / Tags',
  //     url: '/groups',
  //     icon: Bookmark,
  //   },
];

const groups = [
  {
    title: 'Close Friends',
    // url: '{redirect to all close friends}',
    // icon: ,
  },
  {
    title: 'Investors',
    // url: '{redirect to all Investors}',
    // icon: ,
  },
  {
    title: 'Geek Friends',
    // url: '{redirect to all Geek Friends}',
    // icon: ,
  },
  {
    title: 'Royalties',
    // url: '{redirect to all Royalties}',
    // icon: ,
  },
];

const tags = [
  {
    title: 'Family',
    // url: '{redirect to all members of the tag group}',
    // icon: ,
  },
  {
    title: 'Tech Expert',
    // url: '{redirect to all members of the tag group}',
    // icon: ,
  },
  {
    title: 'Elite',
    // url: '{redirect to all members of the tag group}',
    // icon: ,
  },
  {
    title: 'Important',
    // url: '{redirect to all members of the tag group}',
    // icon: ,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
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
      </SidebarContent>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Groups</SidebarGroupLabel>

          <SidebarGroupAction title="Add Groups">
            <Plus /> <span className="sr-only">Add Groups</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu></SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tags</SidebarGroupLabel>

          <SidebarGroupAction title="Add Tags">
            <Plus /> <span className="sr-only">Add Tags</span>
          </SidebarGroupAction>

          <SidebarGroupContent>{/*content*/}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

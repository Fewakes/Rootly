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
import { supabase } from '@/lib/supabaseClient';
import {
  Contact,
  Home,
  LucideCircleUser,
  LucideLogOut,
  LucideSettings,
  Plus,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Navigation links (Main pages)
const items = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Contacts', url: '/contacts', icon: Contact },
];

// Contact groups
const groups = [
  { title: '🥰 Close Friends' },
  { title: '💰 Investors' },
  { title: '👓 Geek Friends' },
  { title: '👑 Royalties' },
];

// Tag categories with associated color indicators
const tags = [
  { title: 'Family', color: 'bg-blue-500' },
  { title: 'Tech Expert', color: 'bg-green-500' },
  { title: 'Elite', color: 'bg-yellow-500' },
  { title: 'Important', color: 'bg-red-500' },
];

export function AppSidebar() {
  const location = useLocation(); // Used to check which route is active

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        return;
      }
      // Redirect to login page after logout
      navigate('/login'); // lowercase 'navigate'
    } catch (err) {
      console.error('Unexpected logout error:', err);
    }
  };

  return (
    <Sidebar>
      {/* Header with "Add new contact" button */}
      <SidebarHeader>
        <button className="bg-primaryBlue hover:bg-primaryBlue/90 transition-colors rounded-md h-10 px-5 text-white flex items-center justify-center gap-2 mt-5 mx-auto text-sm font-medium">
          <LucideCircleUser className="w-5 h-5" />
          <span>Add new contact</span>
        </button>
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
            Groups
          </SidebarGroupLabel>

          {/* Button to add new groups */}
          <SidebarGroupAction title="Add Groups">
            <Plus className="w-4 h-4" />
            <span className="sr-only">Add Groups</span>
          </SidebarGroupAction>

          {/* Group List */}
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="text-sm font-medium text-foreground/80 hover:text-foreground">
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tags Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-muted-foreground">
            Tags
          </SidebarGroupLabel>

          {/* Button to add new tags */}
          <SidebarGroupAction title="Add Tags">
            <Plus className="w-4 h-4" />
            <span className="sr-only">Add Tags</span>
          </SidebarGroupAction>

          {/* Tag List */}
          <SidebarGroupContent>
            <SidebarMenu>
              {tags.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="text-sm font-medium text-foreground/80 hover:text-foreground">
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-1 h-5 ${item.color} rounded-3xl`}
                      ></span>
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Section with Settings and Logout */}
      <SidebarFooter className="flex justify-between px-3 py-2">
        {/* Settings */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full px-2 py-1.5 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <LucideSettings className="w-4 h-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Logout */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full px-2 py-1.5 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive"
            >
              <LucideLogOut className="w-4 h-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

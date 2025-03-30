
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuLink,
} from "@/components/ui/sidebar";
import { Home, FileText, ShieldCheck, Package, Settings, BarChart3, Users, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Define menu items based on user role
  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/',
      roles: ['admin', 'customer', 'sales']
    },
    {
      icon: FileText,
      label: 'Onboarding',
      href: '/onboarding',
      roles: ['admin', 'customer', 'sales']
    },
    {
      icon: ShieldCheck,
      label: 'Insurance Verification',
      href: '/insurance',
      roles: ['admin', 'customer', 'sales']
    },
    {
      icon: Package,
      label: 'Order Forms',
      href: '/orders',
      roles: ['admin', 'customer', 'sales']
    },
    {
      icon: Users,
      label: 'Customers',
      href: '/customers',
      roles: ['admin', 'sales']
    },
    {
      icon: BarChart3,
      label: 'Reports',
      href: '/reports',
      roles: ['admin']
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
      roles: ['admin']
    },
  ];
  
  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <ShadcnSidebar>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/7e6ed07e-97db-460b-bc10-43824dd3311c.png" 
            alt="MSC Wound Care" 
            className="h-6 w-auto"
          />
          <span className="ml-2 text-lg font-semibold">MSC Portal</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuLink asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    location.pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </SidebarMenuLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2 text-xs text-sidebar-foreground/60">
          <HelpCircle className="h-3 w-3" />
          <span>Need help? Contact support at (555) 123-4567</span>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;

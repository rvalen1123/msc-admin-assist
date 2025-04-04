import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { Home, FileText, ShieldCheck, Package, Settings, BarChart3, Users, HelpCircle, ClipboardList, Briefcase, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { state, open, isMobile } = useSidebar();

  useEffect(() => {
    console.log('Sidebar Component State:', { state, open, isMobile });
  }, [state, open, isMobile]);

  // Define menu items based on user role
  const menuItems = [{
    icon: Home,
    label: 'Dashboard',
    href: '/',
    roles: ['admin', 'customer', 'sales']
  }, {
    icon: FileText,
    label: 'Onboarding',
    href: '/onboarding',
    roles: ['admin', 'customer', 'sales']
  }, {
    icon: ShieldCheck,
    label: 'Insurance Verification',
    href: '/insurance',
    roles: ['admin', 'customer', 'sales']
  }, {
    icon: Package,
    label: 'Order Forms',
    href: '/orders',
    roles: ['admin', 'customer', 'sales']
  }, {
    icon: ShoppingCart,
    label: 'Products',
    href: '/products',
    roles: ['admin', 'sales']
  }, {
    icon: Users,
    label: 'Customers',
    href: '/customers',
    roles: ['admin', 'sales']
  }, {
    icon: Briefcase,
    label: 'Sales Reps',
    href: '/sales-reps',
    roles: ['admin']
  }, {
    icon: ClipboardList,
    label: 'Submissions',
    href: '/submissions',
    roles: ['admin']
  }, {
    icon: BarChart3,
    label: 'Reports',
    href: '/reports',
    roles: ['admin']
  }, {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
    roles: ['admin']
  }];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => currentUser && item.roles.includes(currentUser.role));
  
  return (
    <ShadcnSidebar className="debug-outline">
      <SidebarHeader className="flex h-14 items-center border-b px-4 debug-outline">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/1499c309-73be-419a-bd43-85e0a3a9f84c.png" 
            alt="MSC Wound Care" 
            className="h-8 w-auto"
            onError={(e) => {
              console.error('Logo failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="debug-outline">
        <SidebarMenu className="debug-outline">
          {filteredMenuItems.map(item => (
            <SidebarMenuItem key={item.href} className="debug-outline">
              <SidebarMenuButton asChild>
                <Link 
                  to={item.href} 
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium debug-outline",
                    location.pathname === item.href 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4 debug-outline">
        <div className="flex items-center gap-2 text-xs text-sidebar-foreground/60">
          <HelpCircle className="h-3 w-3" />
          <span>Need help? Contact support at (555) 123-4567</span>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, HelpCircle, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar: React.FC = () => {
  const {
    currentUser,
    logout
  } = useAuth();
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Mock notification count for admin users
  const notificationCount = currentUser?.role === 'admin' ? 3 : 0;

  // Mock notifications data
  const notifications = [
    { id: 1, title: 'New submission', message: 'A new form has been submitted', time: '5 minutes ago' },
    { id: 2, title: 'Order update', message: 'Order #1234 has been approved', time: '1 hour ago' },
    { id: 3, title: 'System update', message: 'System maintenance scheduled', time: '2 hours ago' },
  ];

  return <header className="bg-white border-b border-gray-200">
      <div className="flex h-16 items-center px-4 md:px-6">
        <SidebarTrigger />
        <div className="ml-4 flex items-center">
          <Link to="/" className="flex items-center">
            
            
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-1 md:space-x-4">
          <div className="relative">
            <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500 relative" aria-label="Notifications">
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                      {notificationCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="bg-primary px-4 py-2 text-primary-foreground">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                  <Button variant="link" className="w-full text-xs justify-center">
                    Mark all as read
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button variant="ghost" size="icon" className="text-gray-500" aria-label="Get Help">
            <HelpCircle size={20} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt={currentUser?.name || "User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
                  <p className="text-xs font-medium mt-1 text-primary">
                    {currentUser?.role === 'admin' ? 'Administrator' : currentUser?.role === 'sales_rep' ? 'Sales Representative' : 'Customer'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/settings?tab=account" className="w-full flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="w-full flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>;
};

export default Navbar;

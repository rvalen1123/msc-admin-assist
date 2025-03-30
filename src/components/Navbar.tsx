
import React from 'react';
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, HelpCircle, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex h-16 items-center px-4 md:px-6">
        <SidebarTrigger />
        <div className="ml-4 flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/7e6ed07e-97db-460b-bc10-43824dd3311c.png" 
              alt="MSC Wound Care" 
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-semibold text-primary hidden md:inline-block">
              MSC Wound Care Portal
            </span>
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-1 md:space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Bell size={20} />
          </Button>

          <Button variant="ghost" size="icon" className="text-gray-500">
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
                    {currentUser?.role === 'admin' ? 'Administrator' : 
                     currentUser?.role === 'sales' ? 'Sales Representative' : 'Customer'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

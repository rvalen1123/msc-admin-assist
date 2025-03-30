
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { Bell, Home, FileText, ShieldCheck, Package, LogOut, Menu, User, Users, UserCog } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import AIAssistant from './AIAssistant';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, setCurrentUserRole } = useAuth();
  const location = useLocation();

  // Check if we're on the login page
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children || <Outlet />}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 p-4 md:p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              {children || <Outlet />}
            </div>
          </main>
          <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} MSC Wound Care. All rights reserved.</p>
          </footer>
          
          {/* User role switcher (for demo purposes only) */}
          <div className="fixed bottom-6 left-6 z-50">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
              <p className="text-xs font-medium mb-1 text-gray-500">Demo: Switch User Role</p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={currentUser?.role === 'admin' ? 'default' : 'outline'}
                  className="text-xs h-8"
                  onClick={() => setCurrentUserRole('admin')}
                >
                  <UserCog size={14} className="mr-1" /> Admin
                </Button>
                <Button 
                  size="sm" 
                  variant={currentUser?.role === 'customer' ? 'default' : 'outline'}
                  className="text-xs h-8"
                  onClick={() => setCurrentUserRole('customer')}
                >
                  <User size={14} className="mr-1" /> Customer
                </Button>
                <Button 
                  size="sm" 
                  variant={currentUser?.role === 'sales' ? 'default' : 'outline'}
                  className="text-xs h-8"
                  onClick={() => setCurrentUserRole('sales')}
                >
                  <Users size={14} className="mr-1" /> Sales
                </Button>
              </div>
            </div>
          </div>
          
          {/* AI Assistant */}
          <AIAssistant />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;

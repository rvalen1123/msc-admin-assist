import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { Bell, Home, FileText, ShieldCheck, Package, LogOut, Menu, User, Users } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import AIAssistant from './AIAssistant';

const LayoutContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const sidebar = useSidebar();

  useEffect(() => {
    console.log('Auth State:', { currentUser, isAuthenticated: !!currentUser });
    console.log('Sidebar State:', { 
      state: sidebar.state,
      open: sidebar.open,
      isMobile: sidebar.isMobile
    });
  }, [currentUser, sidebar.state, sidebar.open, sidebar.isMobile]);

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
        
        {/* AI Assistant */}
        <AIAssistant />
      </div>
    </div>
  );
};

const Layout: React.FC<{ children?: React.ReactNode }> = (props) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <LayoutContent {...props} />
    </SidebarProvider>
  );
};

export default Layout;


import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Lock, User } from 'lucide-react';
import GeneralSettingsTab from '@/components/settings/GeneralSettingsTab';
import NotificationsSettingsTab from '@/components/settings/NotificationsSettingsTab';
import SecuritySettingsTab from '@/components/settings/SecuritySettingsTab';
import AccountSettingsTab from '@/components/settings/AccountSettingsTab';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const SettingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Get the tab from the URL query parameter
  const urlParams = new URLSearchParams(location.search);
  const tabFromUrl = urlParams.get('tab');
  const defaultTab = tabFromUrl || 'general';
  
  return (
    <div className="container mx-auto py-4 md:py-6 px-4 md:px-0 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Card>
        <CardHeader className="px-4 md:px-6 py-4 md:py-6">
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
            Manage your application preferences and configurations.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6 pb-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className={`${isMobile ? "flex flex-wrap gap-2 justify-start" : "grid grid-cols-4"} mb-6`}>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Account</span>
              </TabsTrigger>
            </TabsList>
            <div className="px-2 md:px-0">
              <TabsContent value="general">
                <GeneralSettingsTab />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationsSettingsTab />
              </TabsContent>
              <TabsContent value="security">
                <SecuritySettingsTab />
              </TabsContent>
              <TabsContent value="account">
                <AccountSettingsTab />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

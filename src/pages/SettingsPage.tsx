
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Lock, User } from 'lucide-react';
import GeneralSettingsTab from '@/components/settings/GeneralSettingsTab';
import NotificationsSettingsTab from '@/components/settings/NotificationsSettingsTab';
import SecuritySettingsTab from '@/components/settings/SecuritySettingsTab';
import AccountSettingsTab from '@/components/settings/AccountSettingsTab';
import { useAuth } from '@/context/AuthContext';

const SettingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Only admin users can access this page
  const isAdmin = currentUser?.role === 'admin';
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
            Manage your application preferences and configurations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

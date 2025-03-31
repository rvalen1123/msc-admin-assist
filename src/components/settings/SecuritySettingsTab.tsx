
import React from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { toast } from '@/hooks/use-toast';

const SecuritySettingsTab = () => {
  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorAuth: false,
      sessionTimeout: true,
    }
  });

  const onSubmit = (data: any) => {
    console.log("Security settings saved:", data);
    
    // Validation for password change
    if ((data.newPassword || data.confirmPassword) && !data.currentPassword) {
      toast({
        title: "Error",
        description: "Current password is required to change your password.",
        variant: "destructive",
      });
      return;
    }
    
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive",
      });
      return;
    }
    
    if (data.newPassword && data.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    // Success toast
    toast({
      title: "Settings saved",
      description: "Your security settings have been updated.",
    });
    
    // Clear password fields
    form.reset({
      ...data,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Change Password</h3>
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-lg font-medium">Security Options</h3>
          
          <FormField
            control={form.control}
            name="twoFactorAuth"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two-factor authentication for added security
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sessionTimeout"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Session Timeout</FormLabel>
                  <FormDescription>
                    Automatically log out after 30 minutes of inactivity
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
};

export default SecuritySettingsTab;

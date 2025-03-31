
import React from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { toast } from '@/hooks/use-toast';

const NotificationsSettingsTab = () => {
  const form = useForm({
    defaultValues: {
      emailNotifications: true,
      submissionAlerts: true,
      weeklyReports: false,
      systemUpdates: true,
      marketingEmails: false,
    }
  });

  const onSubmit = (data: any) => {
    console.log("Notification settings saved:", data);
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:p-4">
                <div className="space-y-0.5 pr-2">
                  <FormLabel className="text-sm sm:text-base">Email Notifications</FormLabel>
                  <FormDescription className="text-xs sm:text-sm">
                    Receive notifications via email
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
            name="submissionAlerts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:p-4">
                <div className="space-y-0.5 pr-2">
                  <FormLabel className="text-sm sm:text-base">Form Submission Alerts</FormLabel>
                  <FormDescription className="text-xs sm:text-sm">
                    Be notified when new forms are submitted
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
            name="weeklyReports"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:p-4">
                <div className="space-y-0.5 pr-2">
                  <FormLabel className="text-sm sm:text-base">Weekly Reports</FormLabel>
                  <FormDescription className="text-xs sm:text-sm">
                    Receive weekly activity summary reports
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
            name="systemUpdates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:p-4">
                <div className="space-y-0.5 pr-2">
                  <FormLabel className="text-sm sm:text-base">System Updates</FormLabel>
                  <FormDescription className="text-xs sm:text-sm">
                    Get notifications about system updates and maintenance
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
            name="marketingEmails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:p-4">
                <div className="space-y-0.5 pr-2">
                  <FormLabel className="text-sm sm:text-base">Marketing Emails</FormLabel>
                  <FormDescription className="text-xs sm:text-sm">
                    Receive promotional content and newsletters
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
        
        <Button type="submit">Save Preferences</Button>
      </form>
    </Form>
  );
};

export default NotificationsSettingsTab;

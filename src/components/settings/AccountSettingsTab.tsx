
import React from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const AccountSettingsTab = () => {
  const { currentUser, updateUserProfile } = useAuth();
  
  const form = useForm({
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phoneNumber: "",
      jobTitle: "",
      company: "MSC Wound Care",
    }
  });

  const onSubmit = (data: any) => {
    console.log("Account settings saved:", data);
    updateUserProfile(data);
    
    toast({
      title: "Profile updated",
      description: "Your account information has been updated successfully.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src="" alt={currentUser?.name || "User"} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm">
              Change Avatar
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormDescription>
                  This email will be used for communications and notifications.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-4">
          <Button type="submit">Save Profile</Button>
        </div>
      </form>
    </Form>
  );
};

export default AccountSettingsTab;

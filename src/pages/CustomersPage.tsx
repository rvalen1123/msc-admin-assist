import React, { useState } from 'react';
import { useForm } from '@/context/form/FormProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Plus, Search, UserPlus, Mail, Phone, Building, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CustomerData } from '@/types';

const CustomerRow: React.FC<{ customer: CustomerData }> = ({ customer }) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  
  const initials = customer.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
    
  const primaryContact = customer.contacts?.find(contact => contact.isPrimary) || customer.contacts?.[0];
    
  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setShowDetails(true)}>
        <TableCell className="font-medium">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 bg-blue-100 text-blue-700">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              {customer.name}
              {customer.company && customer.name !== customer.company && (
                <div className="text-xs text-muted-foreground">{customer.company}</div>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>{customer.phone || (primaryContact?.phone || '-')}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="icon" onClick={(e) => {
            e.stopPropagation();
            setShowDetails(true);
          }}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 bg-blue-100 text-blue-700 text-xl">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-xl font-semibold">{customer.name}</h3>
                  {customer.company && customer.name !== customer.company && (
                    <p className="text-muted-foreground">{customer.company}</p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Contact Information</h4>
                  
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                        {customer.email}
                      </a>
                    </div>
                  )}
                  
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${customer.phone}`} className="text-blue-600 hover:underline">
                        {customer.phone}
                      </a>
                    </div>
                  )}
                  
                  {customer.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.company}</span>
                    </div>
                  )}
                </div>
                
                {customer.address && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Address</h4>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p>{customer.address.line1}</p>
                        {customer.address.line2 && <p>{customer.address.line2}</p>}
                        <p>
                          {customer.address.city}, {customer.address.state} {customer.address.zipCode}
                        </p>
                        <p>{customer.address.country}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowDetails(false);
                  navigate('/onboarding');
                }}>
                  Edit Customer
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="contacts">
              <div className="space-y-4">
                {customer.contacts && customer.contacts.length > 0 ? (
                  <div className="divide-y">
                    {customer.contacts.map((contact, index) => (
                      <div key={index} className="py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {contact.name}
                              {contact.isPrimary && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  Primary
                                </span>
                              )}
                            </h4>
                            {contact.title && <p className="text-sm text-muted-foreground">{contact.title}</p>}
                          </div>
                          <Button size="sm" variant="outline">Edit</Button>
                        </div>
                        
                        <div className="mt-2 space-y-1">
                          {contact.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                                {contact.email}
                              </a>
                            </div>
                          )}
                          
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                                {contact.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No contacts found for this customer.</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="mr-1 h-4 w-4" />
                      Add Contact
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="forms">
              <div className="text-center py-8 text-muted-foreground">
                <p>Form submissions will appear here.</p>
                <Button onClick={() => {
                  setShowDetails(false);
                  navigate('/onboarding');
                }} variant="outline" size="sm" className="mt-2">
                  <Plus className="mr-1 h-4 w-4" />
                  New Form
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

const CustomersPage: React.FC = () => {
  const { customers, isLoading, error } = useForm();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Customers</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }
  
  const filteredCustomers = customers?.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (customer.company && customer.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customers and their information
          </p>
        </div>
        <Button onClick={() => navigate('/onboarding')}>
          <UserPlus className="mr-2 h-4 w-4" /> New Customer
        </Button>
      </div>
      
      <Separator />
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>All Customers</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {customers?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <CustomerRow key={customer.id} customer={customer} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      No customers matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <UserPlus className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No customers yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by onboarding a new customer.
              </p>
              <Button
                onClick={() => navigate('/onboarding')}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Customer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersPage;

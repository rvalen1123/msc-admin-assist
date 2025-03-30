
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SalesRep } from '@/types';
import { salesReps, addSalesRep, updateSalesRep, deleteSalesRep } from '@/data/salesRepData';
import SalesRepForm from '@/components/sales/SalesRepForm';
import SalesRepTable from '@/components/sales/SalesRepTable';
import { useToast } from '@/hooks/use-toast';

const SalesRepPage: React.FC = () => {
  const [reps, setReps] = useState<SalesRep[]>(salesReps);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddSalesRep = (data: Omit<SalesRep, 'id' | 'createdAt'>) => {
    const newRep = addSalesRep(data);
    setReps([...reps, newRep]);
    setDialogOpen(false);
  };

  const handleEditSalesRep = (id: string, data: Partial<SalesRep>) => {
    const updatedRep = updateSalesRep(id, data);
    setReps(reps.map(rep => rep.id === id ? { ...rep, ...data } : rep));
    toast({
      title: "Sales Rep Updated",
      description: `${updatedRep?.name} has been updated successfully.`,
    });
  };

  const handleDeleteSalesRep = (id: string) => {
    deleteSalesRep(id);
    setReps(reps.filter(rep => rep.id !== id));
    toast({
      title: "Sales Rep Deleted",
      description: "The sales representative has been removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Representatives</h1>
          <p className="text-muted-foreground">
            Manage your company's sales representatives
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Sales Rep
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Sales Representative</DialogTitle>
            </DialogHeader>
            <SalesRepForm onSubmit={handleAddSalesRep} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <SalesRepTable
            salesReps={reps}
            onEdit={handleEditSalesRep}
            onDelete={handleDeleteSalesRep}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesRepPage;

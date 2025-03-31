
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { SalesRep } from '@/types';
import SalesRepForm from './SalesRepForm';
import SalesRepDetails from './SalesRepDetails';

interface SalesRepActionsProps {
  salesRep: SalesRep;
  onEdit: (id: string, data: Partial<SalesRep>) => void;
  onDelete: (id: string) => void;
}

const SalesRepActions: React.FC<SalesRepActionsProps> = ({ 
  salesRep, 
  onEdit, 
  onDelete 
}) => {
  const handleEdit = (data: Omit<SalesRep, 'id' | 'createdAt'>) => {
    onEdit(salesRep.id, data);
  };
  
  return (
    <div className="flex justify-end space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Sales Rep Details</DialogTitle>
          </DialogHeader>
          <SalesRepDetails salesRep={salesRep} />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Sales Representative</DialogTitle>
          </DialogHeader>
          <SalesRepForm
            initialData={salesRep}
            onSubmit={(data) => handleEdit(data)}
            isEdit
          />
          <DialogClose className="hidden" />
        </DialogContent>
      </Dialog>

      <Button
        variant="destructive"
        size="icon"
        onClick={() => onDelete(salesRep.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SalesRepActions;


import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SalesRep } from '@/types';
import { Badge } from '@/components/ui/badge';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import SalesRepForm from './SalesRepForm';

interface SalesRepTableProps {
  salesReps: SalesRep[];
  onEdit: (id: string, data: Partial<SalesRep>) => void;
  onDelete: (id: string) => void;
}

const SalesRepTable: React.FC<SalesRepTableProps> = ({ 
  salesReps, 
  onEdit, 
  onDelete 
}) => {
  const [salesRepToDelete, setSalesRepToDelete] = useState<string | null>(null);
  const [salesRepToView, setSalesRepToView] = useState<SalesRep | null>(null);

  const handleEdit = (data: Omit<SalesRep, 'id' | 'createdAt'>, id: string) => {
    onEdit(id, data);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Territory</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesReps.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No sales representatives found. Add your first one!
              </TableCell>
            </TableRow>
          ) : (
            salesReps.map((rep) => (
              <TableRow key={rep.id}>
                <TableCell className="font-medium">{rep.name}</TableCell>
                <TableCell>{rep.email}</TableCell>
                <TableCell>{rep.territory || "-"}</TableCell>
                <TableCell>
                  <Badge variant={rep.active ? "success" : "secondary"}>
                    {rep.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(rep.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSalesRepToView(rep)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="mb-4">Sales Rep Details</DialogTitle>
                        </DialogHeader>
                        {salesRepToView && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Name</p>
                                <p>{salesRepToView.name}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p>{salesRepToView.email}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                <p>{salesRepToView.phone || "-"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Territory</p>
                                <p>{salesRepToView.territory || "-"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <Badge variant={salesRepToView.active ? "success" : "secondary"}>
                                  {salesRepToView.active ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Added On</p>
                                <p>{formatDate(salesRepToView.createdAt)}</p>
                              </div>
                            </div>
                          </div>
                        )}
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
                          initialData={rep}
                          onSubmit={(data) => handleEdit(data, rep.id)}
                          isEdit
                        />
                        <DialogClose className="hidden" />
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setSalesRepToDelete(rep.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!salesRepToDelete}
        onOpenChange={(open) => !open && setSalesRepToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the sales rep
              from the system and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (salesRepToDelete) {
                  onDelete(salesRepToDelete);
                  setSalesRepToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SalesRepTable;

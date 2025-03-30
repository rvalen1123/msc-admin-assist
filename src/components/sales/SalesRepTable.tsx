
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SalesRep } from '@/types';
import SalesRepTableRow from './SalesRepTableRow';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

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

  const handleDeleteClick = (id: string) => {
    setSalesRepToDelete(id);
  };

  const handleDeleteConfirm = () => {
    if (salesRepToDelete) {
      onDelete(salesRepToDelete);
      setSalesRepToDelete(null);
    }
  };

  const handleDeleteDialogClose = () => {
    setSalesRepToDelete(null);
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
              <SalesRepTableRow
                key={rep.id}
                salesRep={rep}
                onEdit={onEdit}
                onDeleteClick={handleDeleteClick}
              />
            ))
          )}
        </TableBody>
      </Table>

      <DeleteConfirmationDialog
        isOpen={!!salesRepToDelete}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently remove the sales rep from the system and all associated data."
      />
    </>
  );
};

export default SalesRepTable;

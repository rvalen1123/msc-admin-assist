
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SalesRep } from '@/types';
import SalesRepActions from './SalesRepActions';

interface SalesRepTableRowProps {
  salesRep: SalesRep;
  onEdit: (id: string, data: Partial<SalesRep>) => void;
  onDeleteClick: (id: string) => void;
}

const SalesRepTableRow: React.FC<SalesRepTableRowProps> = ({
  salesRep,
  onEdit,
  onDeleteClick,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{salesRep.name}</TableCell>
      <TableCell>{salesRep.email}</TableCell>
      <TableCell>{salesRep.territory || "-"}</TableCell>
      <TableCell>
        <Badge variant={salesRep.active ? "success" : "secondary"}>
          {salesRep.active ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(salesRep.createdAt)}</TableCell>
      <TableCell className="text-right">
        <SalesRepActions 
          salesRep={salesRep} 
          onEdit={onEdit} 
          onDelete={onDeleteClick} 
        />
      </TableCell>
    </TableRow>
  );
};

export default SalesRepTableRow;


import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SalesRep } from '@/types';

interface SalesRepDetailsProps {
  salesRep: SalesRep;
}

const SalesRepDetails: React.FC<SalesRepDetailsProps> = ({ salesRep }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Name</p>
          <p>{salesRep.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p>{salesRep.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Phone</p>
          <p>{salesRep.phone || "-"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Territory</p>
          <p>{salesRep.territory || "-"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <Badge variant={salesRep.active ? "success" : "secondary"}>
            {salesRep.active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Added On</p>
          <p>{formatDate(salesRep.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesRepDetails;


import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PriceHistory } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceHistory: PriceHistory[];
  productName: string;
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  open,
  onOpenChange,
  priceHistory,
  productName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Price History for {productName}</DialogTitle>
          <DialogDescription>
            View historical price changes by quarter.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ScrollArea className="h-72 rounded-md border">
            <div className="p-4">
              {priceHistory.length === 0 ? (
                <p className="text-sm text-gray-500">No price history available.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Quarter</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Price</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">National ASP</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {priceHistory
                      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                      .map((history, index) => (
                        <tr key={`${history.productId}-${history.quarter}-${index}`}>
                          <td className="py-2 text-sm">{history.quarter}</td>
                          <td className="py-2 text-sm">${history.price?.toFixed(2) || 'N/A'}</td>
                          <td className="py-2 text-sm">${history.nationalAsp?.toFixed(2) || 'N/A'}</td>
                          <td className="py-2 text-sm">{new Date(history.updatedAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;

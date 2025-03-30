
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/hooks/useProducts';

interface ProductHistoryDialogProps {
  productId: string;
  open: boolean;
  onClose: () => void;
}

const ProductHistoryDialog: React.FC<ProductHistoryDialogProps> = ({ productId, open, onClose }) => {
  const { getPriceHistory, getProductById } = useProducts();
  const product = getProductById(productId);
  const priceHistory = getPriceHistory(productId);
  
  if (!product) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Price History for {product.name}</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          {priceHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No price history available for this product.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quarter</TableHead>
                  <TableHead className="text-right">National ASP</TableHead>
                  <TableHead className="text-right">Our Price</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceHistory.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.quarter}</TableCell>
                    <TableCell className="text-right">
                      ${entry.nationalAsp?.toFixed(2) || '0.00'}
                    </TableCell>
                    <TableCell className="text-right">
                      ${entry.price?.toFixed(2) || '0.00'}
                    </TableCell>
                    <TableCell>
                      {new Date(entry.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductHistoryDialog;

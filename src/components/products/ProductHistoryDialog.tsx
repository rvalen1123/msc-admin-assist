
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductHistoryDialogProps {
  productId: string;
  open: boolean;
  onClose: () => void;
}

const ProductHistoryDialog: React.FC<ProductHistoryDialogProps> = ({ productId, open, onClose }) => {
  const { getPriceHistory, getProductById } = useProducts();
  const product = getProductById(productId);
  const priceHistory = getPriceHistory(productId);
  const isMobile = useIsMobile();
  
  if (!product) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg">Price History for {product.name}</DialogTitle>
        </DialogHeader>
        <div className="pt-2 sm:pt-4">
          {priceHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No price history available for this product.
            </p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quarter</TableHead>
                    {!isMobile && <TableHead className="text-right">National ASP</TableHead>}
                    <TableHead className="text-right">Our Price</TableHead>
                    <TableHead>{isMobile ? "Date" : "Last Updated"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceHistory.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.quarter}</TableCell>
                      {!isMobile && 
                        <TableCell className="text-right">
                          ${entry.nationalAsp?.toFixed(2) || '0.00'}
                        </TableCell>
                      }
                      <TableCell className="text-right">
                        ${entry.price?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>
                        {isMobile 
                          ? new Date(entry.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                          : new Date(entry.updatedAt).toLocaleDateString()
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductHistoryDialog;

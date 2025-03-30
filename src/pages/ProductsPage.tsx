
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import ProductDetailsDialog from '@/components/products/ProductDetailsDialog';
import ProductHistoryDialog from '@/components/products/ProductHistoryDialog';
import ProductForm from '@/components/products/ProductForm';
import { useProducts } from '@/hooks/useProducts';
import { Search, PlusCircle, History, Edit } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ProductsPage: React.FC = () => {
  const { products, manufacturers, isLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const isMobile = useIsMobile();
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.qCode && product.qCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Find manufacturer name by ID
  const getManufacturerName = (id: string) => {
    const manufacturer = manufacturers.find(m => m.id === id);
    return manufacturer ? manufacturer.name : 'Unknown';
  };
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Products</h1>
        <Button onClick={() => setShowProductForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="text-lg md:text-xl">Product Catalog</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <p>Loading products...</p>
            </div>
          ) : (
            <div className={isMobile ? "-mx-2" : "rounded-md border"}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      {!isMobile && <TableHead>Manufacturer</TableHead>}
                      <TableHead>Q Code</TableHead>
                      {!isMobile && <TableHead className="text-right">National ASP</TableHead>}
                      <TableHead className="text-right">Our Price</TableHead>
                      {!isMobile && <TableHead className="text-center">MUE</TableHead>}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 4 : 7} className="h-24 text-center">
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium truncate max-w-[120px]">{product.name}</TableCell>
                          {!isMobile && <TableCell>{getManufacturerName(product.manufacturerId)}</TableCell>}
                          <TableCell>{product.qCode || '-'}</TableCell>
                          {!isMobile && 
                            <TableCell className="text-right">
                              ${product.nationalAsp?.toFixed(2) || '0.00'}
                            </TableCell>
                          }
                          <TableCell className="text-right">
                            ${product.price?.toFixed(2) || '0.00'}
                          </TableCell>
                          {!isMobile && 
                            <TableCell className="text-center">
                              {product.mue || '-'}
                            </TableCell>
                          }
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size={isMobile ? "sm" : "icon"}
                                onClick={() => {
                                  setSelectedProduct(product.id);
                                  setShowHistoryDialog(true);
                                }}
                              >
                                <History className="h-4 w-4" />
                                {isMobile && <span className="ml-1 sr-only">History</span>}
                              </Button>
                              <Button 
                                variant="outline" 
                                size={isMobile ? "sm" : "icon"}
                                onClick={() => {
                                  setSelectedProduct(product.id);
                                  setShowProductForm(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                {isMobile && <span className="ml-1 sr-only">Edit</span>}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {showProductForm && (
        <ProductForm 
          productId={selectedProduct}
          open={showProductForm}
          onClose={() => {
            setShowProductForm(false);
            setSelectedProduct(null);
          }}
        />
      )}
      
      {selectedProduct && showHistoryDialog && (
        <ProductHistoryDialog 
          productId={selectedProduct}
          open={showHistoryDialog}
          onClose={() => {
            setShowHistoryDialog(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductsPage;

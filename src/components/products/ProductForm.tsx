
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { Product, Manufacturer } from '@/types';

interface ProductFormProps {
  productId: string | null;
  open: boolean;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId, open, onClose }) => {
  const { toast } = useToast();
  const { products, manufacturers, addProduct, updateProduct } = useProducts();
  const isEditMode = !!productId;
  
  const defaultProduct = {
    id: '',
    name: '',
    manufacturerId: '',
    description: '',
    price: undefined,
    qCode: '',
    nationalAsp: undefined,
    mue: '',
  };
  
  const [formData, setFormData] = useState<Partial<Product>>(defaultProduct);
  const [currentQuarter, setCurrentQuarter] = useState(`Q${Math.ceil((new Date().getMonth() + 1) / 3)}-${new Date().getFullYear()}`);
  
  useEffect(() => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setFormData(product);
      }
    } else {
      setFormData(defaultProduct);
    }
  }, [productId, products]);
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleNumberChange = (field: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    handleChange(field, numValue);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditMode) {
        updateProduct(productId, formData, currentQuarter);
        toast({
          title: "Product updated",
          description: `${formData.name} has been successfully updated.`
        });
      } else {
        addProduct(formData, currentQuarter);
        toast({
          title: "Product added",
          description: `${formData.name} has been successfully added.`
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving the product.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manufacturer" className="text-right">
                Manufacturer
              </Label>
              <div className="col-span-3">
                <Select 
                  value={formData.manufacturerId} 
                  onValueChange={(value) => handleChange('manufacturerId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map((manufacturer) => (
                      <SelectItem key={manufacturer.id} value={manufacturer.id}>
                        {manufacturer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="qCode" className="text-right">
                Q Code
              </Label>
              <Input
                id="qCode"
                value={formData.qCode || ''}
                onChange={(e) => handleChange('qCode', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nationalAsp" className="text-right">
                National ASP
              </Label>
              <Input
                id="nationalAsp"
                type="number"
                step="0.01"
                value={formData.nationalAsp?.toString() || ''}
                onChange={(e) => handleNumberChange('nationalAsp', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Our Price
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price?.toString() || ''}
                onChange={(e) => handleNumberChange('price', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mue" className="text-right">
                MUE
              </Label>
              <Input
                id="mue"
                value={formData.mue || ''}
                onChange={(e) => handleChange('mue', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quarter" className="text-right">
                Quarter
              </Label>
              <Input
                id="quarter"
                value={currentQuarter}
                onChange={(e) => setCurrentQuarter(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditMode ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;


import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Product } from '@/types';
import FormField from '@/components/FormField';
import { FormField as FormFieldType } from '@/types';

interface AddProductFormProps {
  products: Product[];
  formData: Record<string, any>;
  onFieldChange: (id: string, value: any) => void;
  onAddProduct: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  products,
  formData,
  onFieldChange,
  onAddProduct
}) => {
  // Product selection field
  const productField: FormFieldType = {
    id: 'product',
    label: 'Product',
    type: 'select',
    required: true,
    options: [
      { label: 'Select a product', value: '' },
      ...(products || []).map(p => ({ label: p.name, value: p.id }))
    ]
  };

  // Quantity field
  const quantityField: FormFieldType = {
    id: 'quantity',
    label: 'Quantity',
    type: 'text',
    required: true,
    placeholder: 'Enter quantity'
  };

  return (
    <div className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          field={productField}
          value={formData.product}
          onChange={onFieldChange}
        />
        <FormField
          field={quantityField}
          value={formData.quantity}
          onChange={onFieldChange}
        />
      </div>
      <Button 
        type="button"
        onClick={onAddProduct}
        className="flex items-center"
      >
        <PlusCircle className="mr-1 h-4 w-4" /> Add Product
      </Button>
    </div>
  );
};

export default AddProductForm;

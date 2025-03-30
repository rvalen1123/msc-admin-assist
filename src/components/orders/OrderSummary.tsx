
import React from 'react';
import { FormSection as FormSectionType } from '@/types';
import ProductList from './ProductList';

interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  sections: FormSectionType[];
  formData: Record<string, any>;
  productList: ProductItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ sections, formData, productList }) => {
  return (
    <div className="form-section mb-8">
      <div className="section-header">
        Order Summary
      </div>
      <div className="form-section-content">
        <div className="space-y-8">
          {sections.slice(0, 3).map((section) => (
            <div key={section.id}>
              <h3 className="font-medium text-primary mb-3">{section.title}</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                  {section.fields.map((field) => {
                    const value = formData[field.id];
                    if (!value) return null;
                    
                    let displayValue: string;
                    if (field.type === 'select' && field.options) {
                      const option = field.options.find(o => o.value === value);
                      displayValue = option?.label || value;
                    } else if (field.type === 'checkbox' && field.options) {
                      displayValue = value ? 'Yes' : 'No';
                    } else {
                      displayValue = value.toString();
                    }
                    
                    return (
                      <div key={field.id} className="py-1">
                        <dt className="text-xs font-medium text-gray-500">{field.label}:</dt>
                        <dd className="text-sm">{displayValue}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </div>
          ))}
          
          <div>
            <h3 className="font-medium text-primary mb-3">Order Products</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              {productList.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No products selected.</p>
              ) : (
                <ProductList products={productList} onRemove={() => {}} showActions={false} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

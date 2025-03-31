
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface ProductListProps {
  products: ProductItem[];
  onRemove: (id: string) => void;
  showActions?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onRemove, 
  showActions = true 
}) => {
  const calculateTotal = () => {
    return products.reduce((sum, product) => sum + (product.price * product.quantity), 0).toFixed(2);
  };

  if (products.length === 0) {
    return (
      <p className="text-gray-500 text-sm italic py-4">
        No products added yet. Use the form above to add products.
      </p>
    );
  }

  return (
    <div className="border rounded-md">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            {showActions && (
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="py-3 px-3 text-sm">
                {product.name}
              </td>
              <td className="py-3 px-3 text-sm">
                {product.quantity}
              </td>
              <td className="py-3 px-3 text-sm">
                ${product.price.toFixed(2)}
              </td>
              <td className="py-3 px-3 text-sm">
                ${(product.price * product.quantity).toFixed(2)}
              </td>
              {showActions && (
                <td className="py-3 px-3 text-sm">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100"
                    onClick={() => onRemove(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              )}
            </tr>
          ))}
          <tr className="bg-gray-50">
            <td colSpan={showActions ? 3 : 3} className="py-3 px-3 text-sm font-medium text-right">
              Subtotal:
            </td>
            <td colSpan={showActions ? 2 : 1} className="py-3 px-3 text-sm font-medium">
              ${calculateTotal()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;

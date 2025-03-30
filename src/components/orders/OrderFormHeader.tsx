
import React from 'react';
import { FormTemplate } from '@/types';

interface OrderFormHeaderProps {
  form: FormTemplate;
}

const OrderFormHeader: React.FC<OrderFormHeaderProps> = ({ form }) => {
  return (
    <div className="bg-blue-600 text-white py-4 px-6 rounded-t-md">
      <h1 className="text-xl font-semibold">{form.title}</h1>
      <p className="text-sm text-blue-100">{form.description}</p>
    </div>
  );
};

export default OrderFormHeader;

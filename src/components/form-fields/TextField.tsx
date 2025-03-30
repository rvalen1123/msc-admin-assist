
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormField } from '@/types';

interface TextFieldProps {
  field: FormField;
  value: string;
  onChange: (id: string, value: any) => void;
}

export const TextField: React.FC<TextFieldProps> = ({ field, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field.id, e.target.value);
  };

  return (
    <Input
      type={field.type === 'date' ? 'date' : field.type === 'phone' ? 'tel' : field.type === 'number' ? 'number' : 'text'}
      id={field.id}
      placeholder={field.placeholder}
      value={value || ''}
      onChange={handleChange}
      className="form-input"
    />
  );
};

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
      id={field.id}
      name={field.id}
      type={field.type === 'phone' ? 'tel' : field.type === 'date' ? 'date' : field.type}
      placeholder={field.placeholder}
      value={value || ''}
      onChange={handleChange}
      required={field.required}
      className="form-input w-full"
    />
  );
};

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/types';

interface TextAreaFieldProps {
  field: FormField;
  value: string;
  onChange: (id: string, value: any) => void;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ field, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(field.id, e.target.value);
  };

  return (
    <Textarea
      id={field.id}
      name={field.id}
      placeholder={field.placeholder}
      value={value || ''}
      onChange={handleChange}
      required={field.required}
      className="form-input min-h-[100px] w-full"
    />
  );
};

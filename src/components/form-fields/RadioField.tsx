
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormField } from '@/types';

interface RadioFieldProps {
  field: FormField;
  value: string;
  onChange: (id: string, value: any) => void;
}

export const RadioField: React.FC<RadioFieldProps> = ({ field, value, onChange }) => {
  const handleChange = (newValue: string) => {
    onChange(field.id, newValue);
  };

  return (
    <RadioGroup
      value={value || ''}
      onValueChange={handleChange}
      className="space-y-2"
    >
      {field.options?.map((option) => (
        <div key={option.value || `option-${option.label}`} className="flex items-center space-x-2">
          <RadioGroupItem 
            id={`${field.id}-${option.value || `option-${option.label}`}`} 
            value={option.value || `option-${option.label}`} 
          />
          <Label
            htmlFor={`${field.id}-${option.value || `option-${option.label}`}`}
            className="text-sm font-normal"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

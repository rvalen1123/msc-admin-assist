
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormField } from '@/types';

interface CheckboxFieldProps {
  field: FormField;
  value: boolean | string[];
  onChange: (id: string, value: any) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ field, value, onChange }) => {
  const handleCheckboxChange = (option: { label: string; value: string }, checked: boolean) => {
    if (field.options && field.options.length === 1 && option.value === 'true') {
      // Single checkbox case
      onChange(field.id, checked);
    } else {
      // Multiple checkboxes case
      const newValue = Array.isArray(value) ? [...value] : [];
      const optionValue = option.value || `option-${option.label}`;
      
      if (checked) {
        if (!newValue.includes(optionValue)) {
          newValue.push(optionValue);
        }
      } else {
        const index = newValue.indexOf(optionValue);
        if (index !== -1) {
          newValue.splice(index, 1);
        }
      }
      
      onChange(field.id, newValue);
    }
  };
  
  return (
    <div className="space-y-2">
      {field.options?.map((option) => {
        // Handle both array of values and single boolean
        const isChecked = Array.isArray(value)
          ? value.includes(option.value)
          : option.value === 'true'
            ? !!value
            : value === option.value;
        
        return (
          <div key={option.value || `option-${option.label}`} className="flex items-center space-x-2">
            <Checkbox
              id={`${field.id}-${option.value || `option-${option.label}`}`}
              checked={isChecked}
              onCheckedChange={(checked) => handleCheckboxChange(option, !!checked)}
            />
            <Label
              htmlFor={`${field.id}-${option.value || `option-${option.label}`}`}
              className="text-sm font-normal"
            >
              {option.label}
            </Label>
          </div>
        );
      })}
    </div>
  );
};

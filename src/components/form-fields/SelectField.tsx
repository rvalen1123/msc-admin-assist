
import React, { useEffect, useState } from 'react';
import { FormField } from '@/types';
import { getSalesReps } from '@/data/salesRepData';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectFieldProps {
  field: FormField;
  value: string;
  onChange: (id: string, value: any) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ field, value, onChange }) => {
  const [salesReps, setSalesReps] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load sales reps for dropdowns if the field is salesRepName or similar
    if (field.id.toLowerCase().includes('salesrep') || field.id.toLowerCase().includes('sales_rep')) {
      const reps = getSalesReps();
      setSalesReps(reps.filter(rep => rep.active).map(rep => ({
        label: rep.name,
        value: rep.id
      })));
    }
  }, [field.id]);

  const handleChange = (newValue: string) => {
    onChange(field.id, newValue);
  };

  // Check if this is a sales rep field and use the dynamically loaded sales reps
  const options = field.id.toLowerCase().includes('salesrep') || field.id.toLowerCase().includes('sales_rep')
    ? [{ label: 'Select a sales rep', value: '' }, ...salesReps]
    : field.options || [];

  return (
    <Select
      value={value || ''}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={field.placeholder || 'Select...'} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem 
              key={option.value || `option-${option.label}`} 
              value={option.value || `option-${option.label}`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

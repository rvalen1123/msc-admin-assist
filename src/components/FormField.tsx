
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField as FormFieldType } from '@/types';
import { cn } from '@/lib/utils';
import { getSalesReps } from '@/data/salesRepData';

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (id: string, value: any) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange }) => {
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
  
  const handleChange = (newValue: any) => {
    onChange(field.id, newValue);
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'phone':
      case 'date':
        return (
          <Input
            type={field.type === 'date' ? 'date' : field.type === 'phone' ? 'tel' : field.type === 'number' ? 'number' : field.type}
            id={field.id}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="form-input"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="form-input min-h-[100px]"
          />
        );
      
      case 'select':
        // Check if this is a sales rep field and use the dynamically loaded sales reps
        const options = field.id.toLowerCase().includes('salesrep') || field.id.toLowerCase().includes('sales_rep')
          ? [...(field.options || []).filter(opt => opt.value === ''), ...salesReps]
          : field.options;
            
        return (
          <Select
            value={value || ''}
            onValueChange={handleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select...'} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options?.map((option) => (
                  // Ensure option.value is never an empty string
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
      
      case 'checkbox':
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
                    onCheckedChange={(checked) => {
                      if (field.options && field.options.length === 1 && option.value === 'true') {
                        // Single checkbox case
                        handleChange(checked);
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
                        handleChange(newValue);
                      }
                    }}
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
      
      case 'radio':
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
      
      default:
        return <p>Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <div className="mb-4">
      <Label
        htmlFor={field.id}
        className={cn(
          "block text-sm font-medium mb-1",
          field.required && "required-field"
        )}
      >
        {field.label}
      </Label>
      {renderField()}
      {field.error && <p className="error-text">{field.error}</p>}
    </div>
  );
};

export default FormField;

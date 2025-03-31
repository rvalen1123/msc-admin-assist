
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { FormField as FormFieldType } from '@/types';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';
import { CheckboxField } from './CheckboxField';
import { RadioField } from './RadioField';
import { SelectField } from './SelectField';

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (id: string, value: any) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange }) => {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'phone':
      case 'date':
        return <TextField field={field} value={value} onChange={onChange} />;
      
      case 'textarea':
        return <TextAreaField field={field} value={value} onChange={onChange} />;
      
      case 'select':
        return <SelectField field={field} value={value} onChange={onChange} />;
      
      case 'checkbox':
        return <CheckboxField field={field} value={value} onChange={onChange} />;
      
      case 'radio':
        return <RadioField field={field} value={value} onChange={onChange} />;
      
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

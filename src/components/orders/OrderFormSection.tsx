import { FC } from 'react';
import FormField from '@/components/FormField';
import { FormSection as FormSectionType } from '@/types';

interface OrderFormSectionProps {
  section: FormSectionType;
  formData: Record<string, unknown>;
  onFieldChange: (id: string, value: unknown) => void;
}

const OrderFormSection: FC<OrderFormSectionProps> = ({ 
  section, 
  formData, 
  onFieldChange 
}) => {
  return (
    <div key={section.id} className="form-section mb-8">
      <div className="section-header">
        {section.title}
      </div>
      <div className="form-section-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.fields.map((field) => (
            <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <FormField
                field={field}
                value={formData[field.id]}
                onChange={onFieldChange}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderFormSection;

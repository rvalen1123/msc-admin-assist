
import React from 'react';
import { Separator } from '@/components/ui/separator';
import FormStepIndicator from '@/components/FormStepIndicator';
import FormField from '@/components/FormField';
import { FormSection as FormSectionType, FormTemplate } from '@/types';

interface FormContentProps {
  activeForm: FormTemplate;
  formData: Record<string, any>;
  formProgress: { currentStep: number; totalSteps: number; percentComplete: number };
  sections: FormSectionType[];
  onFieldChange: (id: string, value: any) => void;
  children: React.ReactNode;
}

const FormContent: React.FC<FormContentProps> = ({
  activeForm,
  formData,
  formProgress,
  sections,
  onFieldChange,
  children,
}) => {
  return (
    <form>
      <FormStepIndicator
        currentStep={formProgress.currentStep}
        steps={activeForm.steps}
      />
      
      {sections.map((section) => (
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
      ))}
      
      <Separator className="my-6" />
      {children}
    </form>
  );
};

export default FormContent;

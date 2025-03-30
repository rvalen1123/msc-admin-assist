
import React from 'react';
import { Separator } from '@/components/ui/separator';
import FormStepIndicator from '@/components/FormStepIndicator';
import FormSection from '@/components/form/FormSection';
import { FormSection as FormSectionType, FormTemplate } from '@/types';

interface FormContentProps {
  activeForm: FormTemplate;
  formData: Record<string, any>;
  formProgress: { currentStep: number; totalSteps: number; percentComplete: number };
  sections: FormSectionType[];
  onFieldChange: (id: string, value: any) => void;
  children: React.ReactNode;
  className?: string;
}

const FormContent: React.FC<FormContentProps> = ({
  activeForm,
  formData,
  formProgress,
  sections,
  onFieldChange,
  children,
  className,
}) => {
  return (
    <form className={className}>
      <FormStepIndicator
        currentStep={formProgress.currentStep}
        steps={activeForm.steps}
      />
      
      {sections.map((section) => (
        <FormSection
          key={section.id}
          section={section}
          formData={formData}
          onFieldChange={onFieldChange}
        />
      ))}
      
      <Separator className="my-6" />
      {children}
    </form>
  );
};

export default FormContent;

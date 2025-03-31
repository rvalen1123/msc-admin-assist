
import React from 'react';
import { Separator } from '@/components/ui/separator';
import FormStepIndicator from '@/components/FormStepIndicator';
import { FormProgress, FormTemplate } from '@/types';
import FormFooter from '@/components/form/FormFooter';

interface InsuranceReviewProps {
  activeForm: FormTemplate;
  formData: Record<string, unknown>;
  formProgress: FormProgress;
  onPrevious: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const InsuranceReview: React.FC<InsuranceReviewProps> = ({
  activeForm,
  formData,
  formProgress,
  onPrevious,
  onSubmit,
  isLoading
}) => {
  return (
    <div>
      <FormStepIndicator
        currentStep={formProgress.currentStep}
        steps={activeForm.steps}
      />
      
      <div className="form-section mb-8">
        <div className="section-header">
          Review Information
        </div>
        <div className="form-section-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <p className="text-sm mb-4">Please review the information below before submitting:</p>
              
              {activeForm.sections.map((section) => (
                <div key={section.id} className="mb-6">
                  <h3 className="font-medium text-primary mb-2">{section.title}</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {section.fields.map((field) => {
                        const value = formData[field.id];
                        if (!value) return null;
                        
                        let displayValue: string;
                        if (field.type === 'select' && field.options) {
                          const option = field.options.find(o => o.value === value);
                          displayValue = option?.label || value.toString();
                        } else if (field.type === 'radio' && field.options) {
                          const option = field.options.find(o => o.value === value);
                          displayValue = option?.label || value.toString();
                        } else if (field.type === 'checkbox' && field.options) {
                          if (Array.isArray(value)) {
                            displayValue = value.map(v => {
                              const option = field.options?.find(o => o.value === v);
                              return option?.label || v;
                            }).join(', ');
                          } else {
                            displayValue = value ? 'Yes' : 'No';
                          }
                        } else {
                          displayValue = value.toString();
                        }
                        
                        return (
                          <div key={field.id} className="py-1">
                            <dt className="text-xs font-medium text-gray-500">{field.label}:</dt>
                            <dd className="text-sm">{displayValue}</dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <FormFooter 
        currentStep={formProgress.currentStep}
        totalSteps={formProgress.totalSteps}
        onPrevious={onPrevious}
        onNext={onSubmit}
        isLastStep={true}
        isLoading={isLoading}
      />
    </div>
  );
};

export default InsuranceReview;

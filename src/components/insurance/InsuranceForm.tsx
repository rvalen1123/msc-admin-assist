
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useForm } from '@/context/FormContext';
import { FormSection as FormSectionType } from '@/types';
import FormHeader from '@/components/form/FormHeader';
import FormContent from '@/components/form/FormContent';
import FormFooter from '@/components/form/FormFooter';
import InsuranceReview from './InsuranceReview';

const InsuranceForm: React.FC = () => {
  const { 
    activeForm, 
    formData, 
    formProgress, 
    goToNextStep, 
    goToPreviousStep, 
    submitForm,
    setFieldValue
  } = useForm();
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Handle form field changes
  const handleFieldChange = (id: string, value: any) => {
    setFieldValue(id, value);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formProgress.currentStep < formProgress.totalSteps) {
      const success = goToNextStep();
      if (!success) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive"
        });
      }
    } else {
      try {
        setLoading(true);
        await submitForm();
        toast({
          title: "Success",
          description: "Insurance verification request submitted successfully.",
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        toast({
          title: "Error",
          description: "There was an error submitting the form. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };
  
  if (!activeForm) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p>Loading form...</p>
      </div>
    );
  }
  
  // Get sections for current step
  const currentStepSections = activeForm.steps[formProgress.currentStep - 1]?.sections || [];
  const sections = currentStepSections.map(sectionId => 
    activeForm.sections.find(s => s.id === sectionId)
  ).filter(Boolean) as FormSectionType[];

  // If we're on the last step (review), show a summary
  const isReviewStep = formProgress.currentStep === formProgress.totalSteps;

  return (
    <div>
      <FormHeader form={activeForm} />
      
      <Card className="border-t-0 rounded-t-none">
        <CardContent className="pt-6">
          {!isReviewStep ? (
            <FormContent 
              activeForm={activeForm}
              formData={formData}
              formProgress={formProgress}
              sections={sections}
              onFieldChange={handleFieldChange}
            >
              <FormFooter 
                currentStep={formProgress.currentStep}
                totalSteps={formProgress.totalSteps}
                onPrevious={goToPreviousStep}
                onNext={handleSubmit}
                isLastStep={isReviewStep}
                isLoading={loading}
              />
            </FormContent>
          ) : (
            <InsuranceReview 
              activeForm={activeForm} 
              formData={formData}
              formProgress={formProgress}
              onPrevious={goToPreviousStep}
              onSubmit={handleSubmit}
              isLoading={loading}
            />
          )}
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-gray-500 mt-4">
        Need help? Contact support at (555) 123-4567
      </div>
    </div>
  );
};

export default InsuranceForm;

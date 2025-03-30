
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FormStepIndicator from '@/components/FormStepIndicator';
import FormField from '@/components/FormField';
import { useForm } from '@/context/FormContext';
import { FormSection as FormSectionType } from '@/types';

const OnboardingPage: React.FC = () => {
  const { 
    activeForm, 
    formData, 
    formProgress, 
    setActiveForm, 
    goToNextStep, 
    goToPreviousStep, 
    submitForm,
    setFieldValue
  } = useForm();
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Set active form type to onboarding on component mount
  useEffect(() => {
    setActiveForm('onboarding');
  }, [setActiveForm]);
  
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
          description: "Onboarding form submitted successfully.",
        });
        
        // Simulate redirect to DocuSeal for signing
        setTimeout(() => {
          toast({
            title: "Redirecting",
            description: "Opening DocuSeal for electronic signature...",
          });
          
          setTimeout(() => {
            window.open('https://docuseal.co', '_blank');
          }, 1500);
        }, 1000);
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

  return (
    <div>
      <div className="bg-blue-600 text-white py-4 px-6 rounded-t-md">
        <h1 className="text-xl font-semibold">{activeForm.title}</h1>
        <p className="text-sm text-blue-100">{activeForm.description}</p>
      </div>
      
      <Card className="border-t-0 rounded-t-none">
        <CardContent className="pt-6">
          <FormStepIndicator
            currentStep={formProgress.currentStep}
            steps={activeForm.steps}
          />
          
          <form onSubmit={handleSubmit}>
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
                          onChange={handleFieldChange}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={formProgress.currentStep === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              
              <div className="text-sm text-gray-500">
                Step {formProgress.currentStep} of {formProgress.totalSteps}
              </div>
              
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  'Processing...'
                ) : formProgress.currentStep === formProgress.totalSteps ? (
                  'Submit Form'
                ) : (
                  <>Continue <ChevronRight className="h-4 w-4 ml-1" /></>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-gray-500 mt-4">
        Need help? Contact support at (555) 123-4567
      </div>
    </div>
  );
};

export default OnboardingPage;

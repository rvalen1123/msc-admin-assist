import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useForm } from '@/context/FormContext';
import { FormSection as FormSectionType } from '@/types';
import { useNavigate } from 'react-router-dom';
import FormHeader from '@/components/form/FormHeader';
import FormContent from '@/components/form/FormContent';
import FormFooter from '@/components/form/FormFooter';

const OnboardingPage: React.FC = () => {
  const { 
    activeForm, 
    formData, 
    formProgress, 
    setActiveForm, 
    goToNextStep, 
    goToPreviousStep, 
    submitForm,
    setFieldValue,
    addCustomer
  } = useForm();
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isInitialized = useRef(false);
  
  // Set active form type to onboarding on component mount, but only if it's not already set
  useEffect(() => {
    if (!isInitialized.current && (!activeForm || activeForm.id !== 'onboarding')) {
      setActiveForm('onboarding');
      isInitialized.current = true;
    }
  }, [setActiveForm, activeForm]);
  
  // Handle form field changes
  const handleFieldChange = (id: string, value: any) => {
    setFieldValue(id, value);
  };
  
  // Create customer from form data
  const createCustomerFromFormData = () => {
    // Extract relevant customer information from form data
    const customerData = {
      id: `customer-${Date.now()}`,
      name: formData.companyName || formData.firstName + ' ' + formData.lastName,
      email: formData.email || '',
      phone: formData.phoneNumber || '',
      company: formData.companyName || '',
      address: formData.address ? {
        line1: formData.address || '',
        line2: formData.address2 || '',
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
        country: formData.country || 'United States'
      } : undefined,
      contacts: formData.contactName ? [{
        name: formData.contactName || formData.firstName + ' ' + formData.lastName,
        title: formData.contactTitle || '',
        email: formData.contactEmail || formData.email || '',
        phone: formData.contactPhone || formData.phoneNumber || '',
        isPrimary: true
      }] : undefined
    };
    
    return addCustomer(customerData);
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
        
        // Submit form
        const submission = await submitForm();
        
        // Create customer record from form data
        const customerId = createCustomerFromFormData();
        
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
            
            // After a short delay, navigate to the customer view page
            setTimeout(() => {
              navigate('/customers');
            }, 1000);
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
      <FormHeader form={activeForm} />
      
      <Card className="border-t-0 rounded-t-none">
        <CardContent className="pt-6">
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
              isLastStep={formProgress.currentStep === formProgress.totalSteps}
              isLoading={loading}
            />
          </FormContent>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-gray-500 mt-4">
        Need help? Contact support at (555) 123-4567
      </div>
    </div>
  );
};

export default OnboardingPage;

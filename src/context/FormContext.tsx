
import React, { createContext, useContext, useState } from 'react';
import { FormType, FormTemplate, FormProgress, FormSubmission } from '../types';
import { forms } from '../data/mockData';
import { useToast } from '@/components/ui/use-toast';

interface FormContextType {
  activeForm: FormTemplate | null;
  formData: Record<string, any>;
  formProgress: FormProgress;
  formSubmissions: FormSubmission[];
  setActiveForm: (formType: FormType) => void;
  updateFormData: (data: Record<string, any>) => void;
  goToNextStep: () => boolean;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  submitForm: () => Promise<FormSubmission>;
  getFieldValue: (fieldId: string) => any;
  setFieldValue: (fieldId: string, value: any) => void;
}

const FormContext = createContext<FormContextType | null>(null);

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeForm, setActiveFormState] = useState<FormTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formProgress, setFormProgress] = useState<FormProgress>({
    currentStep: 1,
    totalSteps: 0,
    percentComplete: 0
  });
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  
  const { toast } = useToast();

  const setActiveForm = (formType: FormType) => {
    const formTemplate = forms[formType];
    if (formTemplate) {
      setActiveFormState(formTemplate);
      setFormProgress({
        currentStep: 1,
        totalSteps: formTemplate.steps.length,
        percentComplete: (1 / formTemplate.steps.length) * 100
      });
      setFormData({});
    } else {
      console.error(`Form template for type ${formType} not found.`);
    }
  };

  const updateFormData = (data: Record<string, any>) => {
    setFormData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  const getFieldValue = (fieldId: string) => {
    return formData[fieldId] || '';
  };

  const setFieldValue = (fieldId: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldId]: value
    }));
  };

  const goToNextStep = () => {
    // Validate current step before proceeding
    if (!activeForm) return false;
    
    // Get fields for current step
    const currentStepId = activeForm.steps[formProgress.currentStep - 1].id;
    const currentSections = activeForm.steps[formProgress.currentStep - 1].sections;
    const currentSectionFields = currentSections.flatMap(sectionId => {
      const section = activeForm.sections.find(s => s.id === sectionId);
      return section ? section.fields : [];
    });
    
    // Check required fields
    const requiredFields = currentSectionFields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => {
      const value = formData[field.id];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      toast({
        title: "Required fields missing",
        description: `Please fill in all required fields before proceeding.`,
        variant: "destructive"
      });
      return false;
    }
    
    // If validation passes, go to next step
    if (formProgress.currentStep < formProgress.totalSteps) {
      const nextStep = formProgress.currentStep + 1;
      setFormProgress({
        ...formProgress,
        currentStep: nextStep,
        percentComplete: (nextStep / formProgress.totalSteps) * 100
      });
      return true;
    }
    return false;
  };

  const goToPreviousStep = () => {
    if (formProgress.currentStep > 1) {
      const prevStep = formProgress.currentStep - 1;
      setFormProgress({
        ...formProgress,
        currentStep: prevStep,
        percentComplete: (prevStep / formProgress.totalSteps) * 100
      });
    }
  };

  const goToStep = (step: number) => {
    if (step > 0 && step <= formProgress.totalSteps) {
      setFormProgress({
        ...formProgress,
        currentStep: step,
        percentComplete: (step / formProgress.totalSteps) * 100
      });
    }
  };

  const resetForm = () => {
    if (activeForm) {
      setFormProgress({
        currentStep: 1,
        totalSteps: activeForm.steps.length,
        percentComplete: (1 / activeForm.steps.length) * 100
      });
      setFormData({});
    }
  };

  const submitForm = async (): Promise<FormSubmission> => {
    if (!activeForm) {
      throw new Error('No active form to submit');
    }
    
    // In a real app, you'd send this data to your backend
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newSubmission: FormSubmission = {
      id: `submission-${Date.now()}`,
      templateId: activeForm.id,
      userId: 'current-user-id', // In a real app, get this from auth context
      data: { ...formData },
      status: 'submitted',
      submittedAt: new Date(),
      pdfUrl: '/sample-document.pdf' // In a real app, this would be generated by DocuSeal API
    };
    
    setFormSubmissions(prev => [...prev, newSubmission]);
    
    return newSubmission;
  };

  const value = {
    activeForm,
    formData,
    formProgress,
    formSubmissions,
    setActiveForm,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetForm,
    submitForm,
    getFieldValue,
    setFieldValue
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

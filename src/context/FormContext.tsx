/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import { onboardingFormTemplate, insuranceFormTemplate, orderFormTemplate } from '@/data/mockData';
import { FormTemplate, FormField, CustomerData, FormType } from '@/types';

interface FormProgress {
  currentStep: number;
  totalSteps: number;
  percentComplete: number;
}

type FormDataValue = string | number | boolean | null;
type FormDataType = Record<string, FormDataValue>;

interface FormContextType {
  activeForm: FormTemplate | null;
  formData: FormDataType;
  formProgress: FormProgress;
  setActiveForm: (formType: FormType) => void;
  setFieldValue: (fieldId: string, value: FormDataValue) => void;
  goToNextStep: () => boolean;
  goToPreviousStep: () => void;
  submitForm: () => Promise<{ success: boolean; formData: FormDataType }>;
  resetForm: () => void;
  addCustomer: (customerData: Partial<CustomerData>) => Promise<string>;
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
  const [formData, setFormData] = useState<FormDataType>({});
  const [currentStep, setCurrentStep] = useState(1);

  // Set active form based on form type
  const setActiveForm = (formType: FormType) => {
    let template: FormTemplate | null = null;
    
    switch (formType) {
      case 'onboarding':
        template = onboardingFormTemplate;
        break;
      case 'insurance':
        template = insuranceFormTemplate;
        break;
      case 'order':
        template = orderFormTemplate;
        break;
      default:
        template = null;
    }
    
    setActiveFormState(template);
    setCurrentStep(1);
    setFormData({});
  };

  // Set field value in form data
  const setFieldValue = (fieldId: string, value: FormDataValue) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  // Progress to next step in multi-step form
  const goToNextStep = (): boolean => {
    if (!activeForm) return false;
    
    // Validate current step
    const currentStepSections = activeForm.steps[currentStep - 1]?.sections || [];
    const fieldsInCurrentStep: FormField[] = [];
    
    // Get all fields in the current step
    currentStepSections.forEach(sectionId => {
      const section = activeForm.sections.find(s => s.id === sectionId);
      if (section) {
        fieldsInCurrentStep.push(...section.fields);
      }
    });
    
    // Check if all required fields are filled
    const requiredFields = fieldsInCurrentStep.filter(f => f.required);
    const isValid = requiredFields.every(field => {
      const value = formData[field.id];
      return value !== undefined && value !== null && value !== '';
    });
    
    if (!isValid) {
      return false;
    }
    
    // Proceed to next step
    if (currentStep < activeForm.steps.length) {
      setCurrentStep(prev => prev + 1);
      return true;
    }
    
    return true;
  };

  // Go back to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Submit the form
  const submitForm = async (): Promise<{ success: boolean; formData: FormDataType }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, formData });
      }, 1000);
    });
  };

  // Reset form data and go back to step 1
  const resetForm = () => {
    setFormData({});
    setCurrentStep(1);
  };

  // Add customer from form data
  const addCustomer = async (customerData: Partial<CustomerData>): Promise<string> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('customer-123');
      }, 500);
    });
  };

  // Form progress data
  const formProgress: FormProgress = {
    currentStep,
    totalSteps: activeForm?.steps.length || 1,
    percentComplete: activeForm ? ((currentStep - 1) / (activeForm.steps.length - 1)) * 100 : 0,
  };

  const value: FormContextType = {
    activeForm,
    formData,
    formProgress,
    setActiveForm,
    setFieldValue,
    goToNextStep,
    goToPreviousStep,
    submitForm,
    resetForm,
    addCustomer,
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

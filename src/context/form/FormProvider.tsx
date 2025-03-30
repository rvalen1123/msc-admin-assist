
import React, { createContext, useContext } from 'react';
import { FormContextType } from './FormContextTypes';
import { useFormManagement } from './useFormManagement';
import { useCustomerManagement } from './useCustomerManagement';

const FormContext = createContext<FormContextType | null>(null);

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
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
  } = useFormManagement();
  
  const {
    customers,
    addCustomer,
    updateCustomer,
    getCustomers,
    getCustomerById
  } = useCustomerManagement();

  const value: FormContextType = {
    activeForm,
    formData,
    formProgress,
    formSubmissions,
    customers,
    setActiveForm,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetForm,
    submitForm,
    getFieldValue,
    setFieldValue,
    addCustomer,
    updateCustomer,
    getCustomers,
    getCustomerById
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

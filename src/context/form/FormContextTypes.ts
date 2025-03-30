
import { FormTemplate, FormProgress, FormSubmission, CustomerData, FormType } from '../../types';

export interface FormContextType {
  activeForm: FormTemplate | null;
  formData: Record<string, any>;
  formProgress: FormProgress;
  formSubmissions: FormSubmission[];
  customers: CustomerData[];
  setActiveForm: (formType: FormType) => void;
  updateFormData: (data: Record<string, any>) => void;
  goToNextStep: () => boolean;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  submitForm: () => Promise<FormSubmission>;
  getFieldValue: (fieldId: string) => any;
  setFieldValue: (fieldId: string, value: any) => void;
  addCustomer: (customer: CustomerData) => string;
  updateCustomer: (id: string, data: Partial<CustomerData>) => boolean;
  getCustomers: () => CustomerData[];
  getCustomerById: (id: string) => CustomerData | undefined;
}

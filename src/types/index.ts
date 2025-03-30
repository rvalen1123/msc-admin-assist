
export type UserRole = 'admin' | 'customer' | 'sales';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
}

export interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone?: string;
  territory?: string;
  active: boolean;
  createdAt: Date;
}

export interface Manufacturer {
  id: string;
  name: string;
  logo?: string;
}

export interface Product {
  id: string;
  name: string;
  manufacturerId: string;
  description?: string;
  price?: number;
}

export type FormType = 'onboarding' | 'insurance' | 'order' | 'dme';

export interface FormProgress {
  currentStep: number;
  totalSteps: number;
  percentComplete: number;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date';
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  value?: string | boolean | string[];
  error?: string;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormTemplate {
  id: string;
  type: FormType;
  title: string;
  description: string;
  sections: FormSection[];
  steps: {
    id: string;
    title: string;
    sections: string[]; // section ids
  }[];
  manufacturerId?: string;
  productId?: string;
}

export interface FormSubmission {
  id: string;
  templateId: string;
  userId: string;
  data: Record<string, any>;
  status: 'draft' | 'submitted' | 'processing' | 'completed' | 'rejected';
  submittedAt?: Date;
  completedAt?: Date;
  pdfUrl?: string;
}

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: Address;
  contacts?: Contact[];
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Contact {
  name: string;
  title?: string;
  email: string;
  phone?: string;
  isPrimary: boolean;
}

export interface AIAssistantResponse {
  field: string;
  value: string;
  confidence: number;
}

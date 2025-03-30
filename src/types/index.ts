export interface Product {
  id: string;
  name: string;
  manufacturerId: string;
  description: string;
  price?: number;
}

export interface Manufacturer {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  customerId: string;
  orderDate: Date;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export interface Submission {
  id: string;
  formId: string;
  customerId: string;
  dateSubmitted: Date;
  formData: Record<string, any>;
}

export interface SalesRep {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  region: string;
}

export interface PriceHistory {
  productId: string;
  quarter: string;
  price?: number;
  nationalAsp?: number;
  updatedAt: Date;
}

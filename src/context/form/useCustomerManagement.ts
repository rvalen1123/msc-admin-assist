
import { useState } from 'react';
import { CustomerData } from '../../types';

export const useCustomerManagement = () => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  
  const addCustomer = (customer: CustomerData): string => {
    // Generate ID if not provided
    const customerId = customer.id || `customer-${Date.now()}`;
    const newCustomer = { ...customer, id: customerId };
    
    // Check if customer already exists
    const existingIndex = customers.findIndex(c => c.id === customerId);
    
    if (existingIndex >= 0) {
      // Update existing customer
      const updatedCustomers = [...customers];
      updatedCustomers[existingIndex] = newCustomer;
      setCustomers(updatedCustomers);
    } else {
      // Add new customer
      setCustomers(prev => [...prev, newCustomer]);
    }
    
    return customerId;
  };
  
  const updateCustomer = (id: string, data: Partial<CustomerData>): boolean => {
    const customerIndex = customers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) {
      return false;
    }
    
    const updatedCustomers = [...customers];
    updatedCustomers[customerIndex] = {
      ...updatedCustomers[customerIndex],
      ...data
    };
    
    setCustomers(updatedCustomers);
    return true;
  };
  
  const getCustomers = (): CustomerData[] => {
    return customers;
  };
  
  const getCustomerById = (id: string): CustomerData | undefined => {
    return customers.find(c => c.id === id);
  };

  return {
    customers,
    addCustomer,
    updateCustomer,
    getCustomers,
    getCustomerById
  };
};
